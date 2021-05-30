const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
  purge: {
    content: ['./src/**/*.svelte', './public/index.html'],
    defaultExtractor: content => {
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
      const broadMatchesWithoutTrailingSlash = broadMatches.map(match => _.trimEnd(match, '\\'));
      const matches = broadMatches.concat(broadMatchesWithoutTrailingSlash);
      return matches;
    },
    enabled: isProduction,
  },
};
