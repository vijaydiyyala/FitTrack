/**
 * Babel config for Expo SDK 56 + NativeWind v4.
 *
 * - `jsxImportSource: "nativewind"` lets the `className` prop flow into RN views.
 * - `nativewind/babel` is the NativeWind preset.
 * - Reanimated 4 ships its worklets babel plugin *inside* babel-preset-expo, so
 *   we must NOT add `react-native-reanimated/plugin` here (it would double-register
 *   and throw "Duplicate plugin/preset detected").
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
