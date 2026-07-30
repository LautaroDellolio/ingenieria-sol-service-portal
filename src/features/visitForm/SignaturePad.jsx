import { useEffect, useRef } from 'react'

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 150

export default function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef(null)
  const hasDrawnRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    if (value) {
      const image = new Image()
      image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height)
      image.src = value
    }
  }, [value])

  function getPoint(event) {
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    }
  }

  function handlePointerDown(event) {
    event.preventDefault()
    drawingRef.current = true
    hasDrawnRef.current = true
    lastPointRef.current = getPoint(event)
    canvasRef.current.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event) {
    if (!drawingRef.current) return
    const context = canvasRef.current.getContext('2d')
    const point = getPoint(event)
    context.strokeStyle = '#0b1c30'
    context.lineWidth = 2
    context.lineCap = 'round'
    context.beginPath()
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y)
    context.lineTo(point.x, point.y)
    context.stroke()
    lastPointRef.current = point
  }

  function handlePointerUp() {
    if (!drawingRef.current) return
    drawingRef.current = false
    if (hasDrawnRef.current) onChange(canvasRef.current.toDataURL('image/png'))
  }

  function handleClear() {
    hasDrawnRef.current = false
    onChange(null)
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: 'none' }}
        className="w-full h-[15rem] border-2 border-dashed border-outline-variant rounded bg-white cursor-crosshair"
      />
      <button
        type="button"
        onClick={handleClear}
        className="mt-xs font-label-sm text-label-sm text-on-surface-variant underline"
      >
        Limpiar firma
      </button>
    </div>
  )
}
