// @flow

import * as React from 'react';
import ReactPlayer from 'react-player';
import { type ActivityRunnerPropsT } from 'frog-utils';

import dashboards from './dashboard';

export const meta = {
  name: 'Video player',
  shortDesc: 'Video player',
  description:
    'Video player configurable with URL, and some settings (autoplay etc).',
  exampleData: [
    {
      title: 'Sample video',
      config: {
        url: 'https://www.youtube.com/watch?v=RHq6bEgeZD4',
        playing: true,
        loop: false
      },
      activityData: {}
    }
  ]
};

export const config = {
  type: 'object',
  required: ['url'],
  properties: {
    url: {
      type: 'string',
      title: 'URL of video'
    },
    playing: {
      type: 'boolean',
      title: 'Should video begin auto-playing?',
      default: true
    },
    loop: {
      type: 'boolean',
      title: 'Should video loop?'
    }
  }
};

class ActivityRunner extends React.Component<ActivityRunnerPropsT> {
  ref: any;
  componentDidMount() {
    this.ref.seekTo(this.props.data.play);
  }
  render() {
    const { activityData, logger, dataFn } = this.props;
    const url = activityData.config.url;
    return (
      <ReactPlayer
        ref={ref => (this.ref = ref)}
        url={url}
        playing={activityData.config.playing}
        controls
        loop={activityData.config.loop}
        onStart={() => logger({ type: 'start', itemId: url })}
        onPause={() => logger({ type: 'pause', itemId: url })}
        onPlay={() => logger({ type: 'play', itemId: url })}
        onEnded={() => logger({ type: 'finishPlaying', itemId: url })}
        onProgress={x => {
          logger({
            type: 'videoProgress',
            value: x.played,
            itemId: url
          });
          dataFn.objInsert({ play: x.playedSeconds });
        }}
        width="100%"
        height="100%"
      />
    );
  }
}

export default {
  id: 'ac-video',
  type: 'react-component',
  ActivityRunner,
  config,
  meta,
  dashboards
};
