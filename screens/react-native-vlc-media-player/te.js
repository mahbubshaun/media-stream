// React Native: VLCPlayer.js

import { requireNativeComponent, NativeModules } from 'react-native';

const { VLCPlayerModule } = NativeModules;

export const VLCPlayer = requireNativeComponent('VLCPlayer');

export const getPlaybackTime = async () => {
  return VLCPlayerModule.
};
