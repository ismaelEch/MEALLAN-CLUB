module.exports = {
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  output: './locales',
  options: {
    removeUnusedKeys: false,
    sort: false,
    lngs: ['en', 'es', 'fr'],
    defaultLng: 'en',
    resource: {
      loadPath: 'src/locales/{{lng}}.json',
      savePath: 'src/locales/{{lng}}.json',
    },
  },
  transform: function customTransform(file, enc, done) {
    const parser = this.parser;
    const content = file.contents.toString(enc);

    // Use a regex or another parser to extract translation keys
    content.replace(/t\(['"](.+?)['"]\)/g, function (match, key) {
      parser.set(key);
    });

    done();
  },
};
