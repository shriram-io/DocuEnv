
import { useState } from 'react'
import './App.css'

import FileInput from './components/FileInput'
import ResultsPanel from './components/ResultsPanel'
import { parseEnv } from './lib/env-parser'
import { compareEnv } from './lib/compare'
import { inferType } from './lib/infer-type'
import { generateZodSchema } from './lib/generate-zod'
import { generateCiScript } from './lib/generate-ci'
function App() {
  const [envContent, setEnvContent] = useState('')
  const [exampleContent, setExampleContent] = useState('')
  const [envFileName, setEnvFileName] = useState('')
  const [exampleFileName, setExampleFileName] = useState('')
  const [analyzed, setAnalyzed] = useState(false)

const [typeOverrides, setTypeOverrides] = useState<
  Record<string, import('./lib/infer-type').InferredType>
>({})

  const envResult = parseEnv(envContent)
  const exampleResult = parseEnv(exampleContent)
  const comparison = compareEnv(envResult.entries, exampleResult.entries)
const emptyKeys = envResult.entries
  .filter((entry) => entry.value.trim() === '')
  .map((entry) => entry.key)
const typeSuggestions = envResult.entries.map((entry) => {
  const suggestion = inferType(entry.key, entry.value)

  return {
    key: entry.key,
    value: entry.value,
    ...suggestion,
    type: typeOverrides[entry.key] ?? suggestion.type,
  }
})

const zodSchema = generateZodSchema(
  typeSuggestions.map((suggestion) => ({
    key: suggestion.key,
    type: suggestion.type,
    required: true,
  })),
)
const ciScript = generateCiScript()
  function analyzeConfiguration() {
    setAnalyzed(true)
  }

  function clearInputs() {
    setEnvContent('')
    setExampleContent('')
    setEnvFileName('')
    setExampleFileName('')
    setAnalyzed(false)
  }

  return (
    <main className="app">
      <header className="app__header">
        <p className="app__brand">DocuEnv</p>
        <span className="app__privacy">Processed locally</span>
      </header>

      <section className="app__intro">
        <p className="app__eyebrow">ENVIRONMENT CONFIGURATION TOOL</p>
        <h1>Know what your environment needs.</h1>
        <p>
          Compare your environment configuration with its example,
          identify missing variables, and prepare reliable validation
          for your project.
        </p>
      </section>

      <section aria-labelledby="workspace-heading">
        <div className="app__workspace-heading">
          <h2 id="workspace-heading">Configuration workspace</h2>
          <p>Paste content or import local files</p>
        </div>

        <div className="app__inputs">
          <FileInput
            title=".env"
            description="Your current local configuration."
            value={envContent}
            onChange={setEnvContent}
            fileName={envFileName}
            onFileNameChange={setEnvFileName}
          />

          <FileInput
            title=".env.example"
            description="The configuration template your project expects."
            value={exampleContent}
            onChange={setExampleContent}
            fileName={exampleFileName}
            onFileNameChange={setExampleFileName}
          />
        </div>
      </section>

      <div className="app__actions">
        <button
          className="app__button"
          type="button"
          onClick={analyzeConfiguration}
          disabled={!envContent.trim() || !exampleContent.trim()}
        >
          Analyze configuration
        </button>

        <button
          className="app__button app__button--secondary"
          type="button"
          onClick={clearInputs}
        >
          Clear inputs
        </button>
      </div>

      
{analyzed && (
  <div className="app__results">
        <ResultsPanel
      comparison={comparison}
      actualErrors={envResult.errors}
      exampleErrors={exampleResult.errors}
      emptyKeys={emptyKeys}
    />

    <section className="results-panel" aria-labelledby="types-heading">
      <div className="results-panel__header">
        <div>
          <p className="eyebrow">TYPE INFERENCE</p>
          <h2 id="types-heading">Suggested variable types</h2>
        </div>
      </div>

      {typeSuggestions.length === 0 ? (
        <p>No variables to classify.</p>
      ) : (
        <div className="results-panel__lists">
          {typeSuggestions.map((suggestion) => (
            <div className="results-panel__list" key={suggestion.key}>
              <h3>{suggestion.key}</h3>
              
<label>
  Suggested type:
  {' '}
  <select
    value={suggestion.type}
    onChange={(event) => {
      const selectedType = event.target.value as
        import('./lib/infer-type').InferredType

      setTypeOverrides((current) => ({
        ...current,
        [suggestion.key]: selectedType,
      }))
    }}
  >
    <option value="string">String</option>
    <option value="number">Number</option>
    <option value="boolean">Boolean</option>
    <option value="url">URL</option>
    <option value="email">Email</option>
    <option value="port">Port</option>
  </select>
</label>

              <p>
                Confidence: {suggestion.confidence}
              </p>
              <p>{suggestion.reason}</p>
            </div>
          ))}
        </div>
      
      )}
    </section>

    <section className="results-panel" aria-labelledby="schema-heading">
      <div className="results-panel__header">
        <div>
          <p className="eyebrow">GENERATED CODE</p>
          <h2 id="schema-heading">Zod validation schema</h2>
        </div>

        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(zodSchema)
          }}
        >
          Copy schema
        </button>
      </div>

      <pre
        style={{
          overflowX: 'auto',
          padding: '16px',
          background: '#f3f0e8',
          whiteSpace: 'pre',
        }}
      >
        <code>{zodSchema}</code>
      </pre>
    </section>
  </div>
)}
<section className="results-panel" aria-labelledby="ci-heading">
  <div className="results-panel__header">
    <div>
      <p className="eyebrow">CI VALIDATION</p>
      <h2 id="ci-heading">Environment validation script</h2>
    </div>

    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(ciScript)
      }}
    >
      Copy script
    </button>
  </div>

  <pre
    style={{
      overflowX: 'auto',
      padding: '16px',
      background: '#f3f0e8',
      whiteSpace: 'pre',
    }}
  >
    <code>{ciScript}</code>
  </pre>
</section>


      <footer className="app__footer">
        DocuEnv · Environment values stay in your browser.
      </footer>
    </main>
  )
}

export default App
