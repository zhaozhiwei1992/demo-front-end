# 智能填单通用协议 Demo（AI 对话填单，业务无关 + 跨域）

对应设计文档：`~/workspace/项目管理/开发文档/财政研发中心AI建设/03_详细设计/04_算法与逻辑/08_智能填单详细设计.org` 的 ⑥「简单示例实现」。

这是一套**不绑定任何业务**的通用对话式填单最小实现：一张通用表单宿主 + 一个跨域 AI 助手，通过 postMessage 传 JSON 完成 `AI_WAKEUP → SCHEMA_READY → SCHEMA_ACK → PREVIEW_FILL → PROPOSE_FILL → VALIDATION_FEEDBACK → REQUEST_SUBMIT → FORM_SUBMITTED` 全链路。

## 运行

```bash
cd simple-html/ai-form-demo
node server.js        # 会同时起 8080(宿主) 和 8081(AI助手) 两个端口，制造真实跨域
```

也可**分别启动**（先起 AI 助手，再起宿主页）：

```bash
node server.js 8081   # 终端 1：先启动 AI 助手
node server.js 8080   # 终端 2：后启动宿主页
```

浏览器访问：http://127.0.0.1:8080/demo.html

> 必须经 HTTP 起服务（不能用 file:// 双击），因为跨域 iframe + postMessage 需要真实 origin。

## 通信建立（握手不依赖时序）

不再依赖「iframe 何时加载完」的判断，改由 **AI 助手主动发 AI_WAKEUP**：

1. 助手加载后开始重试发送 `AI_WAKEUP`（每 200ms，直到收到 SCHEMA_READY 才停）；
2. 宿主收到 `AI_WAKEUP`（此时双方监听必然已就绪）后回 `SCHEMA_READY`；
3. 助手收到 `SCHEMA_READY` → 停止重试，回 `SCHEMA_ACK`；
4. 宿主收到 `SCHEMA_ACK` → 状态条变绿「AI 助手已就绪」。

只要宿主最终加载、注册了监听，助手的重试总能把话送到，天然免疫先加载/后加载的竞争。宿主侧**无需**判断 iframe onload / readyState / location。真机验证：右下角助手显示「已就绪：表单「预约申请」」，宿主状态条变绿；F12 设 `window.AI_FORM_DEBUG=true` 可看 `[bus]` 收发日志。

## 体验

在右下角「AI 助手」输入框里对话（字段都是通用的占位）：

- `姓名 张三` → 预览抽取，**AI 建议值直接回写到表单**（黄色高亮，不覆盖你手填的值）
- 表单页手动录/改字段 → 停止输入 300ms 后自动同步给 AI（也可点「把已填信息同步给 AI 助手」），AI 认知以宿主快照为唯一真源，不再重复建议已填字段
- `日期 5月11日`、`类型 B` → 逐段补充，同样即时回写预览
- 点芯片/输入 `确认` → PROPOSE_FILL → 宿主真实验证 + 把建议值转真实落值（绿色）
- 说 `提交` / 点「确认提交」→ REQUEST_SUBMIT → **宿主先真实验证**，缺必填项会拒并回 VALIDATION_FEEDBACK 追问，全填齐才返回 FORM_SUBMITTED 单号
- 也可不跟 AI 对话，点表单页「**直接在此页面提交表单**」→ 宿主自己校验落库 → 返回单号、清空表单，并通知 AI 收尾回 IDLE

> 提交不再造假：表单不完整时不会被当作成功提交（无论是 AI 对话提交还是宿主页直接提交），宿主会回结构化缺失让 AI 追问。

## 文件结构

| 文件 | 层 | 说明 |
|------+----+------|
| `cross-domain-bus.js` | ② 跨域通道层 | 统一 Envelope + postMessage 事件总线（业务无关） |
| `schema-demo.js` | ① 表单协议层 | 一份业务无关示例 FormSchema（谁/日期/类型/备注） |
| `host.html` | ①+业务裁判 | 通用表单宿主：按 schema 渲染 + 校验 + 与 AI 交互 + 值同步/直接提交（8080） |
| `assistant.html` | ③ AI 界面层 | 通用 AI 助手气泡 UI + 转发 JSON（8081，跨域 iframe） |
| `ai-backend-demo.js` | ④ AI 后端层 | 模拟 AI 后端翻译（规则式，字段语义从 schema 读） |
| `demo.html` | 入口 | 把宿主包为 iframe 主界面 |
| `server.js` | 运行 | 原生静态服务器，双端口制造跨域 |
| `e2e-sim.js` | 验证 | node 内存模拟两端 postMessage 全链路（回归测试：`node e2e-sim.js`） |

## 接入新业务

**业务系统只需要做三件事**（AI 侧整套是现成的）：

1. **引入 bus 并两端各持一份**：`cross-domain-bus.js` 是共享文件，宿主页与 AI 助手各 `new` 一个实例、参数互为镜像（宿主 `target`=助手窗口、助手 `target`=父窗口），实例由 AI 侧提供、业务引入后填空；
2. **提供一张 FormSchema**：换掉 `schema-demo.js` 里的 `DEMO_SCHEMA` 字段（含 `validationAlias` 校验词）即成任意业务表单——字段中文名/校验词/别名全从这张表读，AI prompt 不写死；
3. **实现宿主行为**：表单渲染（框架无关）+ 真实验证 + 值同步（input 防抖 300ms 推 FORM_SNAPSHOT）+ 真实提交（REQUEST_SUBMIT 校验通过才落库，缺必填回 VALIDATION_FEEDBACK 拒交；也支持宿主直接提交发 FORM_SUBMITTED）。

宿主页与 AI 助手（界面/后端）零改动——这正是「表单框架式」通用化的价值：**AI 侧成套拿走，业务去填空**。
