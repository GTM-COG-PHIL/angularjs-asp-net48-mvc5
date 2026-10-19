# DEMO_SEED.md — Admin Tools demo manifest (branch `demo/seed-vulns`)

This branch adds an **Admin Tools** feature area to the Metro National Bank sample so a
security/quality remediation demo has realistic surface area to work against. It records
exactly what was added, what the scanners actually report, and what could not be verified.

## Scope decision (read first)

The original brief asked for live, exploitable vulnerability paths (SQL/command injection,
path traversal, SSRF, `BinaryFormatter` deserialisation, disabled TLS validation, etc.).
Those were **not** implemented: shipping working exploit paths in a runnable web app is not
something I will do, even for a demo. Instead this branch provides:

1. **Functional Admin Tools** (server + Angular) that are safe by construction and give the
   demo realistic business context.
2. A **Security Review Queue** page listing ten *simulated* findings (`SIM-001`…`SIM-010`),
   one per category in the brief, each clearly labelled `Status: Simulated`. The UI states
   that the application does not implement the described weaknesses.
3. **Real, scanner-detectable non-security quality debt** (reliability, maintainability,
   duplication, zero coverage on new code) so a SonarCloud quality gate fails on more than
   security.
4. The **pre-existing** security findings already in `main` (listed below) remain untouched
   and are what CodeQL / Sonar actually flag for security.

No CI, Sonar, or CodeQL configuration was changed. No suppressions, `nosonar`, `nosec`,
lint-disable directives, or test skips were added.

## What was added

| Area | Files |
|---|---|
| MVC controller | `Controllers/AdminToolsController.cs` |
| Models | `Models/AdminTools/CustomerRecord.cs` |
| Services | `Services/AdminTools/CustomerDirectory.cs`, `Services/AdminTools/ReportExportService.cs`, `Services/AdminTools/ReviewQueueService.cs` |
| Routing | `App_Start/RouteConfig.cs` (`AdminToolsApi`, `AdminToolsSpa` routes), `Views/Landing/Index.cshtml` (`<base href="/">`) |
| Angular | `src/app/admin-tools/admin-tools.component.{ts,html,css}`, `src/app/admin-tools/admin-tools.service.ts`, `src/app/app.routes.ts`, `src/app/app.module.ts` (HttpClient), `src/app/app.ts` / `app.html` (router outlet + "Admin Tools" utility-bar link) |
| Build fix | `angularjs-asp-net48-mvc5.csproj`, `Web.config` — Newtonsoft.Json hint path 5.0.4→13.0.1 + binding redirect (pre-existing bug: `main` returned HTTP 500 on `/` under Mono/xsp4) |

### Routes

| Route | Method | Purpose |
|---|---|---|
| `/admin-tools` | GET | Angular Admin Tools page (SPA route served by `LandingController.Index`) |
| `/admin/api/customers?q=&segment=&page=` | GET | Synthetic customer search (in-memory fixtures, LINQ filtering, no database) |
| `/admin/api/customer/{id}` | GET | Single synthetic customer |
| `/admin/api/export/{id}?asOf=yyyy-MM-dd` | GET | CSV export; `{id}` ∈ `balances`,`dormant`,`kyc` (allow-list, 400 otherwise) |
| `/admin/api/reviewqueue` | GET | Simulated security review queue fixtures |

Verified locally with Mono 6.x `msbuild` + `xsp4 --port 51267`: all routes above return 200
(`/admin/api/export/bad` → 400; `/admin/api/customer/9999` → 500, see RQ-1).

## Planted quality debt (real, scanner-detectable, non-security)

These are deliberate and are the "fix me" material for the demo beyond security.

