// app/ramps/components/FileUpload.jsx
'use client'

import React, { useState, useRef, useCallback } from 'react'

// File Upload Component
const FileUpload = ({ accept, onFileSelect, buttonText, infoText, buttonColor = '#4a9eff' }) => {
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type.match(accept.replace('*', '.*'))) {
      onFileSelect(file)
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }, [onFileSelect])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  return (
    <div 
      className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />
      
      <button
        className="file-input-button"
        style={{ backgroundColor: buttonColor }}
        onClick={() => fileInputRef.current?.click()}
      >
        {buttonText}
      </button>
      
      {infoText && <p className="info-text">{infoText}</p>}
    </div>
  )
}

export default FileUpload
