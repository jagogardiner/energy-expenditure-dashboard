module.exports = {
  packagerConfig: {
    asar: true,
    icon: './src/img/nhs-sq',
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          // !important: Please change this to your own repository.
          owner: 'jagogardiner',
          name: 'energy-expenditure-dashboard'
        },
        prerelease: false,
        draft: true
      }
    }
  ],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: "Energy Expenditure Dashboard",
        iconUrl: './src/img/nhs-sq.ico',
        setupIcon: './src/img/nhs-sq.ico',
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        name: "Energy Expenditure Dashboard",
        icon: './src/img/nhs-sq.icns',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: "Energy Expenditure Dashboard",
          icon: './src/img/nhs-sq.png',
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          name: "Energy Expenditure Dashboard",
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
