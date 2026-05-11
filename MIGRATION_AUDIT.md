# AngularJS Migration Audit Inventory

> **Generated**: 2026-03-03
> **Purpose**: Document every AngularJS building block in this codebase that needs to be migrated to modern Angular.
> **Scope**: Full codebase scan of `WebApp/`, `Views/`, `App_Start/`, and all other directories.

---

## 1. Root Module Declaration

| Item             | Details                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| **File**         | `WebApp/app.js`                                                                                            |
| **Module Name**  | `app`                                                                                                      |
| **Declaration**  | `angular.module('app', [])`                                                                                |
| **Dependencies** | None (empty dependency array)                                                                              |
| **Notes**        | Single root module bootstrapped via `ng-app="app"` on the `<body>` element in `Views/Landing/Index.cshtml` |

---

## 2. Components

| #   | Name            | File                                  | Controller      | `controllerAs` | Bindings     | `$inject` Dependencies | Lifecycle Hooks | Template Type       | Notes                                                 |
| --- | --------------- | ------------------------------------- | --------------- | -------------- | ------------ | ---------------------- | --------------- | ------------------- | ----------------------------------------------------- |
| 1   | `testComponent` | `WebApp/Components/test.component.js` | `TestComponent` | `vm`           | `{}` (empty) | `$log`                 | `$onInit`       | Inline (`template`) | Displays AngularJS version via `angular.version.full` |

### Component Details

#### `testComponent` (`WebApp/Components/test.component.js`)

- **Registration**: `angular.module('app').component('testComponent', { ... })`
- **Controller**: `TestComponent` (named function)
- **`controllerAs`**: `vm`
- **Bindings**: `{}` (none)
- **`$inject`**: `['$log']`
- **Lifecycle Hooks**:
  - `vm.$onInit` — logs `'test-component initialized...'` via `$log.info()`
- **Template** (inline):
  ```html
  <div data-testid="angularjs-version" class="test-component">
    AngularJS Version: {{vm.version}}
  </div>
  ```
- **Properties set on `vm`**:
  - `vm.version` = `angular.version.full`

---

## 3. Directives

| #   | Name            | File                                  | Restrict      | Scope          | `controllerAs` | `$inject` Dependencies | Template Type            | Notes                                    |
| --- | --------------- | ------------------------------------- | ------------- | -------------- | -------------- | ---------------------- | ------------------------ | ---------------------------------------- |
| 1   | `testDirective` | `WebApp/Directives/test.directive.js` | `E` (element) | `{}` (isolate) | `vm`           | `$log`                 | External (`templateUrl`) | Displays jQuery version via `$().jquery` |

### Directive Details

#### `testDirective` (`WebApp/Directives/test.directive.js`)

- **Registration**: `angular.module('app').directive('testDirective', TestDirective)`
- **Factory Function**: `TestDirective` (named function)
- **`$inject`**: `['$log']`
- **Restrict**: `E` (element only)
- **Scope**: `{}` (isolate scope, no bindings)
- **`controllerAs`**: `vm`
- **Controller**: Inline anonymous function
- **Template**: External file at `WebApp/Directives/test.directive.html`
  ```html
  <div data-testid="jquery-version" class="test-directive">
    jQuery Version: {{ vm.version }}
  </div>
  ```
- **Properties set on `vm`**:
  - `vm.version` = `$().jquery` (jQuery version)
- **Lifecycle Hooks**: None (initialization logic runs directly in the controller function body)
- **Notes**: Uses `$log.info('test-directive initialized...')` for logging during controller instantiation (not in a lifecycle hook)

---

## 4. Services

No AngularJS services (`.service()`, `.factory()`, `.provider()`) were found in the codebase.

---

## 5. Controllers

No standalone AngularJS controllers (`.controller()`) were found in the codebase. Controllers exist only inline within the component and directive definitions listed above.

---

## 6. Filters

No AngularJS filters (`.filter()`) were found in the codebase.

---

## 7. Constants and Values

No AngularJS constants (`.constant()`) or values (`.value()`) were found in the codebase.

---

## 8. `$inject` Dependency Summary

| #   | Location                                | Function        | Injected Dependencies |
| --- | --------------------------------------- | --------------- | --------------------- |
| 1   | `WebApp/Components/test.component.js:8` | `TestComponent` | `$log`                |
| 2   | `WebApp/Directives/test.directive.js:3` | `TestDirective` | `$log`                |

### Unique AngularJS Services Used

| Service | Usage Count | Used In                          |
| ------- | ----------- | -------------------------------- |
| `$log`  | 2           | `testComponent`, `testDirective` |

---

## 9. Lifecycle Hooks Summary

| #   | Hook      | Component/Directive | File                                  | Line |
| --- | --------- | ------------------- | ------------------------------------- | ---- |
| 1   | `$onInit` | `testComponent`     | `WebApp/Components/test.component.js` | 14   |

**Note**: `testDirective` does not use lifecycle hooks; its initialization logic runs directly in the controller constructor.

---

## 10. Bindings Summary

| #   | Component/Directive | Bindings                                 |
| --- | ------------------- | ---------------------------------------- |
| 1   | `testComponent`     | `{}` (empty - no input/output bindings)  |
| 2   | `testDirective`     | `scope: {}` (isolate scope, no bindings) |

---

## 11. Template Files

| #   | File                                    | Type                   | Used By         |
| --- | --------------------------------------- | ---------------------- | --------------- |
| 1   | `WebApp/Directives/test.directive.html` | External HTML template | `testDirective` |

**Note**: `testComponent` uses an inline `template` string rather than an external file.

---

## 12. Host Page (AngularJS Bootstrap)

| Item                | Details                                                                               |
| ------------------- | ------------------------------------------------------------------------------------- |
| **File**            | `Views/Landing/Index.cshtml`                                                          |
| **Bootstrap**       | `<body ng-app="app">`                                                                 |
| **Component Usage** | `<test-directive></test-directive>`, `<test-component></test-component>`              |
| **Script Bundling** | `App_Start/BundleConfig.cs` bundles jQuery, AngularJS, and all `WebApp/**/*.js` files |

---

## 13. Third-Party Dependencies

| Library   | Version (from `package.json`) | Notes                                                  |
| --------- | ----------------------------- | ------------------------------------------------------ |
| `angular` | `^1.8.3`                      | Core AngularJS framework (XLTS extended support)       |
| `jquery`  | `^3.6.3`                      | Used directly in `testDirective` to get jQuery version |

---

## Summary

| Category                            | Count | Items                                                |
| ----------------------------------- | ----- | ---------------------------------------------------- |
| **Root Modules**                    | 1     | `app`                                                |
| **Components**                      | 1     | `testComponent`                                      |
| **Directives**                      | 1     | `testDirective`                                      |
| **Services**                        | 0     | —                                                    |
| **Controllers**                     | 0     | (only inline controllers within component/directive) |
| **Filters**                         | 0     | —                                                    |
| **Constants/Values**                | 0     | —                                                    |
| **Template Files**                  | 1     | `test.directive.html`                                |
| **Unique `$inject` Dependencies**   | 1     | `$log`                                               |
| **Lifecycle Hooks in Use**          | 1     | `$onInit`                                            |
| **Total AngularJS Building Blocks** | **3** | 1 module + 1 component + 1 directive                 |
