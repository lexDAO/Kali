module.exports = {

  webpack: function (config, options) {
    config.experiments = {
      topLevelAwait: true
    };
    return config;
  },
};
