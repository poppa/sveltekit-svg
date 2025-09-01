All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- _(empty)_

## [6.0.0] 2025-09-01

### Breaking

- SVGO is updated to new major version, v4, which changes the default
  configuration of SVGO. If you rely on some SVGO defaults, take a closer
  look at the [SVGO v3 -> v4 migration guide](https://svgo.dev/docs/migrations/migration-from-v3-to-v4/)

## [5.0.1] 2025-03-20

### Changed

- Maintenance, upgraded NPM packages

## [5.0.0] 2024-10-23

### Added

- Official support for Svelte 5

## [5.0.0-svelte5.0] 2024-01-13

### Added

- Support for Svelte 5 (Experimental)

## [4.2.1] 2024-01-14

### Changed

- `@rollup/pluginutils` needs to be a dependency.

  This should fix [#54](https://github.com/poppa/sveltekit-svg/issues/54)

## [4.2.0] 2024-01-08

### Added

- SVGs imported as URLs (`import svgUrl from ./some.svg?url`) will now be
  _SVGO_ optimized before written to disk on production builds.

  NOTE: SVGs imported as URLs will **not** be optimized in `dev` mode.

  This should fix [#52](https://github.com/poppa/sveltekit-svg/issues/52)

## [4.1.3] 2023-09-01

### Changed

- Always return a partial `SourceDescription` when returning code

  This hopefully fixes [#48](https://github.com/poppa/sveltekit-svg/issues/48)

- Updated dev dependencies

## [4.1.2] 2023-08-31

### Changed

- Return the full JS result from compile

  This will include the `map` property as well.

  This should fix #48.

## [4.1.1] 2023-08-31

### Changed

- Set Svelte compiler css option to 'none'

  The `css` option to Svelte `compile()` has changed and setting it to a
  `boolean` value has been deprecated.

  This gave the _compilerOptions.css as a boolean is deprecated. Use 'external'
  instead of false._ warning.

  Since we're disregarding the `css` field in the generated result, we can set
  this option to `none` and skip all CSS stuff altogether.

## [4.1.0] 2023-08-07

### Added

- Added the `preCompileHook` option.

  This is a function that lets the consumer transform the SVG into a Svelte
  component before being passed to the Svelte compiler.

## [4.0.1] 2023-08-03

### Changed

Render the contents of the `<svg>` tag using `{@html}` in the component mode.

This is to prevent Svelte having to parse the entire SVG.

Thanks [Arad Alvand](https://github.com/aradalvand) for the code.

This solves [#39](https://github.com/poppa/sveltekit-svg/issues/39)

## [4.0.0] 2023-06-23

Updated dependencies and stuff to play along with Svelte 4

No code changes

## [3.0.1] 2023-05-20

### Changed

This is a maintenance release with no code changes

- Updated all NPM packages
- Renamed `app.d.ts` to `svg.d.ts` since Svelte doesn't like these typings in
  `app.d.ts` (see [issue 25](https://github.com/poppa/sveltekit-svg/issues/25))
- Also copy `svg.d.ts` to `dist/` on build.
- Some fixes to the README file
- Thanks to @joakimnordling for PR #35

## [3.0.0] 2023-03-18

### Added

- Support for the SVGO datauri option in the `dataurl` query parameter.
  This means that `?dataurl=base64`, `?dataurl=enc` and `?dataurl=unenc` works

### Changed

- Upgraded all NPM packages and bumped the SVGO dependency ro SVGO >=3.0

## [2.1.2] 2023-01-29

### Fixed

- Keep the generated source map

  This removes the "Sourcemap is likely to be incorrect: a plugi
  (sveltekit-svg) was used to transform files..." warning seen when using this
  plugin outside of SvelteKit

## [2.1.1] 2023-01-25

### Fixed

- Hot-reload is working for component instances, that is editing a SVG imported
  as a component will hot-reload it. SVG:s imported a URL:s will require a page
  reload.

  This solves issue [#30](https://github.com/poppa/sveltekit-svg/issues/30)

## [2.0.2] 2022-12-29

### Fixed

- Proper type in sample `.d.ts` for component. This will get proper intellisense
  for all valid SVG attributes. Thank to [YummYume](https://github.com/YummYume)
  for the example code.

- Upgraded all NPM packages

## [2.0.0] 2022-12-12

### Fixed

- Updated to work with Vite 4.0 and latest SvelteKit

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

[unreleased]: https://github.com/poppa/sveltekit-svg/compare/v5.0.1...HEAD
[5.0.1]: https://github.com/poppa/sveltekit-svg/compare/v5.0.0...v5.0.1
[5.0.0]: https://github.com/poppa/sveltekit-svg/compare/v4.2.0...v5.0.0
[4.2.1]: https://github.com/poppa/sveltekit-svg/compare/v4.2.0...v4.2.1
[4.2.0]: https://github.com/poppa/sveltekit-svg/compare/v4.1.3...v4.2.0
[4.1.3]: https://github.com/poppa/sveltekit-svg/compare/v4.1.2...v4.1.3
[4.1.2]: https://github.com/poppa/sveltekit-svg/compare/v4.1.1...v4.1.2
[4.1.1]: https://github.com/poppa/sveltekit-svg/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/poppa/sveltekit-svg/compare/v4.0.1...v4.1.0
[4.0.1]: https://github.com/poppa/sveltekit-svg/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/poppa/sveltekit-svg/compare/v3.0.1...v4.0.0
[3.0.1]: https://github.com/poppa/sveltekit-svg/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/poppa/sveltekit-svg/compare/v2.1.2...v3.0.0
[2.1.2]: https://github.com/poppa/sveltekit-svg/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/poppa/sveltekit-svg/compare/v2.0.2...v2.1.1
[2.0.2]: https://github.com/poppa/sveltekit-svg/compare/v2.0.0...v2.0.2
[2.0.0]: https://github.com/poppa/sveltekit-svg/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/poppa/sveltekit-svg/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/poppa/sveltekit-svg/compare/v1.0.0...v1.0.1
