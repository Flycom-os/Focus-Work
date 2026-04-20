type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export function ToggleSwitch({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      className={checked ? 'uiToggle uiToggle--on' : 'uiToggle'}
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
    >
      <span className="uiToggle__thumb" />
      {label ? <span className="uiToggle__label">{label}</span> : null}
    </button>
  )
}

