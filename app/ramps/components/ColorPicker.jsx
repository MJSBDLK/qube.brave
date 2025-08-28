// app/ramps/components/ColorPicker.jsx
'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  hsvToRgb, 
  rgbToHsv, 
  rgbToHex, 
  hexToRgb, 
  rgbToLab, 
  labToRgb,
  calculateLuminance,
  isValidHex 
} from '../utils/colorUtils'
import { showNotification, copyToClipboard } from '../utils/performanceUtils'

const ColorPicker = ({ 
  selectedColors = [], 
  onColorsChange,
  luminanceMode = 'ciel',
  onLuminanceModeChange 
}) => {
  // Current color state
  const [currentHue, setCurrentHue] = useState(0)
  const [currentSaturation, setCurrentSaturation] = useState(100)
  const [currentValue, setCurrentValue] = useState(100)
  const [currentLuminance, setCurrentLuminance] = useState(50)
  const [hexInput, setHexInput] = useState('#ff0000')

  // Interaction state
  const [isDraggingHue, setIsDraggingHue] = useState(false)
  const [isDraggingSV, setIsDraggingSV] = useState(false)
  const [isDraggingLuminance, setIsDraggingLuminance] = useState(false)

  // Refs for sliders
  const hueSliderRef = useRef(null)
  const svPickerRef = useRef(null)
  const luminanceSliderRef = useRef(null)

  // Update color when HSV values change
  useEffect(() => {
    const rgb = hsvToRgb(currentHue, currentSaturation, currentValue)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b, luminanceMode)
    
    setCurrentLuminance(luminance)
    setHexInput(hex)
  }, [currentHue, currentSaturation, currentValue, luminanceMode])

  // Update color when luminance changes (for CIE L* mode)
  const updateColorWithLuminance = useCallback((newLuminance) => {
    if (luminanceMode === 'hsv') {
      // In HSV mode, luminance directly controls the V (value) component
      setCurrentValue(newLuminance)
    } else {
      // CIE L* mode - use LAB color space conversion
      const currentRgb = hsvToRgb(currentHue, currentSaturation, currentValue)
      const lab = rgbToLab(currentRgb.r, currentRgb.g, currentRgb.b)
      
      // Update LAB with new luminance
      lab.L = newLuminance
      
      // Convert back to RGB
      const newRgb = labToRgb(lab.L, lab.A, lab.B)
      
      // Convert RGB back to HSV to keep sliders in sync
      const newHsv = rgbToHsv(newRgb.r, newRgb.g, newRgb.b)
      
      setCurrentHue(newHsv.h)
      setCurrentSaturation(newHsv.s)
      setCurrentValue(newHsv.v)
    }
  }, [currentHue, currentSaturation, currentValue, luminanceMode])

  // Mouse event handlers
  const handleMouseDown = useCallback((type, e) => {
    e.preventDefault()
    switch (type) {
      case 'hue':
        setIsDraggingHue(true)
        updateHueFromEvent(e)
        break
      case 'sv':
        setIsDraggingSV(true)
        updateSVFromEvent(e)
        break
      case 'luminance':
        setIsDraggingLuminance(true)
        updateLuminanceFromEvent(e)
        break
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (isDraggingHue) updateHueFromEvent(e)
    if (isDraggingSV) updateSVFromEvent(e)
    if (isDraggingLuminance) updateLuminanceFromEvent(e)
  }, [isDraggingHue, isDraggingSV, isDraggingLuminance])

  const handleMouseUp = useCallback(() => {
    setIsDraggingHue(false)
    setIsDraggingSV(false)
    setIsDraggingLuminance(false)
  }, [])

  // Attach global mouse events
  useEffect(() => {
    if (isDraggingHue || isDraggingSV || isDraggingLuminance) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingHue, isDraggingSV, isDraggingLuminance, handleMouseMove, handleMouseUp])

  // Update functions for each slider
  const updateHueFromEvent = useCallback((e) => {
    if (!hueSliderRef.current) return
    
    const rect = hueSliderRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100))
    setCurrentHue((percentage / 100) * 360)
  }, [])

  const updateSVFromEvent = useCallback((e) => {
    if (!svPickerRef.current) return
    
    const rect = svPickerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const saturation = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const value = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100))
    
    setCurrentSaturation(saturation)
    setCurrentValue(value)
  }, [])

  const updateLuminanceFromEvent = useCallback((e) => {
    if (!luminanceSliderRef.current) return
    
    const rect = luminanceSliderRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const percentage = Math.max(0, Math.min(100, (y / rect.height) * 100))
    const newLuminance = 100 - percentage
    
    setCurrentLuminance(newLuminance)
    updateColorWithLuminance(newLuminance)
  }, [updateColorWithLuminance])

  // Handle hex input changes
  const handleHexInputChange = useCallback((value) => {
    setHexInput(value)
    
    if (isValidHex(value)) {
      const rgb = hexToRgb(value)
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
      const luminance = calculateLuminance(rgb.r, rgb.g, rgb.b, luminanceMode)
      
      setCurrentHue(hsv.h)
      setCurrentSaturation(hsv.s)
      setCurrentValue(hsv.v)
      setCurrentLuminance(luminance)
    }
  }, [luminanceMode])

  // Add current color to selection
  const addCurrentColor = useCallback(() => {
    if (selectedColors.length >= 8) {
      showNotification('Maximum 8 colors allowed!', 'error')
      return
    }

    if (selectedColors.includes(hexInput)) {
      showNotification('Color already added!', 'error')
      return
    }

    const newColors = [...selectedColors, hexInput]
    onColorsChange(newColors)
    showNotification(`Added ${hexInput}!`)
  }, [selectedColors, hexInput, onColorsChange])

  // Remove color from selection
  const removeColor = useCallback((index) => {
    const removedColor = selectedColors[index]
    const newColors = selectedColors.filter((_, i) => i !== index)
    onColorsChange(newColors)
    showNotification(`Removed ${removedColor}`)
  }, [selectedColors, onColorsChange])

  // Clear all colors
  const clearAllColors = useCallback(() => {
    if (selectedColors.length === 0) return
    onColorsChange([])
    showNotification('All colors cleared')
  }, [selectedColors, onColorsChange])

  // Generate luminance slider background
  const getLuminanceSliderBackground = useCallback(() => {
    if (luminanceMode === 'hsv') {
      // HSV mode: gradient from full color (top) to black (bottom)
      const fullRgb = hsvToRgb(currentHue, currentSaturation, 100)
      const fullHex = rgbToHex(fullRgb.r, fullRgb.g, fullRgb.b)
      return `linear-gradient(to bottom, ${fullHex} 0%, #000000 100%)`
    } else {
      // CIE L* mode: show luminance range for current hue at medium saturation
      const baseRgb = hsvToRgb(currentHue, Math.max(50, currentSaturation), 50)
      
      // Calculate high and low luminance colors
      const highLab = rgbToLab(baseRgb.r, baseRgb.g, baseRgb.b)
      const lowLab = { ...highLab }
      
      highLab.L = 95
      lowLab.L = 5
      
      const highRgb = labToRgb(highLab.L, highLab.A, highLab.B)
      const lowRgb = labToRgb(lowLab.L, lowLab.A, lowLab.B)
      
      const highHex = rgbToHex(highRgb.r, highRgb.g, highRgb.b)
      const lowHex = rgbToHex(lowRgb.r, lowRgb.g, lowRgb.b)
      
      return `linear-gradient(to bottom, ${highHex} 0%, ${lowHex} 100%)`
    }
  }, [currentHue, currentSaturation, luminanceMode])

  // Generate SV picker background color
  const getSVPickerBackground = useCallback(() => {
    const hueRgb = hsvToRgb(currentHue, 100, 100)
    return rgbToHex(hueRgb.r, hueRgb.g, hueRgb.b)
  }, [currentHue])

  return (
    <div className="color-picker-container">
      {/* Main Picker Area */}
      <div className="hsv-picker">
        {/* Hue Slider */}
        <div className="hue-slider-container">
          <div 
            className="hue-slider"
            ref={hueSliderRef}
            onMouseDown={(e) => handleMouseDown('hue', e)}
            onClick={updateHueFromEvent}
          >
            <div 
              className="picker-handle"
              style={{ 
                left: '50%', 
                top: `${(currentHue / 360) * 100}%` 
              }}
            />
          </div>
          <label className="slider-label">HUE</label>
        </div>

        {/* Luminance Slider */}
        <div className="luminance-slider-container">
          <div 
            className="luminance-slider"
            ref={luminanceSliderRef}
            style={{ background: getLuminanceSliderBackground() }}
            onMouseDown={(e) => handleMouseDown('luminance', e)}
            onClick={updateLuminanceFromEvent}
          >
            <div 
              className="picker-handle"
              style={{ 
                left: '50%', 
                top: `${100 - currentLuminance}%` 
              }}
            />
          </div>
          <label className="slider-label">
            {luminanceMode === 'hsv' ? 'HSV' : 'L*'}
          </label>
        </div>

        {/* Saturation/Value Picker */}
        <div 
          className="sv-picker"
          ref={svPickerRef}
          style={{ backgroundColor: getSVPickerBackground() }}
          onMouseDown={(e) => handleMouseDown('sv', e)}
          onClick={updateSVFromEvent}
        >
          <div 
            className="picker-handle"
            style={{ 
              left: `${currentSaturation}%`, 
              top: `${100 - currentValue}%` 
            }}
          />
        </div>

        {/* Color Preview and Controls */}
        <div className="color-preview-section">
          <div 
            className="color-preview-large"
            style={{ backgroundColor: hexInput }}
          />

          <div className="color-input-row">
            <input
              type="text"
              className="hex-input-field"
              value={hexInput}
              onChange={(e) => handleHexInputChange(e.target.value)}
              placeholder="#ffffff"
            />
          </div>

          <div className="color-values-display">
            <div>HSV: {Math.round(currentHue)}°, {Math.round(currentSaturation)}%, {Math.round(currentValue)}%</div>
            <div>{luminanceMode === 'hsv' ? 'HSV' : 'L*'}: {Math.round(currentLuminance)}</div>
          </div>

          <div className="color-actions">
            <button 
              className="picker-btn add"
              onClick={addCurrentColor}
              disabled={selectedColors.length >= 8}
            >
              Add Color
            </button>
          </div>

          {/* Luminance Mode Selector */}
          <div className="luminance-mode-selector">
            <label>Luminance:</label>
            <select
              value={luminanceMode}
              onChange={(e) => onLuminanceModeChange(e.target.value)}
            >
              <option value="ciel">CIE L*</option>
              <option value="hsv">HSV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Selected Colors List */}
      <div className="selected-colors-section">
        <div className="selected-colors-header">
          <span>Selected Colors ({selectedColors.length}/8)</span>
          {selectedColors.length > 0 && (
            <button 
              className="clear-all-btn"
              onClick={clearAllColors}
            >
              Clear All
            </button>
          )}
        </div>

        <div className="selected-colors-list">
          {selectedColors.length === 0 ? (
            <div className="empty-state">
              Selected colors will appear here...
            </div>
          ) : (
            <>
              {/* Individual color chips */}
              {selectedColors.map((color, index) => (
                <div
                  key={index}
                  className="selected-color-chip"
                  style={{ backgroundColor: color }}
                  title={color}
                  onClick={() => copyToClipboard(color, `${color} copied!`)}
                >
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeColor(index)
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Gradient preview if more than 1 color */}
              {selectedColors.length > 1 && (
                <div
                  className="gradient-preview-chip"
                  style={{
                    background: `linear-gradient(90deg, ${selectedColors
                      .map((color, index) => {
                        const position = (index / (selectedColors.length - 1)) * 100
                        return `${color} ${position}%`
                      })
                      .join(', ')})`
                  }}
                  title="Gradient preview - click to copy all colors"
                  onClick={() => {
                    copyToClipboard(
                      selectedColors.join(', '), 
                      'All colors copied!'
                    )
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ColorPicker
