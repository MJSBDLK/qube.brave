// app/ramps/components/CurvePreview.jsx
'use client'
import React, { useRef, useEffect } from 'react'
import { samplingFunctions } from '../utils/colorUtils'

const CurvePreview = ({ 
  samplingFunction = 'linear', 
  powerValue = 2.0, 
  sampleCount = 11,
  width = 200,
  height = 60
}) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw background
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, width, height)

    // Draw grid lines
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])
    
    // Vertical grid lines
    for (let i = 1; i < 4; i++) {
      const x = (i / 4) * width
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    
    // Horizontal grid lines
    for (let i = 1; i < 3; i++) {
      const y = (i / 3) * height
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    ctx.setLineDash([]) // Reset dash

    // Draw axes
    ctx.strokeStyle = '#444'
    ctx.lineWidth = 2
    ctx.beginPath()
    // Bottom edge (x-axis)
    ctx.moveTo(0, height)
    ctx.lineTo(width, height)
    // Left edge (y-axis)
    ctx.moveTo(0, 0)
    ctx.lineTo(0, height)
    ctx.stroke()

    // Get sampling function
    const func = samplingFunctions[samplingFunction]

    // Draw curve
    ctx.strokeStyle = '#4a9eff'
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let x = 0; x <= width; x += 1) {
      const t = x / width
      let mappedT
      
      if (samplingFunction === 'linear') {
        mappedT = func(t)
      } else {
        mappedT = func(t, powerValue)
      }
      
      const y = (1 - mappedT) * height
      
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Draw sample points
    ctx.fillStyle = '#ff6b6b'
    for (let i = 0; i < sampleCount; i++) {
      const t = sampleCount === 1 ? 0 : i / (sampleCount - 1)
      let mappedT
      
      if (samplingFunction === 'linear') {
        mappedT = func(t)
      } else {
        mappedT = func(t, powerValue)
      }
      
      const x = t * width
      const y = (1 - mappedT) * height

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw labels
    ctx.fillStyle = '#888'
    ctx.font = '10px monospace'
    ctx.textAlign = 'left'
    ctx.fillText('0', 2, height - 2)
    ctx.fillText('1', width - 10, height - 2)
    ctx.save()
    ctx.translate(2, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('0', 0, 0)
    ctx.restore()
    ctx.save()
    ctx.translate(2, 10)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('1', 0, 0)
    ctx.restore()

  }, [samplingFunction, powerValue, sampleCount, width, height])

  return (
    <div className="curve-preview-container">
      <canvas 
        ref={canvasRef} 
        className="curve-preview-canvas"
        style={{ 
          background: '#1a1a1a',
          borderRadius: '6px',
          border: '1px solid #333'
        }}
      />
      <div className="curve-info">
        <span className="curve-label">{samplingFunction}</span>
        {powerValue !== 2.0 && samplingFunction !== 'linear' && (
          <span className="power-label">α={powerValue.toFixed(1)}</span>
        )}
      </div>
    </div>
  )
}

export default CurvePreview
