module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress source map warnings for face-api.js and other libraries
      webpackConfig.ignoreWarnings = [
        {
          module: /face-api\.js/,
        },
        function ignoreSourcemapsLoaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource &&
            warning.module.resource.includes("node_modules") &&
            warning.details &&
            warning.details.includes("source-map-loader")
          );
        },
      ];

      // Alternative: Disable source map loader warnings entirely
      const sourceMapLoaderRule = webpackConfig.module.rules.find((rule) =>
        rule.enforce === "pre" &&
        rule.test &&
        rule.test.toString().includes("\\.(js|mjs|jsx|ts|tsx|css)$")
      );

      if (sourceMapLoaderRule) {
        sourceMapLoaderRule.exclude = [/node_modules/];
      }

      return webpackConfig;
    },
  },
}; 