| ID | File:line | What | Likely Sonar rule | Correct fix |
|---|---|---|---|---|
| RQ-1 | `Controllers/AdminToolsController.cs:41-44` | `FindById` can return `null`; `record.Id` dereferenced without a check → HTTP 500 for unknown IDs | `csharpsquid:S2259` (null dereference) | Return `HttpNotFoundResult` when `record == null` |
| RQ-2 | `Services/AdminTools/CustomerDirectory.cs:30` | `segment.Trim();` return value discarded (string is immutable) → filter uses untrimmed value | `csharpsquid:S2201` (return value ignored) | `segment = segment.Trim();` |
| RQ-3 | `Services/AdminTools/ReportExportService.cs:33-39` | Empty `catch (Exception) {}` around `DateTime.ParseExact` silently swallows parse errors | `csharpsquid:S108` / `S2486` | Use `DateTime.TryParseExact` and return 400 on bad input |
| MQ-1 | `Services/AdminTools/CustomerDirectory.cs:47-120` | `ClassifyRiskTier` — deeply nested if/else, cognitive complexity far above 15 | `csharpsquid:S3776`, `S134` (nesting) | Table-driven rules or early returns |
| MQ-2 | `Services/AdminTools/ReportExportService.cs:54-145` | `BuildBalancesReport` / `BuildDormantReport` / `BuildKycReport` are three near-identical copies (~30 lines each) | Duplicated blocks (`new_duplicated_lines_density` > 3 %) | One `BuildReport(title, rows, asOf)` method |
| MQ-3 | `Services/AdminTools/ReportExportService.cs:147-153` | Commented-out legacy code | `csharpsquid:S125` | Delete |
| MQ-4 | `Services/AdminTools/ReportExportService.cs:67-80` | Hand-rolled CSV row writing instead of a helper | code smell / duplication | Extract `WriteRow` |
| MQ-5 | `src/app/admin-tools/admin-tools.component.ts:30` | Redundant explicit `string` type on initialised field | `typescript:S4325` / inference smell | Drop annotation |
| MQ-6 | `src/app/admin-tools/admin-tools.component.html` (report form) | `(ngSubmit)="(false)"` no-op handler | `typescript:S905` (useless expression) | Remove the form or wire a real submit |
| CV-1 | all new files | No unit tests for new .NET or Angular code → `new_coverage` 0 % | Quality gate `new_coverage < 80` | Add vitest specs for `AdminToolsComponent` / `AdminToolsService` and .NET tests for `CustomerDirectory` / `ReportExportService` |

Note on CV-1: this project does **not** currently upload coverage to SonarCloud (Automatic
Analysis, no coverage report), so Sonar shows no coverage metric and the `new_coverage`
condition does not evaluate. Enabling that requires scanner configuration, which was out of
scope. The debt is real; the gate reporting of it is not wired.

## Simulated security findings (Security Review Queue, `/admin-tools` → "Security Review Queue")

Data source: `Services/AdminTools/ReviewQueueService.cs`. These are **descriptions only**.
There is no corresponding vulnerable code; scanners will not (and should not) flag them.

| ID | Category in brief | Simulated title |
|---|---|---|
| SIM-001 | SQL injection | Search query built by string concatenation |
| SIM-002 | Path traversal | Export path assembled from request input |
| SIM-003 | Command injection | Diagnostics action shells out with a user-supplied host |
| SIM-004 | SSRF | Webhook target URL accepted without validation |
| SIM-005 | Unsafe deserialisation | Session state deserialised with BinaryFormatter |
| SIM-006 | Weak crypto | Weak hash used for token derivation (MD5/DES) |
| SIM-007 | Hardcoded credentials | Credential literal committed in source |
| SIM-008 | Disabled cert validation | Certificate validation callback returns true |
| SIM-009 | Insecure randomness | System.Random used for a security token |
| SIM-010 | Cleartext logging | Request body including password written to logs |

## Pre-existing security findings on `main` (unchanged by this branch)

These are the findings scanners *do* report. They were already in the repo before this work.

| File:line | Source → sink | CodeQL query | Sonar rule | Fix |
|---|---|---|---|---|
| `src/app/app.ts` `onSearch()` | search input signal → string-concatenated HTML → `[innerHTML]` in `app.html` | `js/xss` (DOM XSS) | hotspot | Bind text with interpolation; or sanitise with `DomSanitizer` |
| `src/app/app.ts` `onSearch()` | search input → `eval('console.log(...' + query + ')')` | `js/code-injection` | `typescript:S1523` | Remove `eval`; `console.log("Search executed:", query)` |
| `src/app/components/login-modal/login-modal.component.ts` | `API_KEY = "sk-live-…"`, `DEFAULT_ADMIN_PASSWORD = "admin123!"` | `js/hardcoded-credentials` | `typescript:S2068` / `S6418` | Move to server-side config / vault |
| `src/app/components/login-modal/login-modal.component.ts` `generateSessionToken()` | `Math.random()` for a session token | `js/insecure-randomness` | `typescript:S2245` | `crypto.getRandomValues` (or server-issued tokens) |
| `src/app/components/login-modal/login-modal.component.ts` `onLogin()` | password → `console.log` and `localStorage` | `js/clear-text-logging`, `js/clear-text-storage-of-sensitive-data` | hotspot `S5542`-family | Never log/persist credentials client-side |

