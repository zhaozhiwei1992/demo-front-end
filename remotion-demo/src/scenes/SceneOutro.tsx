import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FadeIn} from '../components/FadeIn';
import type {VideoProps} from '../props';
import {seconds, theme} from '../theme';

/** 场景三：结尾 CTA。用一个扫光条演示 interpolate 驱动的位置动画。 */
export const SceneOutro: React.FC<Pick<VideoProps, 'cta'>> = ({cta}) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [0, seconds(1.2)], [-30, 130], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: theme.fontFamily}}>
      <FadeIn delay={0} duration={seconds(0.5)}>
        <h2 style={{fontSize: 110, fontWeight: 900, color: theme.text, margin: 0}}>现在就出发</h2>
      </FadeIn>
      <FadeIn delay={seconds(0.5)} duration={seconds(0.5)} from="none">
        <div
          style={{
            marginTop: 56,
            padding: '28px 72px',
            borderRadius: 999,
            background: theme.accent,
            color: '#fff',
            fontSize: 42,
            fontWeight: 700,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 扫光：一条半透明白条从左划到右 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '22%',
              left: `${sweep}%`,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
            }}
          />
          {cta}
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};
