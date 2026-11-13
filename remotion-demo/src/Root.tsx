import {Composition} from 'remotion';
import {ProductVideo} from './ProductVideo';
import {defaultProps} from './props';
import {VIDEO} from './theme';

/** 一条片子的登记处：id / 尺寸 / 帧率 / 时长 / 默认 props。 */

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductVideo"
        component={ProductVideo}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={15 * VIDEO.fps}
        defaultProps={defaultProps}
      />
    </>
  );
};
