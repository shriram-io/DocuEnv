import './FileInput.css'
import { useRef } from 'react'

interface FileInputProps {
  title: string
  description: string
  value: string
  onChange: (value: string) => void
  fileName: string
  onFileNameChange: (name: string) => void
}

export default function FileInput({
  title,
  description,
  value,
  onChange,
  fileName,
  onFileNameChange,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]
    if (!file) return

    const content = await file.text()
    onChange(content)
    onFileNameChange(file.name)

    event.target.value = ''
  }

  return (
    <section className="file-input">
      <div className="file-input__header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <textarea
        aria-label={title}
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={'API_URL=https://example.com\nPORT=3000'}
        rows={9}
      />

      <div className="file-input__footer">
        <span>{fileName || 'No file selected'}</span>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          Import file
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".env,.example,.txt"
          hidden
          onChange={handleFileChange}
          aria-label={`Import ${title}`}
        />
      </div>
    </section>
  )
}
