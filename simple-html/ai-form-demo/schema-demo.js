/**
 * schema-demo.js — 一份「业务无关」的示例 FormSchema
 *
 * 对应通用协议第①层。字段只有平台原语类型，不携带任何业务语义。
 * 这套字段可整体替换成任意业务的 schema，宿主页与 AI 助手零改动。
 */
window.DEMO_SCHEMA = {
  formCode: 'DEMO_APPLY',
  formName: '预约申请',
  mode: 'draft',
  version: '1',
  fields: [
    {
      code: 'who',
      label: '姓名',
      type: 'string',
      required: true,
      placeholder: '请输入姓名',
    },
    {
      code: 'when',
      label: '日期',
      type: 'date',
      required: true,
      placeholder: '选择日期',
    },
    {
      code: 'kind',
      label: '类型',
      type: 'enum',
      required: true,
      options: [
        { value: 'A', label: '类型A' },
        { value: 'B', label: '类型B' },
        { value: 'C', label: '类型C' },
      ],
      placeholder: '请选择类型',
    },
    {
      code: 'note',
      label: '备注',
      type: 'string',
      required: false,
      placeholder: '选填',
    },
  ],
};
