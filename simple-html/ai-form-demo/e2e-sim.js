/**
 * e2e-sim.js — 在 node 内存中模拟「宿主 + AI助手」的 postMessage 全链路，
 * 验证通用填单协议的消息交换与 AI 翻译逻辑（业务无关）。
 * 运行： node e2e-sim.js
 *
 * CrossDomainBus 在浏览器里以 window 为消息宿主；本测试用一个共享的
 * 全局 window 广播中心来模拟（足够验证 action 流 + 翻译逻辑正确性）。
 */
'use strict';
const fs = require('fs');
const dir = __dirname;

// ---- 共享全局 window：所有 bus 监听它，postMessage 广播给所有 message 监听器 ----
const listeners = [];
const win = {
  addEventListener(t, fn) { if (t === 'message') listeners.push(fn); },
  removeEventListener(t, fn) { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); },
  postMessage(msg, origin) { listeners.forEach((h) => h({ data: msg, origin: origin || null })); },
};
global.window = win; // 让 cross-domain-bus.js 的自调用闭包捕获到 window

function loadScript(file) {
  const code = fs.readFileSync(file, 'utf8');
  eval(code); // 在共享全局上下文执行
}

// 注入 window 后加载共享脚本
loadScript(dir + '/cross-domain-bus.js');
const schemaG = { window: win };
eval(fs.readFileSync(dir + '/schema-demo.js', 'utf8'));
eval(fs.readFileSync(dir + '/ai-backend-demo.js', 'utf8'));
const schema = win.DEMO_SCHEMA;
const AI = win.AIBackend;

// 宿主与助手各持一份 bus（面向同一个 window 广播中心，target 用 window 自身；
// 这里 myOrigin=null 跳过 origin 校验，专注协议流；origin 校验单独断言）
const hostBus = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*' });
const asstBus = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*' });
hostBus.init(); asstBus.init();

let pass = 0, fail = 0;
function assert(cond, msg) { if (cond) { pass++; console.log('  ✓ ' + msg); } else { fail++; console.log('  ✗ ' + msg); } }

// ---- 场景 0：跨域 origin 校验（myOrigin 只放行来源匹配的消息）----
(function originCheck() {
  const bus = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*', myOrigin: 'http://127.0.0.1:8080' });
  let got = 0;
  bus.on('T', () => { got++; });
  // 来源不匹配 → 丢弃
  bus._onMessage({ data: { channel: 'AI_FORM', action: 'T', payload: {} }, origin: 'http://127.0.0.1:9999' });
  assert(got === 0, 'origin 不匹配的消息被丢弃');
  // 来源匹配 → 放行
  bus._onMessage({ data: { channel: 'AI_FORM', action: 'T', payload: {} }, origin: 'http://127.0.0.1:8080' });
  assert(got === 1, 'origin 匹配的消息放行');
})();

// ---- 场景 1：助手主动握手（AI_WAKEUP -> 宿主回 SCHEMA_READY）----
let wakeupSeen = 0, handshakeSchema = null;
hostBus.on('AI_WAKEUP', () => { wakeupSeen++; hostBus.send('SCHEMA_READY', schema); });
asstBus.on('SCHEMA_READY', ({ payload }) => { handshakeSchema = payload; });
asstBus.send('AI_WAKEUP', { who: 'assistant' });
assert(wakeupSeen === 1, '宿主收到助手 AI_WAKEUP');
assert(handshakeSchema && handshakeSchema.formCode === 'DEMO_APPLY', '助手收到宿主回传的 SCHEMA_READY（主动握手闭环）');

// ---- 场景 2：SCHEMA_READY 注册 ----
let asstSchema = null;
asstBus.on('SCHEMA_READY', ({ payload }) => { asstSchema = payload; });
hostBus.send('SCHEMA_READY', schema);
assert(asstSchema && asstSchema.formCode === 'DEMO_APPLY', 'SCHEMA_READY 从宿主注册到助手');

// ---- 场景 2：UNDERSTANDING 预览抽取 ----
const render1 = AI.translate({ userText: '姓名 张三 类型 B', schema, mode: 'UNDERSTANDING', lastValues: {} });
assert(render1.values.who === '张三', '抽取姓名=张三 (got=' + render1.values.who + ')');
assert(render1.values.kind === 'B', '抽取类型=B');
assert(render1.blocks[0].data.fields.find(f => f.code === 'when').status === 'missing', '日期未填 → missing');

