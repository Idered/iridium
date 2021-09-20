## Iridium — Node Dependencies

> Manage and analyze your Node.js dependencies.

## Features
- 🔍 Fast autocomplete
- 🚀 Detect outdated dependencies and easily update
- 📦 Manage multiple package.json files in monorepo
- 🔢 Analyze size and load speed of each dependency

## Usage

Search field shortcuts:
- `Up | Down` - Go up or down
- `Enter | Click` - Install selected package
- `Alt+Enter | Alt+Click` - Install selected package as dev dependency
- `@` - Display list of package versions
- `@@` - Display list of tagged package versions

### Installing latest package version

To install latest version, just select package from list and press enter.

![](https://i.imgur.com/UH79hIv.gif)

### Installing specific package version

To install specific package version, add `@` after package name - list of versions will popup. You can search for specific version by typing eg. `2.0.4` or add another `@` to get list of tagged versions. Try to type `react@@` to get list of tags.

**Installing by version**
![](https://i.imgur.com/TxhQHCI.gif)

**Installing by tag**
![](https://i.imgur.com/ICVvyzt.gif)

### Outdated packages

Outdated packages are marked by colored package version. Additional command is available for such packages - `upgrade to latest` ![](https://i.imgur.com/s5gasQG.png) which you can access by hovering specified package.

![](https://i.imgur.com/Vk21sxS.gif)

> **TIP**: To update all outdated packages to latest versions, use sync icon in bottom bar.

![](https://i.imgur.com/LVcet2f.gif)

### Change dependency type

You can change dependency type from normal to devDependency by clicking ![](https://i.imgur.com/liMk91S.png) while hovering package item.

![](https://i.imgur.com/wtZi17v.gif)

### Removing package

To remove package, click `x` while hovering package item.

![](https://i.imgur.com/CZVMgg0.gif)

### Analyze mode

Analyze mode displays list of non dev dependencies with additional info:
- minified size
- minified + gzip size
- download speed on slow 3G (400 kB/s)
- download speed on slow 4G (1750 kB/s)

![](https://i.imgur.com/EjfyFYq.gif)

## Powered by

This extension wouldn't exist without these superb services ❤️

- [npms.io](https://npms.io) - search packages by names
- [jsdelivr.com](https://www.jsdelivr.com) - get package tags and versions
- [bundlephobia.com](https://bundlephobia.com) - get package size info

## Support

[Create an issue](https://github.com/idered/iridium/issues), or ping [@Idered](https://twitter.com/Idered) on Twitter.