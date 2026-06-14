import { Cursor } from '@tldraw/tldraw'

export function CustomCursor({ cursor }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      <Cursor cursor={cursor} />
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 4px',
        borderRadius: '4px',
      }}>
        {cursor.name}
      </div>
    </div>
  )
}
