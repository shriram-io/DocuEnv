
import { useState } from 'react'

interface FAQProps {
  onBack: () => void
}
import type { ReactNode } from 'react'

interface FAQQuestion {
  question: string
  answer: ReactNode
}

interface FAQSection {
  title: string
  questions: FAQQuestion[]
}
const faqSections: FAQSection[] = [
  {
    title: 'Getting started',
    questions: [
      {
        question: 'What is DocuEnv?',
        answer:
          'DocuEnv is a browser-based environment configuration auditing tool. It helps developers compare .env files, identify missing and extra variables, infer likely variable types, and generate Zod schemas and CI validation scripts.',
      },
      {
        question: 'How do I use DocuEnv?',
        answer:
          'Provide your .env configuration and its example file by pasting their contents or importing local files. Select Analyze configuration to review the results and generate validation output.',
      },
      {
        question: 'Is DocuEnv free?',
        answer:
          'DocuEnv is currently available as a free public web application. Check the official repository for its source code and license.',
      },
    ],
  },
  {
    title: 'Privacy and security',
    questions: [
      {
        question: 'Are my environment variables uploaded?',
        answer:
          'DocuEnv is designed to process configuration contents locally in your browser. It does not require uploading your environment files to a DocuEnv application backend.',
      },
      {
        question: 'Does DocuEnv store my secrets?',
        answer:
          'DocuEnv does not provide accounts, a database, or cloud storage for your configuration files. Temporary analysis data is maintained in browser application state.',
      },
      {
        question: 'Is it safe to use production secrets?',
        answer:
          'Although analysis is designed to happen locally, you should avoid entering production secrets on shared or untrusted devices. Protect your browser, operating system, and credentials.',
      },
      {
        question: 'Can I clear my configuration data?',
        answer:
          'Yes. Use Clear inputs to reset the configuration fields and analysis results. Reloading or closing the page may also clear temporary in-memory application state.',
      },
    ],
  },
  {
    title: 'Features and functionality',
    questions: [
      {
        question: 'Which files can I import?',
        answer:
          'The file picker accepts .env, .example, and .txt files. You can also paste configuration contents directly into the input fields.',
      },
      {
        question: 'What does configuration comparison detect?',
        answer:
          'DocuEnv identifies missing variables, extra variables, and variables that are present in both configurations. It also helps highlight configuration differences.',
      },
      {
        question: 'How does type inference work?',
        answer:
          'DocuEnv examines variable names and values to suggest likely types such as strings, numbers, booleans, URLs, emails, and ports. These are suggestions and should be reviewed.',
      },
      {
        question: 'Can I change an inferred type?',
        answer:
          'Yes. Where type overrides are available, you can manually select a different type before generating the validation schema.',
      },
      {
        question: 'What is the generated Zod schema?',
        answer:
          'It is TypeScript validation code generated from the detected environment variables. Review the generated schema and adjust it to match your application requirements.',
      },
      {
        question: 'What does the CI validation script do?',
        answer:
          'DocuEnv generates a validation script intended to help check environment configuration during continuous integration. Review and test the script in your own CI environment before relying on it.',
      },
    ],
  },
  {
    title: 'Compatibility and troubleshooting',
    questions: [
      {
        question: 'Does DocuEnv work on mobile devices?',
        answer:
          'Yes. The interface is designed to support desktop, tablet, and mobile browsers. The available screen space may affect the editing experience.',
      },
      {
        question: 'Does DocuEnv work offline?',
        answer:
          'The application needs to be loaded from the website first. Once loaded, much of the analysis is performed locally, but offline availability after closing or refreshing the page is not guaranteed.',
      },
      {
        question: 'Why can a generated result be incorrect?',
        answer:
          'Type inference and generated validation code are automated suggestions. Unusual variable formats and project-specific requirements may need manual adjustments.',
      },
      {
  question: 'Where can I report a bug or suggest a feature?',
  answer: (
    <>
      You can email us at{' '}
      <a href="mailto:shriram.project1@gmail.com">
        shriram.project1@gmail.com
      </a>
      {' '}to report bugs, suggest features, or share feedback.
      You do not need a GitHub account. Please avoid including
      passwords, API keys, or production secrets in your report.
      Developers can also use the official DocuEnv GitHub repository.
    </>
  ),
},
    ],
  },
]

export default function FAQ({ onBack }: FAQProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null)

  return (
    <main className="app">
      <section className="app__intro">
        <p className="app__eyebrow">DOCUENV · HELP CENTER</p>
        <h1>Frequently Asked Questions</h1>
        <p>
          Find answers about configuration analysis, privacy,
          security, generated code, and using DocuEnv.
        </p>
      </section>

      <div className="faq">
        {faqSections.map((section) => (
          <section className="faq__section" key={section.title}>
            <h2>{section.title}</h2>

            <div className="faq__list">
              {section.questions.map((item) => {
                const isOpen = openQuestion === item.question

                return (
                  <article className="faq__item" key={item.question}>
                    <h3>
                      <button
                        type="button"
                        className="faq__question"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenQuestion(
                            isOpen ? null : item.question,
                          )
                        }
                      >
                        <span>{item.question}</span>
                        <span aria-hidden="true">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                    </h3>

                    {isOpen && (
                      <div className="faq__answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <button type="button" onClick={onBack}>
        Back to DocuEnv
      </button>
    </main>
  )
}
