All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] 2022-11-17

### Added

- We now support generating inline data URLs (`data:image/svg+xml;base64,...`),
  which can be used in `<img src>` attributes, by appending the querystring
  variable `?dataurl` to an SVG import.

  ```svelte
  <script>
  import icon1 from `$assets/icon1.svg?dataurl`
  </script>

  <img src={icon1} />
  ```

  `?dataurl` differs from `?url` in that SVGO optimization/transform will be
  applied to the SVG before it's turned into a data URL.

## [1.0.1] 2022-11-07

### Changed

- Use the proper Vite `Plugin` type. The transform signature wasn't 100%
  compatible with the `Plugin` interface and would cause errors when the
  Vite config file is a Typescript file (e.g. `vite.config.ts`)

- The suggested `*.svg?component` type definition now has a proper Svelte
  typed component interface

  ```ts
  declare module '*.svg?component' {
    const content: ConstructorOfATypedSvelteComponent
    export default content
  }
  ```

## [1.0.0] 2022-07-27

Lets go 1.0

### Changed

- Use `vite.config.js` instead of `svelte.config.js` in README.
  _Thank you [Arad](https://github.com/aradalvand) for the PR_

## [0.3.4] 2022-06-20

### Changed

- Type definitions for the update Svgo dependency are stricter. If we get an
  `OptimizeError` from SVGO we notify and return early

## [0.3.3] 2022-06-20

No changes. Updated package dependencies and added to the README file.

## [0.3.2] 2022-04-11

Thanks to [Miguel Camba](https://github.com/cibernox) for the contribution.

### Added

- By giving `false` as value to the SVGO option you can bypass SVGO altogether.
  This is useful when optimization might break SVG animations and alike.

## [0.3.0] 2022-02-15

Thanks to [Jani](https://github.com/ljani) for the contributions

### Added

- It's now possible to pass multiple `svg` transformers based on path prefixes
  if you want to apply different SVGO options for SVGs in different locations.

  Example:

  ```ts
  const config = {
    ...,

    kit: {
      ...,
      vite: {
        plugins: [
          svg({
            includePaths: ["./src/lib/icons/", "./src/assets/icons/"],
            svgoOptions: {
              multipass: true,
              plugins: [
                "preset-default", {
                  name: "removeAttrs", params: { attrs: "(fill|stroke)" }
                }
              ],
            },
          }),
          svg({
            includePaths: ["./src/lib/graphics/"],
            svgoOptions: {
              multipass: true,
              plugins: ["preset-default" ],
            },
          }),
        ]
      }
    }
  }
  ```

  `includePaths` will be normalized, so they can be both absolute and relative
  (to the current working directory).

### Fixed

- Passing `path` property to SVGO by default

## [0.2.3] 2022-01-20

### Fixed

- Updated README to reflect reality. Mainly use ESM in example

## [0.2.2] 2021-12-09

### Fixed

- Update `transform` params for Vite 2.7.0.
  This is just an internal change. Thank you
  [James Camilleri](https://github.com/james-camilleri) for the fix.

## [0.2.1] 2021-12-07

### Fixed

- Noticed that the `index.d.ts` file was missing from the package.
  So no code changes

## [0.2.0] 2021-12-01

### Added

- It is now possible to pass attributes to the SVG when it is imported as a
  Svelte component

  ```svelte
  <script>
  import Icon from './icon.svelte'
  </script>

  <Icon width="200" />
  ```

  Thanks to @AradAral for pushing on this issue

## [0.1.8] 2021-11-25

### Maintenance

- No code changes, upgraded package dependencies

## [0.1.7] 2021-09-15

### Fixed

- No changes, just a version bump to sync the CHANGELOG file

## [0.1.6] - 2021-09-15

### Fixed

- `svgo.optimize()` expects the options argument to be an object or `null`.
  However, the TS typings says object or `undefined`, which previously seem
  to have been fine but no longer is.

  This solves bug report [#8](https://github.com/poppa/sveltekit-svg/issues/8)

## [0.1.4] - 2021-08-19

### Changed

- The Svelte component wasn't using the optimized SVG output.
  Thanks @bummzack (https://github.com/bummzack) for the PR.

## [0.1.3] - 2021-07-07

### Changed

- Updated README to reflect that the `plugins` property should be a member of
  the `vite` property

## [0.1.2] - 2021-05-12

### Changed

- Fixed a typo in the README
- Corrected the years in this file

## [0.1.1] - 2021-04-30

### Changed

- Changed Svelte peer dep to 3.x

## [0.1.0] - 2021-04-30

### Changed

- Added changelog
- Bump version to 0.1.0

---

[unreleased]: https://github.com/poppa/sveltekit-svg/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/poppa/sveltekit-svg/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/poppa/sveltekit-svg/compare/v1.0.0...v1.0.1
