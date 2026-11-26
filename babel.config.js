module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    // Drizzle genera migraciones que importan archivos .sql como texto.
    plugins: [['inline-import', { extensions: ['.sql'] }]],
  };
};
