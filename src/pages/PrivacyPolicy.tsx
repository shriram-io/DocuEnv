
interface PrivacyPolicyProps {
  onBack: () => void
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <main className="app">
      <section className="app__intro">
        <p className="app__eyebrow">DOCUENV · LEGAL</p>
        <h1>Privacy Policy</h1>
        <p>Last updated: October 30, 2026</p>
        <p>
          Your configuration files are yours. This policy explains
          how DocuEnv handles information when you use the application.
        </p>
      </section>

      <section className="results-panel">
        <h2>1. Introduction</h2>
        <p>
          DocuEnv is a browser-based environment configuration
          auditing tool. It helps developers compare environment
          files, identify configuration differences, infer variable
          types, and generate validation code.
        </p>
        <p>
          This policy describes the information involved in using
          DocuEnv, how it is processed, and the choices available
          to you.
        </p>

        <h2>2. Environment file processing</h2>
        <p>
          DocuEnv is designed to process the environment file
          contents you provide locally in your browser. The
          application does not require you to upload your
          configuration files to a DocuEnv application backend.
        </p>
        <p>
          Imported files are read by the browser, and configuration
          comparisons, type suggestions, and code generation are
          performed within the client application.
        </p>
        <p>
          You should still avoid entering production secrets on
          shared or untrusted devices.
        </p>

        <h2>3. Information processed by the application</h2>
        <p>
          Depending on how you use DocuEnv, your browser processes:
        </p>
        <ul>
          <li>Environment file contents that you enter or import.</li>
          <li>Environment variable names and values.</li>
          <li>Generated Zod schemas and CI validation scripts.</li>
          <li>Temporary application state used to display analysis results.</li>
        </ul>
        <p>
          This information is used to provide the requested
          functionality. We do not operate a DocuEnv user account
          or configuration-storage system.
        </p>

        <h2>4. File imports and clipboard access</h2>
        <p>
          When you import an environment file, your browser reads
          the selected file so DocuEnv can analyze its contents.
          Selecting a file does not itself constitute an upload
          to a DocuEnv application server.
        </p>
        <p>
          When you use a copy action, the application requests
          that your browser copy the selected generated output
          to your clipboard. Clipboard access is subject to
          browser permissions and security restrictions.
        </p>

        <h2>5. Local storage and data retention</h2>
        <p>
          DocuEnv does not provide cloud storage, user accounts,
          or a database for saving your environment configurations.
          Analysis data is maintained in the application's browser
          state while you use the page.
        </p>
        <p>
          Clearing the inputs resets the application state.
          Reloading or closing the page may also remove temporary
          in-memory analysis data. Clipboard contents are subject
          to your device and browser behavior.
        </p>

        <h2>6. Hosting and technical information</h2>
        <p>
          DocuEnv is hosted using Cloudflare Pages. When you visit
          the website, Cloudflare and other infrastructure providers
          may process technical information associated with
          delivering, maintaining, and securing the website.
        </p>
        <p>
          Such information may include IP addresses, browser
          information, request metadata, and security or diagnostic
          logs, subject to the provider's services and policies.
        </p>

        <h2>7. Cookies, analytics and tracking</h2>
        <p>
          DocuEnv does not currently provide account-based
          personalization or advertising features.
        </p>
        <p>
          We do not intentionally use your environment variable
          contents for advertising or behavioral profiling.
          Hosting infrastructure may use technical mechanisms
          necessary to deliver and protect the website.
        </p>
        <p>
          If analytics, cookies, or additional tracking services
          are introduced in the future, this policy should be
          updated to describe them accurately.
        </p>

        <h2>8. Third-party services</h2>
        <p>
          The website is delivered through Cloudflare Pages.
          Infrastructure providers may process technical
          information according to their own terms and privacy
          policies.
        </p>
        <p>
          DocuEnv does not control the privacy practices of
          third-party services. Review their policies before
          using services linked from the website.
        </p>

        <h2>9. Information security</h2>
        <p>
          DocuEnv is designed to minimize the transmission of
          environment configuration contents by performing
          analysis in the browser.
        </p>
        <p>
          However, no website, browser, device, or internet
          connection can be guaranteed completely secure.
          Keep your browser updated and protect your device.
          Never share real credentials or production secrets
          unnecessarily.
        </p>

        <h2>10. Your choices and data rights</h2>
        <p>
          You can choose what information to enter or import.
          You can clear the application inputs and avoid using
          the service whenever you wish.
        </p>
        <p>
          Technical information processed by hosting providers
          may be subject to their retention policies and
          applicable privacy laws.
        </p>

        <h2>11. Children's privacy</h2>
        <p>
          DocuEnv is a developer tool and is not intentionally
          designed to collect personal information from children.
          Users should not submit personal information belonging
          to others through the application.
        </p>

        <h2>12. Changes to this policy</h2>
        <p>
          This policy may be updated when application features,
          infrastructure, or data-handling practices change.
          The latest revision date will be displayed at the top
          of this page.
        </p>

        <h2>13. Contact</h2>
        <p>
          For questions or concerns about this Privacy Policy,
          contact the project maintainer through the official
          DocuEnv GitHub repository.
        </p>
      </section>

      <button type="button" onClick={onBack}>
        Back to DocuEnv
      </button>
    </main>
  )
}
