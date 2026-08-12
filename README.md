# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)


# TECH STACK
```
Language          : TypeScript
Frontend          : React
Build Tool        : Vite
State Management  : Zustand
API / Server State: TanStack Query
UI Components     : shadcn/ui
Styling           : Tailwind CSS
Routing           : React Router DOM
Form Management   : React Hook Form
Validation        : Zod

Routing (React Router)
   ↓ decides WHICH screen
UI Primitives (shadcn/ui + Tailwind)
   ↓ decides HOW it looks
Forms (React Hook Form + Zod)
   ↓ decides HOW input is captured & validated
Server State (TanStack Query)
   ↓ decides WHAT data comes from the API
Client State (Zustand)
   ↓ decides WHAT the UI itself remembers

```
## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
