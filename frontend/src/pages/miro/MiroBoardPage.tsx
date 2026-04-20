import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../app/providers/AuthProvider'
import { api, type MiroBoard, type MiroNode } from '../../shared/api/api'

type Tool = 'select' | 'sticky' | 'text'

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function useDebouncedCallback(cb: () => void, delayMs: number) {
  const tRef = useRef<number | null>(null)
  return () => {
    if (tRef.current) window.clearTimeout(tRef.current)
    tRef.current = window.setTimeout(cb, delayMs)
  }
}

export function MiroBoardPage() {
  const { boardId } = useParams()
  const { accessToken } = useAuth()

  const [board, setBoard] = useState<MiroBoard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)

  const [tool, setTool] = useState<Tool>('select')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isSpaceDown, setIsSpaceDown] = useState(false)

  // viewport
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // dragging node
  const dragRef = useRef<{
    nodeId: string
    startPointer: { x: number; y: number }
    startPos: { x: number; y: number }
  } | null>(null)

  const stageRef = useRef<HTMLDivElement | null>(null)
  const panRef = useRef<{
    startPointer: { x: number; y: number }
    startPan: { x: number; y: number }
  } | null>(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'miro')
    return () => document.documentElement.removeAttribute('data-theme')
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpaceDown(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpaceDown(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!accessToken || !boardId) return
      setLoading(true)
      setError(null)
      try {
        const b = await api.miro.boards.get(accessToken, boardId)
        if (!cancelled) {
          setBoard(b)
          setDirty(false)
          setLastSavedAt(Date.now())
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Ошибка загрузки доски')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [accessToken, boardId])

  const nodes = board?.nodes ?? []
  const nodesById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  const schedulePersistSelection = useDebouncedCallback(() => {
    // no-op placeholder for future (edges, etc)
  }, 350)

  const toWorld = (clientX: number, clientY: number) => {
    const el = stageRef.current
    if (!el) return { x: 0, y: 0 }
    const r = el.getBoundingClientRect()
    const lx = clientX - r.left
    const ly = clientY - r.top
    return { x: (lx - pan.x) / scale, y: (ly - pan.y) / scale }
  }

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!stageRef.current) return
    e.preventDefault()
    const delta = -e.deltaY
    const next = clamp(scale * (delta > 0 ? 1.08 : 0.92), 0.25, 2.5)

    // zoom to pointer
    const p = toWorld(e.clientX, e.clientY)
    const r = stageRef.current.getBoundingClientRect()
    const lx = e.clientX - r.left
    const ly = e.clientY - r.top
    const nextPan = {
      x: lx - p.x * next,
      y: ly - p.y * next,
    }
    setScale(next)
    setPan(nextPan)
  }

  const createNodeAt = async (worldX: number, worldY: number, type: 'STICKY' | 'TEXT') => {
    if (!accessToken || !boardId) return
    const created = await api.miro.nodes.create(accessToken, boardId, {
      type,
      x: worldX,
      y: worldY,
      w: type === 'TEXT' ? 320 : 240,
      h: type === 'TEXT' ? 120 : 140,
      color: type === 'TEXT' ? '#A78BFA' : '#FBBF24',
      text: type === 'TEXT' ? 'Текст…' : 'Идея…',
    })
    setBoard((prev) => (prev ? { ...prev, nodes: [...prev.nodes, created] } : prev))
    setSelectedId(created.id)
    setDirty(true)
  }

  const onStageDoubleClick: React.MouseEventHandler<HTMLDivElement> = async (e) => {
    if (tool === 'select') return
    const p = toWorld(e.clientX, e.clientY)
    try {
      await createNodeAt(p.x, p.y, tool === 'sticky' ? 'STICKY' : 'TEXT')
      setTool('select')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания ноды')
    }
  }

  const onNodePointerDown = (nodeId: string) => (e: React.PointerEvent) => {
    if (tool !== 'select') return
    const n = nodesById.get(nodeId)
    if (!n) return
    setSelectedId(nodeId)
    dragRef.current = {
      nodeId,
      startPointer: { x: e.clientX, y: e.clientY },
      startPos: { x: n.x, y: n.y },
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onNodePointerMove = (e: React.PointerEvent) => {
    if (panRef.current) {
      const dx = e.clientX - panRef.current.startPointer.x
      const dy = e.clientY - panRef.current.startPointer.y
      setPan({
        x: panRef.current.startPan.x + dx,
        y: panRef.current.startPan.y + dy,
      })
      return
    }

    const d = dragRef.current
    if (!d) return
    const dx = (e.clientX - d.startPointer.x) / scale
    const dy = (e.clientY - d.startPointer.y) / scale
    const nextX = d.startPos.x + dx
    const nextY = d.startPos.y + dy

    setBoard((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === d.nodeId ? { ...n, x: nextX, y: nextY } : n)),
      }
    })
    setDirty(true)
  }

  const persistNode = useDebouncedCallback(async () => {
    const id = selectedId
    if (!accessToken || !id) return
    const n = nodesById.get(id)
    if (!n) return
    try {
      await api.miro.nodes.update(accessToken, id, { x: n.x, y: n.y, w: n.w, h: n.h, text: n.text ?? '', color: n.color ?? undefined })
      setLastSavedAt(Date.now())
      setDirty(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка сохранения ноды')
    }
  }, 350)

  const onNodePointerUp = async () => {
    if (panRef.current) {
      panRef.current = null
      return
    }
    if (!dragRef.current) return
    dragRef.current = null
    persistNode()
  }

  const selected = selectedId ? nodesById.get(selectedId) ?? null : null

  if (loading) {
    return (
      <div className="page">
        <div className="card">Загрузка доски…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="card">
          <div className="card__title">Ошибка</div>
          <div className="alert alert--error" style={{ marginTop: 10 }}>
            {error}
          </div>
          <div style={{ marginTop: 10 }}>
            <Link className="tab tab--active" to="/miro">
              Назад к доскам
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!board) return null

  return (
    <div className="page" style={{ maxWidth: 1400 }}>
      <div className="miroTopBar">
        <div className="miroTopBar__left">
          <Link className="btn btn--ghost" to="/miro">
            ← Доски
          </Link>
          <div className="miroTitle">{board.title}</div>
        </div>
        <div className="miroTopBar__right">
          <div className="miroZoom">{Math.round(scale * 100)}%</div>
          <div className="miroSaveState">
            {saving ? 'Сохраняем…' : dirty ? 'Есть несохранённые изменения' : lastSavedAt ? `Сохранено ${new Date(lastSavedAt).toLocaleTimeString()}` : '—'}
          </div>
          <button
            className={dirty ? 'btn' : 'btn btn--ghost'}
            disabled={!dirty || saving}
            onClick={async () => {
              if (!accessToken || !boardId || !board) return
              setSaving(true)
              setError(null)
              try {
                const synced = await api.miro.boards.sync(accessToken, boardId, {
                  nodes: board.nodes.map((n) => ({
                    id: n.id,
                    type: n.type,
                    x: n.x,
                    y: n.y,
                    w: n.w,
                    h: n.h,
                    rotation: n.rotation,
                    zIndex: n.zIndex,
                    text: n.text ?? '',
                    color: n.color ?? undefined,
                    data: n.data ?? undefined,
                  })),
                })
                setBoard(synced)
                setDirty(false)
                setLastSavedAt(Date.now())
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка сохранения доски')
              } finally {
                setSaving(false)
              }
            }}
          >
            Сохранить
          </button>
          <button className={tool === 'select' ? 'btn' : 'btn btn--ghost'} onClick={() => setTool('select')}>
            Выбор
          </button>
          <button className={tool === 'sticky' ? 'btn' : 'btn btn--ghost'} onClick={() => setTool('sticky')}>
            Sticky
          </button>
          <button className={tool === 'text' ? 'btn' : 'btn btn--ghost'} onClick={() => setTool('text')}>
            Text
          </button>
          {selected ? (
            <button
              className="btn btn--ghost"
              onClick={async () => {
                if (!accessToken) return
                try {
                  await api.miro.nodes.delete(accessToken, selected.id)
                  setBoard((prev) => (prev ? { ...prev, nodes: prev.nodes.filter((n) => n.id !== selected.id) } : prev))
                  setSelectedId(null)
                  setDirty(true)
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Ошибка удаления')
                }
              }}
            >
              Удалить
            </button>
          ) : null}
        </div>
      </div>

      <div className="miroShell">
        <div className="miroStage"
          ref={stageRef}
          onWheel={onWheel}
          onDoubleClick={onStageDoubleClick}
          onPointerMove={onNodePointerMove}
          onPointerUp={onNodePointerUp}
          onContextMenu={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            if (e.target !== stageRef.current) return
            setSelectedId(null)

            const shouldPan = isSpaceDown || e.button === 1 || e.button === 2
            if (!shouldPan) return

            panRef.current = {
              startPointer: { x: e.clientX, y: e.clientY },
              startPan: pan,
            }
            ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
          }}
        >
          <div
            className="miroWorld"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            }}
          >
            <div className="miroGrid" />

            {nodes
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((n) => (
                <MiroNodeView
                  key={n.id}
                  node={n}
                  selected={n.id === selectedId}
                  onPointerDown={onNodePointerDown(n.id)}
                  onTextChange={async (nextText) => {
                    setBoard((prev) => {
                      if (!prev) return prev
                      return {
                        ...prev,
                        nodes: prev.nodes.map((x) => (x.id === n.id ? { ...x, text: nextText } : x)),
                      }
                    })
                    setSelectedId(n.id)
                    setDirty(true)
                    schedulePersistSelection()
                  }}
                  onTextBlur={() => persistNode()}
                />
              ))}
          </div>
        </div>

        <aside className="miroInspector">
          <div className="card" style={{ gridColumn: 'span 12' as any }}>
            <div className="card__title">Инспектор</div>
            {selected ? (
              <div className="muted">
                <div>Тип: {selected.type}</div>
                <div>
                  Позиция: {Math.round(selected.x)}, {Math.round(selected.y)}
                </div>
                <div>
                  Размер: {Math.round(selected.w)}×{Math.round(selected.h)}
                </div>
                <div style={{ marginTop: 10 }} className="muted">
                  Подсказка: выбери инструмент Sticky/Text и сделай двойной клик по доске, чтобы создать элемент.
                </div>
              </div>
            ) : (
              <div className="muted">Выберите ноду на доске.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function MiroNodeView(props: {
  node: MiroNode
  selected: boolean
  onPointerDown: React.PointerEventHandler<HTMLDivElement>
  onTextChange: (v: string) => void
  onTextBlur: () => void
}) {
  const { node, selected, onPointerDown, onTextChange, onTextBlur } = props
  const bg = node.color ?? (node.type === 'TEXT' ? '#A78BFA' : '#FBBF24')

  return (
    <div
      className={selected ? 'miroNode miroNode--selected' : 'miroNode'}
      style={{
        left: node.x,
        top: node.y,
        width: node.w,
        height: node.h,
        transform: `rotate(${node.rotation ?? 0}deg)`,
        zIndex: node.zIndex ?? 0,
        background: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06)), ${bg}`,
      }}
      onPointerDown={onPointerDown}
    >
      <textarea
        className="miroNode__text"
        value={node.text ?? ''}
        onChange={(e) => onTextChange(e.target.value)}
        onBlur={onTextBlur}
      />
    </div>
  )
}

