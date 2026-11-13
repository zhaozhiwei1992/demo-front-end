import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FadeIn} from '../components/FadeIn';
import type {VideoProps} from '../props';
import {seconds, theme} from '../theme';

/** 场景一：封面。产品图弹入 + 标题上滑。 */
export const SceneCover: React.FC<Pick<VideoProps, 'title' | 'subtitle'>> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // spring 是物理动画：比 interpolate 更自然，durationInFrames 用来把它拉伸成固定长度
  const pop = spring({frame: frame - seconds(0.4), fps, config: {damping: 12, stiffness: 120}, durationInFrames: seconds(1.2)});
  const glow = interpolate(frame, [0, seconds(1.5)], [0.15, 0.45], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: theme.fontFamily}}>
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,122,26,${glow}) 0%, rgba(255,122,26,0) 70%)`,
        }}
      />
      <Img
        src={staticFile('cup.png')}
        style={{
          width: 460,
          height: 460,
          borderRadius: 40,
          boxShadow: '0 40px 120px rgba(255,122,26,0.35)',
          transform: `scale(${pop})  rotate(${(1 - pop) * -8}deg)`,
        }}
      />
      <FadeIn delay={seconds(0.9)} duration={seconds(0.6)} from="up">
        <h1 style={{fontSize: 96, fontWeight: 900, color: theme.text, margin: '56px 0 0', letterSpacing: 4}}>
          {title}
        </h1>
      </FadeIn>
      <FadeIn delay={seconds(1.4)} duration={seconds(0.6)} from="up">
        <p style={{fontSize: 40, color: theme.subText, margin: '24px 0 0'}}>{subtitle}</p>
      </FadeIn>
    </AbsoluteFill>
  );
};
