// app/qube.brave/ramps/page.jsx
'use client'
import './ramps.css'
import React, { useState, useRef, useCallback } from 'react'
import FileUpload from './components/FileUpload'
import GradientCanvas from './components/GradientCanvas'
// Main Component
const GradientColorSampler = () => {
	// #region State Management
	const [showColorPicker, setShowColorPicker] = useState(false)
	const [luminanceMode, setLuminanceMode] = useState('ciel')
	const [hexInput, setHexInput] = useState('')
	const [colorsArray, setSelectedColors] = useState([])
	const [samplingRange, setSamplingRange] = useState({ start: 0, end: 100 })
	const [samplingFunction, setSamplingFunction] = useState('linear')
	const [powerValue, setPowerValue] = useState(2.0)
	const [showPowerSlider, setShowPowerSlider] = useState(false)
	const [showChangelogCollapsed, setShowChangelogCollapsed] = useState(true)
	const [processing, setProcessing] = useState(false)
	// Sampling state
	const [sampleCount, setSampleCount] = useState(11)
	const [gradientImage, setGradientImage] = useState(null)
	const [generatedColors, setGeneratedColors] = useState([])
	// #endregion /State Management

	// Handle PNG upload
	const handleImageUpload = useCallback((file) => {
		setProcessing(true)
		const img = new Image()
		img.onload = () => {
			setGradientImage(img)
			setProcessing(false)
		}
		img.src = URL.createObjectURL(file)
	}, [])

	// Handle GPL import
	const handleGPLImport = useCallback((file) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const gplContent = e.target.result
				// TODO: Parse GPL file and import ramps
				console.log('GPL content:', gplContent)
			} catch (error) {
				console.error('Failed to parse GPL file:', error)
			}
		}
		reader.readAsText(file)
	}, [])

	// Handle hex input colors
	const parseHexColors = (input) => {
		if (!input) return []

		const parts = input.split(/[,;\s]+/)
		const colors = []

		for (let part of parts) {
			part = part.trim()
			if (!part) continue

			if (!part.startsWith('#')) {
				part = '#' + part
			}

			if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(part)) {
				if (part.length === 4) {
					part = '#' + part[1] + part[1] + part[2] + part[2] + part[3] + part[3]
				}
				colors.push(part)
			}
		}

		return colors
	}

	const handleHexInputChange = (value) => {
		setHexInput(value)
		const colors = parseHexColors(value)
		setSelectedColors(colors)

		if (validateColors(colors)) {
			createCanvasGradient(colors)
		}
	}
	const validateColors = (colorsArray) => {
		// Read the value of selectedColors and return true if these are indeed 2-8 valid colors, false if not
		if (
			!colorsArray ||
			colorsArray.length < 2 ||
			colorsArray.length > 8
		) {
			return false
		}

		// Check if each color is a valid hex color
		return colorsArray.every(
			(color) =>
				typeof color === 'string' &&
				color.startsWith('#') &&
				(/^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color))
		)
	}

	const createCanvasGradient = (colors) => {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		const width = canvas.parentElement?.offsetWidth || 800
		const height = canvas.parentElement?.offsetHeight || 400

		canvas.width = width
		canvas.height = height

		const gradient = ctx.createLinearGradient(0, 0, width, 0)
		colors.forEach((color, index) => {
			const position = index / (colors.length - 1)
			gradient.addColorStop(position, color)
		})

		ctx.fillStyle = gradient
		ctx.fillRect(0, 0, width, height)

		canvas.toBlob((blob) => {
			const url = URL.createObjectURL(blob)
			const img = new Image()
			img.onload = () => {
				setGradientImage(img)
				URL.revokeObjectURL(url)
			}
			img.src = url
		})
	}

	const handleFunctionChange = (value) => {
		setSamplingFunction(value)
		setShowPowerSlider(
			value === 'customExponent' || value === 'customParametric'
		)
	}

	return (
		<div className='gradient-sampler'>
			{/* Performance Indicator */}
			<div
				className={`performance-indicator ${
					processing ? 'u-visible' : 'u-invisible'
				}`}
			>
				Processing...
			</div>

			<div className='main-content'>
				{/* Header */}
				<h1 className='app-title'>🎨 Gradient Color Sampler v7</h1>

				{/* Upload Section */}
				<div className='upload-section'>
					<div className='upload-grid'>
						<div className='upload-item'>
							<label className='upload-label'>PNG Image</label>
							<FileUpload
								accept='image/png'
								onFileSelect={handleImageUpload}
								buttonText='Choose PNG'
								infoText='Gradient to sample'
							/>
						</div>

						<div className='upload-item'>
							<label className='upload-label'>Import Ramps</label>
							<FileUpload
								accept='.gpl'
								onFileSelect={handleGPLImport}
								buttonText='Choose .gpl'
								buttonColor='#28a745'
								infoText='GIMP palette'
							/>
						</div>
					</div>

					<div className='divider'>OR</div>

					<div className='color-input-section'>
						<label className='upload-label'>Create from Colors</label>
						<div className='hex-input-row'>
							<input
								type='text'
								className='hex-input'
								placeholder='#ff0000, #00ff00, #0000ff'
								value={hexInput}
								onChange={(e) => handleHexInputChange(e.target.value)}
							/>
							<button
								className='picker-toggle-btn'
								onClick={() => setShowColorPicker(!showColorPicker)}
							>
								🎨
							</button>
							<select
								className='luminance-selector'
								value={luminanceMode}
								onChange={(e) => setLuminanceMode(e.target.value)}
							>
								<option value='hsv'>HSV</option>
								<option value='ciel'>CIE L*</option>
							</select>
						</div>

						{showColorPicker && (
							<div className='color-picker-panel'>
								<div className='picker-placeholder'>
									Visual color picker (HSV cube, etc.)
								</div>

								<div className='selected-colors'>
									{colorsArray.map((color, index) => (
										<div
											key={index}
											className='color-chip'
											style={{ backgroundColor: color }}
											title={color}
											onClick={() => {
												const newColors = colorsArray.filter(
													(_, i) => i !== index
												)
												setSelectedColors(newColors)
												setHexInput(newColors.join(', '))
											}}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Gradient Display */}
				{gradientImage && (
					<GradientCanvas
						image={gradientImage}
						onCanvasReady={(canvas, ctx) => {
							console.log(
								'Canvas ready for sampling',
								canvas.width,
								canvas.height
							)
						}}
					/>
				)}

				{/* Sampling Controls */}
				{gradientImage && (
					<div className='controls-section'>
						<div className='control-group'>
							<label>Sampling Range</label>
							<div className='range-controls'>
								<div className='range-input'>
									<label>Start:</label>
									<input
										type='range'
										min='0'
										max='100'
										step='0.1'
										value={samplingRange.start}
										onChange={(e) =>
											setSamplingRange((prev) => ({
												...prev,
												start: parseFloat(e.target.value),
											}))
										}
									/>
									<input
										type='number'
										min='0'
										max='100'
										step='0.1'
										value={samplingRange.start}
										onChange={(e) =>
											setSamplingRange((prev) => ({
												...prev,
												start: parseFloat(e.target.value),
											}))
										}
									/>
									<span>%</span>
								</div>

								<div className='range-input'>
									<label>End:</label>
									<input
										type='range'
										min='0'
										max='100'
										step='0.1'
										value={samplingRange.end}
										onChange={(e) =>
											setSamplingRange((prev) => ({
												...prev,
												end: parseFloat(e.target.value),
											}))
										}
									/>
									<input
										type='number'
										min='0'
										max='100'
										step='0.1'
										value={samplingRange.end}
										onChange={(e) =>
											setSamplingRange((prev) => ({
												...prev,
												end: parseFloat(e.target.value),
											}))
										}
									/>
									<span>%</span>
								</div>
							</div>
						</div>

						<div className='control-group'>
							<label>Sampling Function</label>
							<select
								value={samplingFunction}
								onChange={(e) => handleFunctionChange(e.target.value)}
								className='function-selector'
							>
								<option value='linear'>Linear</option>
								<option value='customExponent'>Custom Power</option>
								<option value='customParametric'>Custom Parametric</option>
							</select>

							{showPowerSlider && (
								<div className='power-controls'>
									<label>Power: {powerValue.toFixed(1)}</label>
									<input
										type='range'
										min='0.1'
										max='5'
										step='0.1'
										value={powerValue}
										onChange={(e) => setPowerValue(parseFloat(e.target.value))}
									/>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Changelog */}
				<div className='changelog-section'>
					<div
						className='section-header'
						onClick={() => setShowChangelogCollapsed(!showChangelogCollapsed)}
					>
						<span>Changelog</span>
						<button className='toggle-btn'>
							{showChangelogCollapsed ? '↓' : '↑'}
						</button>
					</div>

					{!showChangelogCollapsed && (
						<div className='changelog-content'>
							<div className='changelog-entry'>
								<div className='version'>v7.0</div>
								<ul>
									<li>Complete React/NextJS port</li>
									<li>Compact UI optimized for 960x960</li>
									<li>Modular component architecture</li>
									<li>Tightened file upload interface</li>
									<li>Smart gradient visualization from palette images</li>
									<li>Consolidated CSS architecture</li>
								</ul>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default GradientColorSampler