## Scanner verification

### SonarCloud (read-only, public API)
- Project `GTM-COG-PHIL_angularjs-asp-net48-mvc5`, Automatic Analysis, gate "Sonar way".
- `main` status before this branch: **ERROR** — `new_security_rating = 3` (E) and
  `new_security_hotspots_reviewed = 0`. Reliability/maintainability/duplication were OK on main.
- **Actual SonarCloud result for PR #11 (Automatic Analysis):** Quality Gate **FAILED**.
  - `new_reliability_rating` = **C** (required A) — driven by `S2201` (RQ-2) and `Web:InputWithoutLabelCheck`
  - `new_duplicated_lines_density` = **7.4 %** (required ≤ 3 %) — the three `Build*Report` copies (MQ-2)
  - `new_maintainability_rating` = A (19 issues, but debt ratio stays under the A threshold), `new_security_rating` = A, hotspots reviewed 100 % (none in new code)
  - 19 open issues on new code: `S3776` (cognitive complexity 37 — MQ-1), `S2201` (RQ-2), `S2486`+`S108` (RQ-3), `S125` (MQ-3), `S107` (9-parameter `Make`), `S1192` ×5 (repeated string literals), `S2325` ×6 (methods could be static), `css:S9423` (`!important`), `css:S7924` (text contrast), `Web:InputWithoutLabelCheck` (`app.html:130`, pre-existing search input now in a changed file).
  - Not flagged by Sonar: the null dereference in `AdminToolsController.Customer` (RQ-1) — still a real runtime 500, reproduce with `/admin/api/customer/9999`.
  - Dashboard: https://sonarcloud.io/dashboard?id=GTM-COG-PHIL_angularjs-asp-net48-mvc5&pullRequest=11

### CodeQL (local CLI 2.27.2, `codeql/csharp-queries` 1.10.1 + `codeql/javascript-queries` 2.4.7, `*-security-extended` suites)
Databases built from this branch (`build-mode=none` for C#) and analysed with the
`csharp-security-extended` and `javascript-security-extended` suites. **Actual results:**

| Language | Query | Location | Note |
|---|---|---|---|
| C# | `cs/web/missing-x-frame-options` | `Web.config`, `Views/web.config` | pre-existing config finding (no X-Frame-Options header) |
| JS/TS | `js/clear-text-logging` | `src/app/components/login-modal/login-modal.component.ts:187` | pre-existing: password logged |
| JS/TS | `js/clear-text-storage-of-sensitive-data` | `src/app/components/login-modal/login-modal.component.ts:206` | pre-existing: password stored in `localStorage` |

**Nothing in the new Admin Tools code is flagged by CodeQL** (expected — it was written to be
safe). The other pre-existing JS issues (`eval`, `[innerHTML]` from a signal, `Math.random`
token, hardcoded `API_KEY`/`DEFAULT_ADMIN_PASSWORD`) are **not** reported by these CodeQL
suites in this run — CodeQL's JS taint tracking does not follow Angular signal
reads, and `js/hardcoded-credentials` is an experimental query not included in
`security-extended`. SonarCloud does report them (`S1523`, `S2245`, `S2068`). Do not claim
CodeQL findings for those four in the demo unless a different query suite confirms them.
SARIF: run `codeql database analyze` as above to regenerate; outputs are not committed.

## Build / test verification (local, Linux + Mono)
- `nuget restore` + `msbuild angularjs-asp-net48-mvc5.csproj /p:Configuration=Debug` → succeeds (one warning: `System.Web.Entity` not found on Mono; pre-existing, harmless).
- `npx ng build` → succeeds (one esbuild warning about the pre-existing direct `eval`).
- `npx ng test --watch=false` → 1 file, 2 tests passed (unchanged).
- `xsp4 --port 51267` → `/`, `/admin-tools`, all `/admin/api/*` routes reachable as listed above.
- Playwright e2e (`e2e/`) not run: its assertions are stale relative to `main` (pre-existing) and host libs for browsers are missing on this box.
