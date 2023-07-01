## Iridium — Node Dependencies

> Manage and analyze your Node.js dependencies.

## Features

- 🔍 Fast autocomplete
- 🚀 Detect outdated dependencies and easily update
- 📦 Manage multiple package.json files in monorepo
- 🔢 Analyze size and load speed of each dependency
- 🧶 Support for `npm`, `yarn`, `pnpm` and `bun`

![](https://i.imgur.com/Znvqflw.gif)

## Usage

Search field shortcuts:

- `Up | Down` - Go up or down
- `Enter | Click` - Install selected package
- `Alt+Enter | Alt+Click` - Install selected package as dev dependency
- `@` - Display list of package versions
- `@@` - Display list of tagged package versions
- Shortcuts while focus is on installed package:
- `Del` - Remove package
- `Ctrl+Enter` - Update package to latest version based on the specified range
- `Ctrl+Shift+Enter` - Update package to latest

### Config

| Option                              | Values                           | Description                                                                                                                             |
| ----------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `iridium.npm.packageManager`        | **`npm`**, `yarn`, `pnpm`, `bun` | Package manager used to install when there's no lock file.                                                                              |
| `iridium.npm.runAudit`              | **`true`**, `false`              | Automatically run security audit(yarn, pnpm).                                                                                           |
| `iridium.npm.showShortcuts`         | **`true`**, `false`              | Show shortcuts section in search dropdown.                                                                                              |
| `iridium.npm.showAlgoliaInfo`       | **`true`**, `false`              | Show Algolia credits in search dropdown.                                                                                                |
| `iridium.npm.showResultDescription` | **`true`**, `false`              | Show package description in search dropdown.                                                                                            |
| `iridium.npm.excludeVersions`       | `[]`                             | Exclude package versions containing specified strings. For example you can add `beta` to exclude all versions including `beta` in name. |
| `iridium.npm.maxNumberOfResults`    | `4`                              | Number of packages to display in search dropdown.                                                                                       |

## Powered by

This extension wouldn't exist without these superb services ❤️

- [Algolia](https://www.algolia.com/) - search packages by name
- [jsdelivr.com](https://www.jsdelivr.com) - get package tags and versions
- [bundlephobia.com](https://bundlephobia.com) - get package size info

## Support

[Create an issue](https://github.com/idered/iridium/issues), or ping [@Idered](https://twitter.com/Idered) on Twitter.
