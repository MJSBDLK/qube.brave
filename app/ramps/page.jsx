// app/qube.brave/ramps/page.jsx
'use client'
import './ramps.css'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import GradientCanvas from './components/GradientCanvas'
import CurvePreview from './components/CurvePreview'
import { useColorSampling } from './hooks/useColorSampling'
import { parseHexColors } from './utils/colorUtils'
import { 
  debounce, 
  showNotification, 
  copyToClipboard,
  resizeImageIfNeeded,
  PerformanceIndicator 
} from './utils/performanceUtils'

const testingMode = true

// Main Component
const GradientColorSampler = () => {
	// #region State Management
	const [showColorPicker, setShowColorPicker] = useState(false)
	const [hexInput, setHexInput] = useState('')
	const [colorsArray, setSelectedColors] = useState([])
	const [samplingRange, setSamplingRange] = useState({ start: 0, end: 100 })
	const [samplingFunction, setSamplingFunction] = useState('linear')
	const [powerValue, setPowerValue] = useState(2.0)
	const [showPowerSlider, setShowPowerSlider] = useState(false)
	const [showChangelogCollapsed, setShowChangelogCollapsed] = useState(true)
	const [processing, setProcessing] = useState(false)
	const [sampleCount, setSampleCount] = useState(11)
	const [gradientImage, setGradientImage] = useState(null)
	
	// Use the color sampling hook
	const {
		generatedColors,
		samplePositions,
		isProcessing: samplingProcessing,
		luminanceMode,
		setCanvasRef,
		debouncedGenerateSwatch,
		throttledGenerateSwatch,
		reverseColors,
		clearSwatch,
		updateLuminanceMode,
		exportAsPNG,
		exportAsGPL,
		hasColors,
		colorCount
	} = useColorSampling()
	// #endregion /State Management

	// Handle PNG upload with performance optimization
	const handleImageUpload = useCallback((file) => {
		setProcessing(true)
		showNotification('Loading image...')
		
		const img = new Image()
		img.onload = () => {
			// Resize large images for better performance
			const optimizedImg = resizeImageIfNeeded(img)
			setGradientImage(optimizedImg)
			setProcessing(false)
			showNotification('Image loaded successfully!')
		}
		img.onerror = () => {
			setProcessing(false)
			showNotification('Failed to load image', 'error')
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
				showNotification('GPL import not yet implemented', 'error')
			} catch (error) {
				console.error('Failed to parse GPL file:', error)
				showNotification('Failed to parse GPL file', 'error')
			}
		}
		reader.readAsText(file)
	}, [])

	// Handle hex input colors with debouncing
	const handleHexInputChange = useCallback((value) => {
		setHexInput(value)
		const colors = parseHexColors(value)
		setSelectedColors(colors)

		// Debounce gradient creation for better performance
		debounce('hex-gradient', () => {
			if (validateColors(colors)) {
				createCanvasGradient(colors)
			}
		}, 300)
	}, [])
	
	const validateColors = (colorsArray) => {
		if (!colorsArray || colorsArray.length < 2 || colorsArray.length > 8) {
			return false
		}

		return colorsArray.every(
			(color) =>
				typeof color === 'string' &&
				color.startsWith('#') &&
				(/^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color))
		)
	}

	const createCanvasGradient = useCallback((colors) => {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		const width = 800
		const height = 100

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
	}, [])

	const handleFunctionChange = useCallback((value) => {
		setSamplingFunction(value)
		setShowPowerSlider(
			value === 'customExponent' || value === 'customParametric'
		)
		
		// Trigger swatch regeneration if we have an image
		if (gradientImage) {
			debouncedGenerateSwatch({
				startRange: samplingRange.start,
				endRange: samplingRange.end,
				samplingFunction: value,
				powerValue: powerValue,
				sampleCount
			})
		}
	}, [gradientImage, samplingRange, powerValue, sampleCount, debouncedGenerateSwatch])

	// Handle range changes with throttling for smooth updates
	const handleRangeChange = useCallback((field, value) => {
		setSamplingRange(prev => {
			const newRange = { ...prev, [field]: parseFloat(value) }
			
			// Validate range order
			if (field === 'start' && newRange.start > newRange.end) {
				newRange.end = newRange.start
			} else if (field === 'end' && newRange.end < newRange.start) {
				newRange.start = newRange.end
			}
			
			// Trigger swatch regeneration if we have an image
			if (gradientImage) {
				throttledGenerateSwatch({
					startRange: newRange.start,
					endRange: newRange.end,
					samplingFunction,
					powerValue,
					sampleCount
				})
			}
			
			return newRange
		})
	}, [gradientImage, samplingFunction, powerValue, sampleCount, throttledGenerateSwatch])

	// Handle power value changes
	const handlePowerChange = useCallback((value) => {
		setPowerValue(value)
		
		if (gradientImage) {
			debouncedGenerateSwatch({
				startRange: samplingRange.start,
				endRange: samplingRange.end,
				samplingFunction,
				powerValue: value,
				sampleCount
			})
		}
	}, [gradientImage, samplingRange, samplingFunction, sampleCount, debouncedGenerateSwatch])

	// Handle canvas ready callback
	const handleCanvasReady = useCallback((canvas, ctx) => {
		setCanvasRef(canvas, ctx)
		
		// Generate initial swatch
		debouncedGenerateSwatch({
			startRange: samplingRange.start,
			endRange: samplingRange.end,
			samplingFunction,
			powerValue,
			sampleCount
		})
	}, [setCanvasRef, samplingRange, samplingFunction, powerValue, sampleCount, debouncedGenerateSwatch])

	// Copy color to clipboard
	const handleColorClick = useCallback((color) => {
		copyToClipboard(color.hex, `${color.hex} copied!`)
	}, [])

	return (
		<div className='gradient-sampler'>
			{/* Performance Indicator */}
			<PerformanceIndicator 
				isProcessing={processing || samplingProcessing} 
				message={processing ? 'Loading image...' : 'Generating swatch...'}
			/>

			{/* Header */}
			<h1 className='app-title'>🎨 Gradient Color Sampler v7</h1>

			<div className='main-grid'>
				{/* Testing Controls - Left Column (3/12) */}
				{testingMode && (
					<div className='testing-controls-section'>
						<h3>Testing Controls</h3>
						<div className='testing-content'>
							<div className='test-info'>
								<p>Quick test gradients:</p>
								<button 
									className='mini-test-btn'
									onClick={() => {
										const testColors = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff']
										handleHexInputChange(testColors.join(', '))
									}}
								>
									RGB
								</button>
								<button 
									className='mini-test-btn'
									onClick={() => handleHexInputChange('#000000, #ffffff')}
								>
									B&W
								</button>
								<button 
									className='mini-test-btn'
									onClick={() => handleHexInputChange('#ff6b6b, #4ecdc4, #45b7d1')}
								>
									Sunset
								</button>
								<button 
									className='mini-test-btn'
									onClick={() => handleHexInputChange('#667eea, #764ba2')}
								>
									Purple
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Main Sampler - Right Column (6/12 or 9/12 if no testing) */}
				<div className={`gradient-sampler ${testingMode ? 'with-testing' : 'full-width'}`}>
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
								onChange={(e) => updateLuminanceMode(e.target.value)}
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
						onCanvasReady={handleCanvasReady}
						samplingRange={samplingRange}
						samplePositions={samplePositions}
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
										onChange={(e) => handleRangeChange('start', e.target.value)}
									/>
									<input
										type='number'
										min='0'
										max='100'
										step='0.1'
										value={samplingRange.start}
										onChange={(e) => handleRangeChange('start', e.target.value)}
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
										onChange={(e) => handleRangeChange('end', e.target.value)}
									/>
									<input
										type='number'
										min='0'
										max='100'
										step='0.1'
										value={samplingRange.end}
										onChange={(e) => handleRangeChange('end', e.target.value)}
									/>
									<span>%</span>
								</div>
							</div>
						</div>

						<div className='control-group'>
							<label>Sample Count: {sampleCount} colors</label>
							<input
								type='range'
								min='8'
								max='16'
								step='1'
								value={sampleCount}
								onChange={(e) => {
									const newCount = parseInt(e.target.value)
									setSampleCount(newCount)
									
									// Trigger swatch regeneration if we have an image
									if (gradientImage) {
										debouncedGenerateSwatch({
											startRange: samplingRange.start,
											endRange: samplingRange.end,
											samplingFunction,
											powerValue,
											sampleCount: newCount
										})
									}
								}}
								className='sample-count-slider'
							/>
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
										onChange={(e) => handlePowerChange(parseFloat(e.target.value))}
									/>
								</div>
							)}

							{/* Curve Preview */}
							<div className='curve-preview-wrapper'>
								<label>Function Curve</label>
								<CurvePreview 
									samplingFunction={samplingFunction}
									powerValue={powerValue}
									sampleCount={sampleCount}
									width={200}
									height={60}
								/>
							</div>
						</div>
					</div>
				)}

				{/* Color Swatch Display */}
				{hasColors && (
					<div className='output-section'>
						<div className='section-header'>
							<h2>Generated Swatch ({colorCount} colors)</h2>
							<div className='swatch-actions'>
								<button
									className='control-icon-btn'
									onClick={reverseColors}
									title='Reverse Colors'
								>
									🔄
								</button>
								<button
									className='control-icon-btn'
									onClick={clearSwatch}
									title='Clear Swatch'
								>
									🗑️
								</button>
							</div>
						</div>

						<div className='swatch-container'>
							{generatedColors.map((color, index) => (
								<div
									key={index}
									className='color-tile'
									style={{ backgroundColor: color.hex }}
									onClick={() => handleColorClick(color)}
									title={`${color.hex} (Click to copy)`}
								>
									<span className='color-index'>{index}</span>
									<span className='color-code'>{color.hex}</span>
								</div>
							))}
						</div>

						<div className='export-section'>
							<h3>Export Options</h3>
							<div className='export-buttons'>
								<button 
									className='export-button'
									onClick={() => exportAsGPL('gradient-swatch')}
								>
									Download .gpl
								</button>
								<button 
									className='export-button png-export'
									onClick={() => exportAsPNG('gradient-swatch')}
								>
									Download .png
								</button>
								<button 
									className='export-button'
									onClick={() => {
										const gplContent = generatedColors.map(c => c.hex).join(', ')
										copyToClipboard(gplContent, 'Colors copied to clipboard!')
									}}
								>
									Copy Colors
								</button>
							</div>
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
									<li>Complete React/NextJS port with performance optimizations</li>
									<li>Built-in debouncing and throttling for smooth interactions</li>
									<li>Modular component architecture with custom hooks</li>
									<li>Real-time color sampling with visual feedback</li>
									<li>Export functionality (GPL, PNG, clipboard)</li>
									<li>Responsive design optimized for various screen sizes</li>
									<li>Performance monitoring and optimization utilities</li>
								</ul>
							</div>
						</div>
					)}
				</div>
				</div> {/* Close gradient-sampler */}

				{/* Saved Ramps - Right Column (3/12) */}
				{testingMode && (
					<div className='saved-ramps-section'>
						<h3>Saved Ramps</h3>
						<div className='saved-ramps-content'>
							{/* Placeholder for saved ramps functionality */}
							<p style={{ color: '#888', fontSize: '13px', fontStyle: 'italic' }}>
								Saved gradients will appear here
							</p>
						</div>
					</div>
				)}
			</div> {/* Close main-grid */}
		</div>
	)
}

export default GradientColorSampler

