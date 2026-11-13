/**
 * 全片共用的设计变量：颜色、字体、尺寸。
 * 改主题只改这里，所有场景跟着变。
 */
export const theme = {
  // 中文必须给真实存在的字体名，headless Chrome 里没有回退字体时会渲染成方块
  fontFamily: '"Noto Sans CJK SC", "Noto Sans SC", sans-serif',
  bg: 'linear-gradient(135deg, #1b1b2f 0%, #2d1b3d 100%)',
  accent: '#ff7a1a',
  text: '#ffffff',
  subText: 'rgba(255,255,255,0.72)',
} as const;

/** 1920×1080 @ 30fps 的常用换算，避免到处写魔数 */
export const VIDEO = {width: 1920, height: 1080, fps: 30} as const;
export const seconds = (n: number) => Math.round(n * VIDEO.fps);
