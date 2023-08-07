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
        name: "EnergyExpenditureDashboard"
      }
    },
    {
      "name": "@rabbitholesyndrome/electron-forge-maker-portable",
      "config": {
        "portable": {
          "artifactName": "${productName}-app-standalone-${version}.${ext}"
        }
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        name: "EnergyExpenditureDashboard",
        icon: './src/img/nhs-sq.icns',
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: "EnergyExpenditureDashboard",
          icon: './src/img/nhs-sq.png',
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          name: "EnergyExpenditureDashboard",
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
