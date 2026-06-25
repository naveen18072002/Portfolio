# Naveenkumar R — Portfolio (Angular 22)

This is an Angular 22 (standalone components, signals-first) conversion of
the original static HTML/CSS/JS portfolio. The visual design, copy, and
behaviour are preserved — only the implementation moved to Angular.

> Upgraded from the initial Angular 18 conversion to Angular 22 (the current
> stable release as of June 2026). See **"Angular 22 specifics"** below for
> what that upgrade touched.

## What changed vs. the original site

- The single `index.html` page is now a real Angular app with components:
  - `SidebarComponent` — the avatar/contact card, with the mobile "Show
    Contacts" expand/collapse toggle.
  - `NavbarComponent` — the bottom/top tab bar (About / Resume / Projects /
    Contact). Tab switching is driven by a small `PageStateService`
    (Angular signal) instead of manual DOM class toggling.
  - `AboutComponent`, `ResumeComponent`, `ProjectsComponent`,
    `ContactComponent` — one component per `<article>` section from the
    original markup. They each accept an `isActive` input that toggles the
    same `.active` CSS class the hand-written JS used to toggle.
  - `ContactComponent` now uses Angular's `ReactiveFormsModule` for
    validation (full name, valid email, non-empty message) instead of the
    hand-rolled `form1.addEventListener('submit', ...)` script, and submits
    to Web3Forms via `HttpClient` (`ContactService`). Submission state
    (`submitting`, `errorMessage`) is held in **signals** rather than plain
    fields — see below for why.
- On a successful submit, the app navigates to `/thank-you`
  (`ThankYouComponent`) using the Angular Router instead of relying on
  Web3Forms' `redirect` field to load a separate static page.
- All CSS from `style.css` was moved as-is into `src/styles.css` (global
  styles), since the design system relies on shared CSS variables and
  classes across every section.
- The Google Maps `<iframe>` URL is passed through `DomSanitizer` since
  Angular sanitizes `iframe[src]` bindings by default.
- `ion-icon` (from the Ionicons web component library) is still loaded via
  `<script>` tags in `src/index.html`, exactly like the original, and each
  component that uses `<ion-icon>` declares `CUSTOM_ELEMENTS_SCHEMA` so
  Angular doesn't try to resolve it as an Angular component.

## Angular 22 specifics

- **Node.js**: Angular 22 requires `^22.22.3 || ^24.15.0 || >=26.0.0`. Run
  `node -v` and update if you're on an older Node 22 patch — Angular's CLI
  hard-fails below that minimum patch version (this was the most awkward
  part of the upgrade to verify in this conversion's sandbox, which was
  one patch version short).
- **TypeScript 6**: `@angular/compiler-cli@22` pins `typescript: ">=6.0 <6.1"`.
  `package.json` and the lockfile reflect that.
- **Builder swap**: Angular 22 deprecates the Webpack-based
  `@angular-devkit/build-angular` in favor of the esbuild/Vite-based
  `@angular/build` package. `angular.json` now points `build`/`serve` at
  `@angular/build:application` / `@angular/build:dev-server`.
- **Dropped unused packages**: `@angular/platform-browser-dynamic` (we
  already bootstrap via `@angular/platform-browser`'s
  `bootstrapApplication`) and `@angular/animations` (unused, and now
  deprecated in favor of the `animate.enter`/`animate.leave` template
  bindings) were removed — npm flagged both as deprecated/unused during
  the upgrade.
- **OnPush-by-default + signals**: Angular 22 makes `OnPush` change
  detection the default for components that don't specify a strategy.
  Under OnPush, a plain class field mutated inside an async callback (like
  an HTTP response handler) won't reliably re-render the view. `submitting`
  and `errorMessage` in `ContactComponent` were converted from plain
  `boolean`/`string` fields to `signal(...)`, which Angular's reactivity
  system tracks regardless of change-detection strategy. Everywhere else
  (`PageStateService.activePage`, `SidebarComponent.isOpen`, the `isActive`
  `@Input()`s) was either already a signal or relies on the long-standing
  OnPush rule that `@Input` changes always mark a component dirty, so no
  other changes were needed.

## Before you run it — add your images

The original project's images (in `./assets/images/...`) were referenced in
the pasted HTML/CSS but weren't uploaded as files, so they're not included
here. Copy them into `src/assets/images/` using the same filenames:

```
src/assets/images/
  logo.ico
  my-avatar.jpg
  icon-design.svg
  icon-dev.svg
  icon-photo.svg
  bike.png
  project-1.png
  project-2.png
  project-3.png
```

(`src/assets/images/README.txt` has the same list.)

## Running it

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

Production build:

```bash
npm run build     # outputs to dist/portfolio-angular
```

If `npm install`/`npm start` fail in PowerShell with a "cannot be loaded...
not digitally signed" error, that's a PowerShell script-execution policy
issue, not an Angular issue — run `Set-ExecutionPolicy -Scope CurrentUser
RemoteSigned` once, or just use Command Prompt instead.

## Notes / things you may want to revisit

- The Web3Forms access key from the original form is reused as-is in
  `ContactService`. Rotate it if you'd rather not keep the same key public
  in a new repo.
- The original `thankyou.html` redirect URL
  (`https://naveenkumar-portfolio.netlify.app/thankyou.html`) is no longer
  used — the in-app `/thank-you` route replaces it. If you deploy this and
  still want Web3Forms' own redirect as a fallback (e.g. for users with
  JavaScript disabled), you can keep a static `thankyou.html` in
  `src/assets` and set the form's `redirect` hidden field again.
- This conversion keeps the exact same look by reusing the original
  `style.css` wholesale as global styles, rather than splitting styles
  per-component — that's intentional, since most rules (CSS variables,
  shared classes like `.h2`, `.btn`, `.content-card`) are used across every
  section.

