/** @type {import("next").NextConfig} */

module.exports = (phase, { defaultConfig }) => {
  return {
    ...defaultConfig,

    reactStrictMode: true,
    env: {
      CORBADO_PROJECT_ID: process.env.CORBADO_PROJECT_ID,
    },
    webpack: (config) => {
      config.resolve = {
        ...config.resolve,
        fallbaPck: {
          fs: false,
          path: false,
          os: false,
        },
      };
      return config;
    },
  };
};
