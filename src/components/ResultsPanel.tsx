import './ResultsPanel.css'
import type { EnvComparison } from '../lib/compare'
import type { EnvParseError } from '../lib/env-parser'

interface ResultsPanelProps {
  comparison: EnvComparison
  actualErrors: EnvParseError[]
  exampleErrors: EnvParseError[]
  emptyKeys: string[]
}

export default function ResultsPanel({
  comparison,
  actualErrors,
  exampleErrors,
  emptyKeys,
}: ResultsPanelProps) {
  const hasErrors =
    actualErrors.length > 0 || exampleErrors.length > 0

  return (
    <section className="results-panel" aria-labelledby="results-heading">
      <div className="results-panel__header">
        <div>
          <p className="eyebrow">ANALYSIS</p>
          <h2 id="results-heading">Configuration results</h2>
        </div>

        <span className={hasErrors ? 'status status--warning' : 'status'}>
          {hasErrors ? 'Review required' : 'Analysis complete'}
        </span>
      </div>

      <div className="results-panel__summary">
        <div>
          <span>Missing</span>
          <strong>{comparison.missing.length}</strong>
        </div>
        <div>
          <span>Extra</span>
          <strong>{comparison.extra.length}</strong>
        </div>
        <div>
          <span>Shared</span>
          <strong>{comparison.shared.length}</strong>
        </div>
      </div>

      {hasErrors && (
        <div className="results-panel__errors" role="alert">
          <h3>Parsing issues</h3>

          {[...actualErrors, ...exampleErrors].map((error, index) => (
            <p key={`${error.line}-${error.message}-${index}`}>
              Line {error.line}: {error.message}
            </p>
          ))}
        </div>
      )}
{emptyKeys.length > 0 && (
  <div className="results-panel__errors" role="status">
    <h3>Empty values</h3>
    <p>These variables are defined but have no value:</p>
    <ul>
      {emptyKeys.map((key) => (
        <li key={key}>
          <code>{key}</code>
        </li>
      ))}
    </ul>
  </div>
)}
      <div className="results-panel__lists">
        <ResultList title="Missing keys" keys={comparison.missing} />
        <ResultList title="Extra keys" keys={comparison.extra} />
        <ResultList title="Shared keys" keys={comparison.shared} />
      </div>
    </section>
  )
}

function ResultList({
  title,
  keys,
}: {
  title: string
  keys: string[]
}) {
  return (
    <div className="results-panel__list">
      <h3>
        {title} <span>{keys.length}</span>
      </h3>

      {keys.length === 0 ? (
        <p className="results-panel__empty">None detected</p>
      ) : (
        <ul>
          {keys.map((key) => (
            <li key={key}>
              <code>{key}</code>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
