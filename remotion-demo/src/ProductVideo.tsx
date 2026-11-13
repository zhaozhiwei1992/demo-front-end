import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import type {VideoProps} from './props';
import {SceneCover} from './scenes/SceneCover';
import {SceneFeatures} from './scenes/SceneFeatures';
import {SceneOutro} from './scenes/SceneOutro';
import {seconds, theme} from './theme';

/**
 * 成片结构（总时长 = 180 + 180 + 150 - 30 - 30 = 450 帧 = 15 秒）
 * TransitionSeries 会「吃掉」转场重叠的时间，所以总时长要减。
 */
export const ProductVideo: React.FC<VideoProps> = ({title, subtitle, points, cta}) => {
  return (
    <AbsoluteFill style={{background: theme.bg, fontFamily: theme.fontFamily}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={seconds(6)} name="封面">
          <SceneCover title={title} subtitle={subtitle} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({direction: 'from-right'})}
          timing={linearTiming({durationInFrames: seconds(1)})}
        />

        <TransitionSeries.Sequence durationInFrames={seconds(6)} name="卖点">
          <SceneFeatures points={points} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: seconds(1)})}
        />

        <TransitionSeries.Sequence durationInFrames={seconds(5)} name="结尾">
          <SceneOutro cta={cta} />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* 配乐挂在整片级，不放进任何 Scene，避免被转场裁掉 */}
      <Audio src={staticFile('bgm.wav')} volume={0.6} />
    </AbsoluteFill>
  );
};
