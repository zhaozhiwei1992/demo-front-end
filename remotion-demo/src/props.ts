/** 所有对外可变的文案集中在这里，渲染时可用 --props 覆盖，实现「一套模板出 N 条片子」 */
export type VideoProps = {
  title: string;
  subtitle: string;
  points: {no: string; title: string; desc: string}[];
  cta: string;
};

export const defaultProps: VideoProps = {
  title: 'RUNOOB 橙色旅行水杯',
  subtitle: '轻一点，通勤更轻松',
  points: [
    {no: '01', title: '轻便', desc: '整杯不到 200g，通勤无负担'},
    {no: '02', title: '好拿', desc: '单手开盖，地铁上也不洒'},
    {no: '03', title: '好洗', desc: '大口径设计，刷一下就行'},
  ],
  cta: '立即选购',
};
