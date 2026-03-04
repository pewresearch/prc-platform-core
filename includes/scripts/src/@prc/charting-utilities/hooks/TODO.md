# TODO: Reorganize charting-utilities folder structure

The current `hooks/` and `utilities/` folders are misnamed and contain mixed concerns.

## What's actually here

**`hooks/`** (this folder) — despite the name, contains **no React hooks**. Every export is a pure `get*` prop-builder function (e.g. `getSharedProps`, `getAxisProps`, `getTooltipFormat`) that takes config/data/size and returns derived values synchronously. No `useState`, `useEffect`, or React dependency.

**`utilities/`** — contains a mix of:
- True React hooks (`useSize`, `useDarkMode`, `useLocalStorage`, `useMedia`, `useRegressionLine`)
- Pure non-React utilities (`helpers.ts`, `colorPalettes.ts`, `baseConfig.ts`, `randomData.ts`)
- React Context (`DataContext.ts`)

## Proposed reorganization

1. Rename `hooks/` → `prop-builders/` (or `derivations/`) to accurately reflect that these are pure prop-builder functions, not React hooks.
2. Split `utilities/` into:
   - `hooks/` — true React hooks (`use*.ts` files)
   - `utils/` — pure functions and non-React utilities

## Impact

This is a breaking rename for all consumers of `getSharedProps` and friends across `prc-charting-library`. It should be a dedicated refactor commit with a full build/test pass, not done on the side of another task.
