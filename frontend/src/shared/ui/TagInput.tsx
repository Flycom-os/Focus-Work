import { useMemo, useState } from 'react'

type Props = {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagInput({ value, onChange, placeholder = 'Add tag and press Enter' }: Props) {
  const [text, setText] = useState('')

  const normalized = useMemo(() => Array.from(new Set(value.map((t) => t.trim()).filter(Boolean))), [value])

  return (
    <div className="uiTags">
      <div className="uiTags__list">
        {normalized.map((t) => (
          <button key={t} type="button" className="uiTags__tag" onClick={() => onChange(normalized.filter((x) => x !== t))}>
            {t} <span className="uiTags__x">×</span>
          </button>
        ))}
      </div>
      <input
        className="input"
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return
          e.preventDefault()
          const next = text.trim()
          if (!next) return
          onChange(Array.from(new Set([...normalized, next])))
          setText('')
        }}
      />
    </div>
  )
}

