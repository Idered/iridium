/** @type {import('vls').VeturConfig} */
module.exports = {
  settings: {
    "vetur.experimental.templateInterpolationService": true
  },
  projects: [
    {
      root: './ui/database',
      package: './package.json',
      tsconfig: './tsconfig.json',
      globalComponents: [
        // './src/components/**/*.vue'
      ]
    }
  ]
};
