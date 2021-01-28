/** @type {import('vls').VeturConfig} */
module.exports = {
  settings: {
    "vetur.experimental.templateInterpolationService": true
  },
  projects: [
    {
      root: './packages/web',
      package: './package.json',
      tsconfig: './tsconfig.json',
      globalComponents: [
        // './src/components/**/*.vue'
      ]
    }
  ]
};
