// app/qube.brave/ramps/page.jsx
'use client'

import React, { useState } from 'react'

const GradientColorSampler = () => {
	const [processing, setProcessing] = useState(false)
	const [showOutput, setShowOutput] = useState(false)
	const [showPreview, setShowPreview] = useState(false)
	const [savedRampsCollapsed, setSavedRampsCollapsed] = useState(false)
	const [showColorPicker, setShowColorPicker] = useState(false)
	const [showChangelogCollapsed, setShowChangelogCollapsed] = useState(true)
	const [showCompareCollapsed, setShowCompareCollapsed] = useState(true)

	return (
		<div className='min-h-screen'>
			{/* Performance Indicator */}
			<div
				className={`performance-indicator ${
					processing ? `u-visible` : `u-invisible`
				}`}
				id='perfIndicator'
			>
				Processing...
			</div>

			<div className='container'>
				{/* Title */}
				<h1>🎨 Gradient Color Sampler v7</h1>

				{/* Upload Section */}
				<div className='upload-section' id='uploadSection'>
					<div className='file-input-wrapper'>
						<div id='gradientInputWrapper'>
							<label htmlFor='gradientInput' className='file-input-button'>
								Choose Gradient Image
							</label>
							<input type='file' id='gradientInput' accept='image/*' />
							<p className='info-text'>
								Or drag and drop an image here (large images will be
								automatically resized for performance)
							</p>
						</div>

						<div
							id='gplImportWrapper'
							style={{
								margin: '10px 0',
								padding: '10px 0',
								borderTop: '1px solid #444',
							}}
						>
							<p
								style={{
									marginBottom: '5px',
									color: '#b0b0b0',
									fontSize: '14px',
									fontWeight: '600',
								}}
							>
								OR IMPORT SAVED RAMPS
							</p>
							<div
								style={{
									display: 'flex',
									gap: '10px',
									alignItems: 'center',
									flexWrap: 'wrap',
								}}
							>
								<div className='file-input-wrapper'>
									<label
										htmlFor='gplInput'
										className='file-input-button'
										style={{ background: '#28a745' }}
									>
										Import .gpl File
									</label>
									<input type='file' id='gplInput' accept='.gpl,.txt' />
								</div>
							</div>
							<p
								className='info-text'
								style={{ marginTop: '2.5px', fontSize: '12px' }}
							>
								Import a .gpl palette file with multiple ramps.
								<span style={{ color: '#ff6b6b', fontWeight: '600' }}>
									Warning: This will replace all current saved ramps!
								</span>
							</p>
						</div>
					</div>

					{/* Custom Gradient */}
					<div
						style={{
							margin: '5px 0',
							padding: '10px 0',
							borderTop: '1px solid #444',
						}}
					>
						<p
							style={{
								marginBottom: '5px',
								color: '#b0b0b0',
								fontSize: '14px',
								fontWeight: '600',
							}}
						>
							OR CREATE A GRADIENT FROM COLORS
						</p>

						<div
							style={{
								display: 'flex',
								gap: '10px',
								alignItems: 'center',
								flexWrap: 'wrap',
								marginBottom: '10px',
							}}
						>
							<input
								type='text'
								id='hexInput'
								placeholder='#ff0000, #00ff00, #0000ff'
								style={{
									flex: '1',
									minWidth: '200px',
									padding: '5px',
									background: '#1a1a1a',
									color: '#e0e0e0',
									border: '1px solid #444',
									borderRadius: '6px',
								}}
							/>
							<button
								className='picker-btn'
								onClick={() => setShowColorPicker(!showColorPicker)}
							>
								🎨 Visual Picker
							</button>
							<button className='picker-btn'>Clear All</button>
							<div
								style={{ display: 'flex', gap: '5px', alignItems: 'center' }}
							>
								<label style={{ fontSize: '12px', color: '#888' }}>
									Luminance:
								</label>
								<select
									id='luminanceModeSelector'
									style={{
										padding: '4px',
										background: '#1a1a1a',
										color: '#e0e0e0',
										border: '1px solid #444',
										borderRadius: '4px',
										fontSize: '12px',
									}}
								>
									<option value='ciel'>CIE L*</option>
									<option value='hsv'>HSV</option>
								</select>
							</div>
						</div>

						{/* Visual Color Picker */}
						{showColorPicker && (
							<div
								className='color-picker-container'
								style={{ display: 'block' }}
							>
								<div className='hsv-picker'>
									<div className='hue-slider-container'>
										<div className='hue-slider' id='hueSlider'>
											<div
												className='picker-handle'
												id='hueHandle'
												style={{ left: '50%', top: '0%' }}
											></div>
										</div>
									</div>

									<div className='luminance-slider-container'>
										<div className='luminance-slider' id='luminanceSlider'>
											<div
												className='picker-handle'
												id='luminanceHandle'
												style={{ left: '50%', top: '50%' }}
											></div>
										</div>
									</div>

									<div className='sv-picker' id='svPicker'>
										<div
											className='picker-handle'
											id='svHandle'
											style={{ left: '100%', top: '0%' }}
										></div>
									</div>

									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '10px',
										}}
									>
										<div
											className='color-preview-large'
											id='colorPreviewLarge'
										></div>

										<div className='color-input-row'>
											<input
												type='text'
												id='currentHexValue'
												style={{
													width: '80px',
													padding: '4px',
													background: '#2a2a2a',
													color: '#e0e0e0',
													border: '1px solid #444',
													borderRadius: '4px',
													textAlign: 'center',
												}}
												placeholder='#ffffff'
											/>
										</div>

										<div
											className='color-values-display'
											id='colorValuesDisplay'
										>
											<div>
												HSV: <span id='hsvDisplay'>0°, 100%, 100%</span>
											</div>
											<div>
												L*: <span id='luminanceDisplay'>50</span>
											</div>
										</div>

										<div className='color-actions'>
											<button className='picker-btn add'>Add Color</button>
										</div>
									</div>
								</div>

								<div className='selected-colors-list' id='selectedColorsList'>
									<div
										style={{
											color: '#888',
											fontSize: '12px',
											alignSelf: 'center',
										}}
									>
										Selected colors will appear here...
									</div>
								</div>
							</div>
						)}

						<p
							className='info-text'
							style={{ marginTop: '2.5px', fontSize: '12px' }}
						>
							Type hex colors OR use the visual picker above • 2-8 colors
							supported
						</p>
					</div>

					{/* Gradient Preview */}
					{showPreview && (
						<div className='gradient-preview' id='previewContainer'>
							<canvas id='gradientCanvas'></canvas>
							<div className='range-overlay' id='leftOverlay'></div>
							<div className='range-overlay' id='rightOverlay'></div>
							<div id='samplePointsContainer'></div>
						</div>
					)}
				</div>

				{/* Controls Section */}
				<div className='controls'>
					<div className='control-group'>
						<label>Sampling Range</label>
						<div className='range-container'>
							<div className='range-input-group'>
								<input
									type='range'
									id='startRange'
									min='0'
									max='100'
									defaultValue='0'
									step='0.1'
								/>
								<div
									style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
								>
									<span className='range-value'>Start:</span>
									<input
										type='number'
										id='startText'
										min='0'
										max='100'
										defaultValue='0'
										step='0.1'
										style={{
											width: '80px',
											padding: '4px',
											background: '#1a1a1a',
											color: '#4a9eff',
											border: '1px solid #444',
											borderRadius: '4px',
										}}
									/>
									<span style={{ color: '#4a9eff' }}>%</span>
								</div>
							</div>
							<div className='range-input-group'>
								<input
									type='range'
									id='endRange'
									min='0'
									max='100'
									defaultValue='100'
									step='0.1'
								/>
								<div
									style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
								>
									<span className='range-value'>End:</span>
									<input
										type='number'
										id='endText'
										min='0'
										max='100'
										defaultValue='100'
										step='0.1'
										style={{
											width: '80px',
											padding: '4px',
											background: '#1a1a1a',
											color: '#4a9eff',
											border: '1px solid #444',
											borderRadius: '4px',
										}}
									/>
									<span style={{ color: '#4a9eff' }}>%</span>
								</div>
							</div>
						</div>
					</div>

					<div className='control-group'>
						<label>Sampling Function</label>
						<select className='function-selector' id='functionSelector'>
							<option value='linear'>Linear</option>
							<option value='customExponent'>Custom Power</option>
							<option value='customParametric'>Custom Parametric</option>
						</select>

						<div className='power-slider-group' id='powerSliderGroup'>
							<label style={{ fontSize: '12px' }}>
								Power: <span id='powerValue'>2.0</span>
							</label>
							<input
								type='range'
								id='powerSlider'
								min='0.1'
								max='5'
								defaultValue='2'
								step='0.1'
							/>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									marginTop: '5px',
								}}
							>
								<label style={{ fontSize: '11px', color: '#888' }}>Step:</label>
								<input
									type='number'
									id='stepInput'
									min='0.001'
									max='1'
									defaultValue='0.1'
									step='0.001'
									style={{
										width: '60px',
										padding: '2px 4px',
										background: '#1a1a1a',
										color: '#4a9eff',
										border: '1px solid #444',
										borderRadius: '4px',
										fontSize: '11px',
									}}
								/>
							</div>
						</div>

						<canvas className='curve-preview' id='curvePreview'></canvas>
					</div>
				</div>

				{/* Output Section */}
				{showOutput && (
					<div className='output-section' id='outputSection'>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<h2 style={{ marginBottom: '10px' }}>Current Swatch</h2>
							<button
								className='control-icon-btn'
								id='reverseAllColorsBtn'
								title='Reverse Colors'
							>
								🔄
							</button>
						</div>

						<div className='swatch-container' id='swatchContainer'>
							{/* Color tiles will be generated here */}
						</div>

						{/* Comparison Swatch */}
						<div
							className='swatch-container comparison-swatch'
							id='comparisonSwatchContainer'
							style={{ display: 'none' }}
						></div>

						<div
							className='compare-section'
							id='compareSection'
							style={{ display: 'none' }}
						>
							<div
								className='compare-header'
								onClick={() => setShowCompareCollapsed(!showCompareCollapsed)}
							>
								<span className='compare-title'>
									Compare Against: <span id='comparisonName'>None</span>
								</span>
								<button className='collapse-btn' id='compareCollapseBtn'>
									{showCompareCollapsed ? '↓' : '↑'}
								</button>
							</div>
							<div
								className={`compare-content ${
									showCompareCollapsed ? 'collapsed' : ''
								}`}
								id='compareContent'
							>
								<div className='compare-drop-zone' id='compareDropZone'>
									<p className='drop-hint'>Drag a saved ramp here to compare</p>
									<div
										className='compare-controls'
										id='compareControls'
										style={{ display: 'none' }}
									>
										<button className='compare-control-btn'>
											Clear Comparison
										</button>
										<button
											className='compare-control-btn brightness-toggle'
											id='brightnessToggle'
										>
											Show CIE L*
										</button>
									</div>
								</div>
							</div>
						</div>

						<div className='save-ramp-section'>
							<div className='save-ramp-controls'>
								<input
									type='text'
									id='saveRampName'
									className='save-ramp-name'
									placeholder='Enter ramp name...'
								/>
								<button className='save-ramp-btn' id='saveRampBtn'>
									Save Ramp
								</button>
							</div>
						</div>

						<div className='export-section'>
							<h3 style={{ marginBottom: '7.5px' }}>Export Current</h3>
							<div className='export-buttons'>
								<button className='export-button'>Download .gpl</button>
								<button className='export-button png-export'>
									Download .png
								</button>
								<button className='export-button'>Copy to Clipboard</button>
							</div>
							<div className='code-output' id='codeOutput'></div>
						</div>
					</div>
				)}

				{/* Changelog Panel */}
				<div className='changelog-section'>
					<div
						className='bg-gray-800 rounded-lg border border-gray-600 overflow-hidden'
						style={{
							marginTop: '10px',
							background: '#2a2a2a',
							borderRadius: '8px',
							border: '1px solid #444',
						}}
					>
						<div
							className='panel-header'
							onClick={() => setShowChangelogCollapsed(!showChangelogCollapsed)}
						>
							<span className='panel-title'>Changelog</span>
							<button className='collapse-btn' id='changelogBtn'>
								{showChangelogCollapsed ? '↓' : '↑'}
							</button>
						</div>
						{!showChangelogCollapsed && (
							<div className='panel-content' id='changelogContent'>
								<div className='changelog-entry'>
									<div className='version'>v6.6.2</div>
									<ul>
										<li>
											Fixed brightness toggle - now properly shows/hides on both
											swatches
										</li>
										<li>Fixed comparison swatch brightness overlay display</li>
										<li>Improved brightness overlay toggle logic</li>
										<li>
											editing the hex output value in the hue cube now updates
											the other selectors/previews
										</li>
										<li>one million bug fixes with the color picker</li>
									</ul>
								</div>
								<div className='changelog-entry'>
									<div className='version'>v6.6.1</div>
									<ul>
										<li>Added project-wide luminance algorithm selector</li>
										<li>Fixed color picker gray/black issue</li>
										<li>Fixed SV picker display mismatch</li>
										<li>Fixed brightness overlay toggle functionality</li>
										<li>Brightness overlays now respect selected algorithm</li>
										<li>
											Clarified HSV luminance slider behavior (color→black)
										</li>
									</ul>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Saved Ramps Panel */}
			<div
				className={`saved-ramps-panel ${
					savedRampsCollapsed ? 'collapsed' : ''
				}`}
				id='savedRampsPanel'
			>
				<div
					className='panel-header'
					onClick={() => setSavedRampsCollapsed(!savedRampsCollapsed)}
				>
					<span className='panel-title'>Saved Ramps</span>
					<button className='collapse-btn' id='collapseBtn'>
						{savedRampsCollapsed ? '→' : '←'}
					</button>
				</div>
				<div className='panel-content' id='panelContent'>
					<div className='empty-state' id='emptyState'>
						No saved ramps yet.
						<br />
						Generate and save a ramp to get started!
					</div>
					<div id='savedRampsList'></div>

					{/* Compact control grid */}
					<div
						className='ramp-controls-grid'
						id='rampControlsGrid'
						style={{ display: 'none' }}
					>
						<button
							className='control-icon-btn'
							id='reverseAllColorsBtn'
							title='Reverse All Colors'
							disabled
						>
							🔄
						</button>
						<button
							className='control-icon-btn'
							id='reverseRampOrderBtn'
							title='Reverse Ramp Order'
							disabled
						>
							↕️
						</button>
					</div>

					{/* Export buttons */}
					<button
						className='export-all-btn'
						id='exportAllBtn'
						disabled
						style={{ marginTop: '10px' }}
					>
						Export All (.gpl)
					</button>
					<button
						className='export-all-btn png-export'
						id='exportAllPngBtn'
						disabled
						style={{ marginTop: '2.5px' }}
					>
						Export Combined PNG
					</button>
				</div>
			</div>

			{/* Notification */}
			<div className='notification' id='notification'></div>
		</div>
	)
}

export default GradientColorSampler