// ---- 场景 3：PROPOSE_FILL → 宿主校验 → VALIDATION_FEEDBACK ----
let feedback = null;
asstBus.on('VALIDATION_FEEDBACK', ({ payload }) => { feedback = payload; });
hostBus.on('PROPOSE_FILL', ({ payload, replyTo }) => {
  const results = [];
  schema.fields.forEach(f => {
    const v = payload.values[f.code];
    if (f.required && (v === undefined || v === '')) results.push({ code: f.code, status: 'missing', message: '系统必填' });
  });
  hostBus.reply('VALIDATION_FEEDBACK', {
    formCode: schema.formCode, round: 1, fieldResults: results,
    raw: results.map(r => schema.fields.find(f => f.code === r.code).label + '不能为空').join('，'),
    snapshot: {},
  }, replyTo);
});
asstBus.send('PROPOSE_FILL', { formCode: schema.formCode, round: 1, values: { who: '张三', kind: 'B' }, commit: true });
setImmediate(() => {
  assert(feedback && feedback.fieldResults.length === 1 && feedback.fieldResults[0].code === 'when', '宿主校验返回 when=missing');
  const rb = AI.translate({ userText: '', schema, mode: 'VALIDATION_RESULT', validation: feedback.fieldResults, lastValues: {} });
  const whenView = rb.blocks[0].data.fields.find(f => f.code === 'when');
  assert(whenView.status === 'missing', 'AI 翻译出日期缺失追问');
});

// ---- 场景 3.5：不完整表单提交 → 宿主拒提交，回 VALIDATION_FEEDBACK（不造假提交）----
let rejected = null, noSubmit = true;
const sb = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*' });
const ab = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*' });
sb.init(); ab.init();
ab.on('FORM_SUBMITTED', () => { noSubmit = false; });
ab.on('VALIDATION_FEEDBACK', ({ payload }) => { rejected = payload; });
sb.on('REQUEST_SUBMIT', ({ replyTo }) => {
  // 模拟新宿主真实校验：缺 who 必填 → 拒提交回 VALIDATION_FEEDBACK
  sb.reply('VALIDATION_FEEDBACK', {
    formCode: schema.formCode, round: 2,
    fieldResults: [{ code: 'who', status: 'missing', message: '系统必填' }],
    raw: '姓名不能为空', snapshot: {},
  }, replyTo);
});
ab.send('REQUEST_SUBMIT', { formCode: schema.formCode, round: 1 });
assert(rejected && rejected.fieldResults.length === 1 && rejected.fieldResults[0].code === 'who', '不完整提交被拒，回 VALIDATION_FEEDBACK');
assert(noSubmit, '不完整提交未返回 FORM_SUBMITTED（实名不造假提交）');

// ---- 场景 3.6：PREVIEW_FILL 值回写（不只标记）----
let receivedPreview = null;
sb.on('PREVIEW_FILL', ({ payload }) => { receivedPreview = payload; });
ab.send('PREVIEW_FILL', { formCode: schema.formCode, values: { who: '张三' }, commit: false });
assert(receivedPreview && receivedPreview.values && receivedPreview.values.who === '张三', 'PREVIEW_FILL 携带 values 到达宿主（值回写协议）');

// ---- 场景 3.7：表单页录值同步给 AI（FORM_SNAPSHOT）----
let aiLastValues = {};
const sb7 = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*' });
const ab7 = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*' });
sb7.init(); ab7.init();
ab7.on('FORM_SNAPSHOT', ({ payload }) => { aiLastValues = payload.snapshot || {}; });
sb7.send('FORM_SNAPSHOT', { formCode: schema.formCode, snapshot: { who: '张三', kind: 'B' } });
assert(aiLastValues.who === '张三' && aiLastValues.kind === 'B', '宿主录值 FORM_SNAPSHOT 到达 AI（值同步）');

// ---- 场景 3.8：宿主主导直接在表单页提交（不经 AI 对话框）----
let hostSubmit = null;
const sb8 = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*' });
const ab8 = new win.CrossDomainBus({ targetWindow: win, targetOrigin: '*' });
sb8.init(); ab8.init();
ab8.on('FORM_SUBMITTED', ({ payload }) => { hostSubmit = payload; });
sb8.send('FORM_SUBMITTED', { formCode: schema.formCode, finalSnapshot: { who: '张三', when: '2026-05-11', kind: 'B' }, bizKey: 'DEMO-7788' });
assert(hostSubmit && hostSubmit.bizKey === 'DEMO-7788', '宿主页直接提交发 FORM_SUBMITTED 通知 AI 收尾');

// ---- 场景 4：补全后校验通过 → 提交 ----
let submit = null;
asstBus.on('FORM_SUBMITTED', ({ payload }) => { submit = payload; });
hostBus.on('REQUEST_SUBMIT', ({ replyTo }) => {
  hostBus.reply('FORM_SUBMITTED', { formCode: schema.formCode, finalSnapshot: { who: '张三', when: '2026-05-11', kind: 'B' }, bizKey: 'DEMO-0001' }, replyTo);
});
asstBus.send('REQUEST_SUBMIT', { formCode: schema.formCode });
assert(submit && submit.bizKey === 'DEMO-0001', '提交成功，回单号 DEMO-0001');

process.exit(fail ? 1 : 0);
