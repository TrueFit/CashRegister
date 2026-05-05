export function AboutPage() {
  return (
    <>
      <header className="top-card">
        <div>
          <h1>About Cash Register</h1>
          <p>
            A configurable cash-register calculator built to demonstrate product behavior,
            maintainable code organization, and reliable automated tests.
          </p>
        </div>
      </header>

      <section className="settings-layout" aria-label="About Cash Register">
        <section className="surface-card settings-panel">
          <div className="settings-section about-section">
            <div>
              <h2>Functionality</h2>
              <p>
                The app calculates the change that should be returned for a cash transaction. It
                supports manual transactions, flat-file uploads, configurable currencies, editable
                denominations, local transaction history, and a twist rule that can return random
                denominations when the owed amount matches the configured divisor.
              </p>
            </div>

            <div className="about-grid">
              <article className="about-card">
                <h3>Calculator</h3>
                <ul>
                  <li>Accepts amount owed and amount paid.</li>
                  <li>Converts non-base paid currencies before calculating change.</li>
                  <li>Shows total change, returned change, shortfalls, and denomination breakdowns.</li>
                </ul>
              </article>

              <article className="about-card">
                <h3>File Processing</h3>
                <ul>
                  <li>Loads plain-text or CSV-style files with one transaction per line.</li>
                  <li>Ignores blank lines and validates malformed rows.</li>
                  <li>Lets users download the output history as a text file.</li>
                </ul>
              </article>

              <article className="about-card">
                <h3>Settings</h3>
                <ul>
                  <li>Changes the twist-rule divisor without touching code.</li>
                  <li>Configures base currency and exchange equivalents.</li>
                  <li>Adds custom currencies and restores the full app state when needed.</li>
                </ul>
              </article>

              <article className="about-card">
                <h3>Denominations</h3>
                <ul>
                  <li>Enables or disables available bills and coins.</li>
                  <li>Supports US and Euro presets.</li>
                  <li>Allows custom denomination names, values, labels, and token colors.</li>
                </ul>
              </article>
            </div>

            <div className="settings-divider" />

            <div>
              <h2>Code Organization</h2>
              <p>
                The code is intentionally separated so the application can grow without turning one
                component into the entire system. React pages focus on rendering, shared UI lives in
                reusable components, and business logic stays in pure TypeScript domain modules.
              </p>
            </div>

            <div className="about-code-list" aria-label="Code organization summary">
              <div>
                <strong>src/pages</strong>
                <span>One routed file per screen: calculator, history, settings, denominations, and about.</span>
              </div>
              <div>
                <strong>src/components</strong>
                <span>Reusable UI pieces such as money tokens, history rows, and table headers.</span>
              </div>
              <div>
                <strong>src/domain</strong>
                <span>Pure change rules, currency helpers, denomination helpers, and transaction contracts.</span>
              </div>
              <div>
                <strong>src/app</strong>
                <span>Application-level constants such as routes and local-storage keys.</span>
              </div>
              <div>
                <strong>src/App.tsx</strong>
                <span>Coordinates app state, browser storage, routing layout, and page callbacks.</span>
              </div>
            </div>

            <div className="settings-divider" />

            <div>
              <h2>Testing</h2>
              <p>
                The test suite covers both the pure rule engine and the user-facing React workflows.
                This keeps the most important behavior protected while still making refactors safe.
              </p>
            </div>

            <div className="about-grid">
              <article className="about-card">
                <h3>Domain Tests</h3>
                <ul>
                  <li>Money parsing and validation.</li>
                  <li>Minimum-change calculations.</li>
                  <li>Random twist-rule behavior with controlled randomness.</li>
                  <li>Shortfall reporting when exact change is impossible.</li>
                </ul>
              </article>

              <article className="about-card">
                <h3>UI Tests</h3>
                <ul>
                  <li>Manual change calculation from the form.</li>
                  <li>Validation errors and local-storage persistence.</li>
                  <li>Currency conversion and denomination settings.</li>
                  <li>URL routing, history navigation, and the About page.</li>
                </ul>
              </article>
            </div>

            <div className="about-check-command">
              <strong>Quality command</strong>
              <code>npm run check</code>
              <span>Runs TypeScript typechecking followed by the Vitest suite.</span>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
