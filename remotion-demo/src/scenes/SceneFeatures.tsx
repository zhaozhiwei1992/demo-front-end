import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {VideoProps} from '../props';
import {seconds, theme} from '../theme';

/** 场景二：卖点字卡。三张卡按 1.5 秒节奏依次弹入。 */
export const SceneFeatures: React.FC<Pick<VideoProps, 'points'>> = ({points}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{justifyContent: 'center', alignItems: 'center', fontFamily: theme.fontFamily, padding: '0 160px'}}
    >
      <h2 style={{fontSize: 64, color: theme.text, marginBottom: 64, fontWeight: 800}}>三个理由</h2>
      <div style={{display: 'flex', gap: 48, width: '100%'}}>
        {points.map((p, i) => {
          const start = seconds(0.3 + i * 0.5);
          const enter = spring({
            frame: frame - start,
            fps,
            config: {damping: 14, stiffness: 140},
            durationInFrames: seconds(0.8),
          });

          return (
            <div
              key={p.no}
              style={{
                flex: 1,
                height: 380,
                borderRadius: 32,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: 48,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: enter,
                // 从下方 80px 弹入 + 轻微放大，spring 的 0→1 直接用
                transform: `translateY(${(1 - enter) * 80}px) scale(${0.9 + enter * 0.1})`,
              }}
            >
              <span style={{fontSize: 48, fontWeight: 900, color: theme.accent}}>{p.no}</span>
              <div>
                <div style={{fontSize: 56, fontWeight: 800, color: theme.text}}>{p.title}</div>
                <div style={{fontSize: 30, color: theme.subText, marginTop: 16, lineHeight: 1.5}}>{p.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{fontSize: 34, color: theme.subText, marginTop: 72}}>不保温、不认证、不吹销量 —— 只说能验证的</p>
    </AbsoluteFill>
  );
};
