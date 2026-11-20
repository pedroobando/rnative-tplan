// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {
  // relative path to your global.css file (from previous step)
  cssEntryFile: './src/global.css',
  // (optional) path where we gonna auto-generate typings
  // defaults to project's root
  dtsFile: './src/uniwind-types.d.ts',
  // Temas propios definidos como @variant en src/global.css.
  // Sin esto, Tailwind no los registra y falla con
  // "Cannot use `@variant` with unknown variant: ocean".
  extraThemes: ['ocean', 'emerald', 'orange'],
});
