import type {ReactNode} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

/**
 * 通用入场动画：帧号驱动的透明度 + 位移。
 * 关键点：把「秒」换算成帧，不要写死 30 / 60 这种数字。
 */
export const FadeIn: React.FC<{
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  from?: Direction;
  style?: React.CSSProperties;
}> = ({children, delay = 0, duration = 15, distance = 40, from = 'up', style}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const offset = (1 - progress) * distance;
  const translate =
    from === 'none'
      ? undefined
      : `translate(${from === 'left' ? offset : from === 'right' ? -offset : 0}px, ${
          from === 'up' ? offset : from === 'down' ? -offset : 0
        }px)`;

  return (
    <div
      style={{
        opacity: progress,
        transform: translate,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
