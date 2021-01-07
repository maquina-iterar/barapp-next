module.exports = withSass({
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
});
