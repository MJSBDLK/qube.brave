// app/ramps/components/GradientCanvas.jsx
'use client'
import React, { useRef } from 'react'
// Gradient Canvas Component
const GradientCanvas = ({ image, onCanvasReady }) => {
	const canvasRef = useRef(null)

	React.useEffect(() => {
		if (image && canvasRef.current) {
			const canvas = canvasRef.current
			const ctx = canvas.getContext('2d')

			// Get parent element dimensions for responsive sizing
			const parentElement = canvasRef.current.parentElement
			const displayWidth = parentElement.clientWidth || 800 // fallback to 800
			const displayHeight = Math.min(100, parentElement.clientHeight || 100) // fallback to 100

			canvas.width = displayWidth
			canvas.height = displayHeight

			// If it's a small palette image (like 11x1), sample colors and create gradient
			if (image.width <= 20 || image.height <= 20) {
				// Create temporary canvas to sample the small image
				const tempCanvas = document.createElement('canvas')
				const tempCtx = tempCanvas.getContext('2d')
				tempCanvas.width = image.width
				tempCanvas.height = image.height
				tempCtx.drawImage(image, 0, 0)

				// Sample colors across the width
				const colors = []
				const sampleCount = Math.min(image.width, 11) // Max 11 colors

				for (let i = 0; i < sampleCount; i++) {
					const x = Math.floor((i / (sampleCount - 1)) * (image.width - 1))
					const y = Math.floor(image.height / 2) // Sample from middle row
					const pixel = tempCtx.getImageData(x, y, 1, 1).data
					const hex = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1]
						.toString(16)
						.padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`
					colors.push(hex)
				}

				// Create gradient from sampled colors
				const gradient = ctx.createLinearGradient(0, 0, displayWidth, 0)
				colors.forEach((color, index) => {
					const position = index / (colors.length - 1)
					gradient.addColorStop(position, color)
				})

				ctx.fillStyle = gradient
				ctx.fillRect(0, 0, displayWidth, displayHeight)
			} else {
				// For larger images, draw scaled to fit
				let { width, height } = image
				const aspectRatio = width / height

				// Scale to fit display area while maintaining aspect ratio
				if (width > displayWidth) {
					width = displayWidth
					height = width / aspectRatio
				}

				if (height > displayHeight) {
					height = displayHeight
					width = height * aspectRatio
				}

				// Center the image
				const x = (displayWidth - width) / 2
				const y = (displayHeight - height) / 2

				// Clear canvas
				ctx.fillStyle = '#1a1a1a'
				ctx.fillRect(0, 0, displayWidth, displayHeight)

				// Draw image
				ctx.drawImage(image, x, y, width, height)
			}

			if (onCanvasReady) {
				onCanvasReady(canvas, ctx)
			}
		}
	}, [image, onCanvasReady])

	return (
		<div className='gradient-preview'>
			<canvas ref={canvasRef} className='gradient-canvas' />
		</div>
	)
}

export default GradientCanvas

