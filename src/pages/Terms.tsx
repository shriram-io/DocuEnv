
interface TermsProps {
  onBack: () => void
}

export default function Terms({ onBack }: TermsProps) {
  return (
    <main className="app">
      <section className="app__intro">
        <p className="app__eyebrow">DOCUENV · LEGAL</p>
        <h1>Terms of Use</h1>
        <p>Last updated: October 30, 2026</p>
        <p>
          Please read these terms before using DocuEnv.
          They explain the responsibilities and limitations
          associated with the service.
        </p>
      </section>

      <section className="results-panel">
        <h2>1. Acceptance of terms</h2>
        <p>
          By accessing or using DocuEnv, you agree to these
          Terms of Use. If you do not agree with these terms,
          please discontinue use of the application.
        </p>

        <h2>2. Description of the service</h2>
        <p>
          DocuEnv is a browser-based developer tool that helps
          users compare environment configuration files,
          identify missing and extra variables, infer likely
          variable types, and generate Zod schemas and CI
          validation scripts.
        </p>
        <p>
          Features may be modified, added, suspended, or
          discontinued as the project evolves.
        </p>

        <h2>3. Permitted use</h2>
        <p>
          You may use DocuEnv for lawful software development,
          configuration auditing, testing, and educational
          purposes.
        </p>
        <p>You agree not to:</p>
        <ul>
          <li>Use the application for unlawful activities.</li>
          <li>Attempt to disrupt or interfere with website operations.</li>
          <li>Attempt unauthorized access to infrastructure or systems.</li>
          <li>Use the service to distribute malicious content.</li>
          <li>Abuse the service in a way that affects other users.</li>
        </ul>

        <h2>4. User responsibilities</h2>
        <p>
          You are responsible for the files, configuration values,
          and other information you provide to the application.
          You must ensure that you have the right to use the
          information you submit.
        </p>
        <p>
          You are also responsible for reviewing generated
          schemas, validation scripts, and type suggestions
          before integrating them into your projects.
        </p>

        <h2>5. Environment files and security</h2>
        <p>
          DocuEnv is designed to process configuration data
          locally in your browser rather than uploading it to
          a DocuEnv application backend.
        </p>
        <p>
          You remain responsible for protecting your device,
          browser, credentials, and environment files. Avoid
          entering production secrets on shared or untrusted
          devices.
        </p>

        <h2>6. Accuracy and generated output</h2>
        <p>
          Type inference, configuration comparisons, and
          generated code are provided as development assistance.
          They may not identify every configuration problem
          or satisfy every project's requirements.
        </p>
        <p>
          Generated output should be reviewed, tested, and
          validated before use in development, staging, or
          production environments.
        </p>

        <h2>7. Intellectual property and open source</h2>
        <p>
          DocuEnv is distributed under the MIT License.
          Use, modification, and redistribution of the
          project's source code are subject to the terms
          of that license.
        </p>
        <p>
          Third-party dependencies remain subject to their
          respective licenses.
        </p>

        <h2>8. Availability and modifications</h2>
        <p>
          DocuEnv is provided as a publicly available project.
          We do not guarantee uninterrupted availability,
          compatibility with every browser, or permanent
          availability of every feature.
        </p>
        <p>
          Maintenance, updates, or infrastructure issues
          may temporarily affect access to the service.
        </p>

        <h2>9. Disclaimer of warranties</h2>
        <p>
          To the extent permitted by applicable law, DocuEnv
          is provided on an "as is" and "as available" basis,
          without warranties regarding accuracy, reliability,
          fitness for a particular purpose, or uninterrupted
          availability.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          To the extent permitted by applicable law, the
          project maintainer shall not be liable for indirect,
          incidental, special, or consequential losses arising
          from the use of, inability to use, or reliance on
          DocuEnv or its generated output.
        </p>
        <p>
          Nothing in these terms excludes liability that
          cannot legally be excluded under applicable law.
        </p>

        <h2>11. Changes to these terms</h2>
        <p>
          These terms may be revised when the application,
          its features, or applicable requirements change.
          The latest revision date will appear at the top
          of this page.
        </p>

        <h2>12. Governing law</h2>
        <p>
          These terms are intended to be interpreted in
          accordance with applicable laws of India,
          subject to mandatory legal protections and
          jurisdictional requirements.
        </p>

        <h2>13. Contact</h2>
        <p>
          For questions about these terms, contact the
          project maintainer through the official DocuEnv
          GitHub repository.
        </p>
      </section>

      <button type="button" onClick={onBack}>
        Back to DocuEnv
      </button>
    </main>
  )
}
