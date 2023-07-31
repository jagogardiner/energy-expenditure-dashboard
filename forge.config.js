module.exports = {
  packagerConfig: {
    asar: true,
    icon: './src/img/nhs-sq.png',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel'
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        icon: './src/img/nhs-sq.png',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './src/img/nhs-sq.png',
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: './src/img/nhs-sq.png',
        }
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
