// app/ramps/components/SavedRamps.jsx
'use client'
import React, { useState } from 'react'

const SavedRamps = ({ 
  savedRamps = [], 
  isLoading = false,
  onLoadRamp,
  onDeleteRamp,
  onDuplicateRamp,
  onUpdateRamp,
  onExportRamps,
  onImportRamps,
  onClearRamps
}) => {
  const [editingRamp, setEditingRamp] = useState(null)
  const [newName, setNewName] = useState('')
  const [showActions, setShowActions] = useState(false)

  const handleStartEdit = (ramp) => {
    setEditingRamp(ramp.id)
    setNewName(ramp.name)
  }

  const handleSaveEdit = () => {
    if (editingRamp && newName.trim()) {
      onUpdateRamp(editingRamp, { name: newName.trim() })
      setEditingRamp(null)
      setNewName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingRamp(null)
    setNewName('')
  }

  const handleImportFile = (event) => {
    const file = event.target.files[0]
    if (file) {
      onImportRamps(file)
      event.target.value = '' // Reset input
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  // Create color squares grid like the original HTML
  const createRampPreview = (ramp) => {
    const colors = ramp.colors || []
    const sampleCount = ramp.sampleCount || 11
    
    // If we have fewer colors than sample count, interpolate
    const displayColors = []
    for (let i = 0; i < sampleCount; i++) {
      if (colors.length === 0) {
        displayColors.push('#333333')
      } else if (i < colors.length) {
        displayColors.push(colors[i])
      } else {
        // Simple repeat last color for now
        displayColors.push(colors[colors.length - 1])
      }
    }

    return (
      <div className="ramp-preview-grid" style={{ gridTemplateColumns: `repeat(${sampleCount}, 1fr)` }}>
        {displayColors.map((color, index) => (
          <div
            key={index}
            className="ramp-color-square"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="saved-ramps-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="saved-ramps-container">
      {/* Header with actions */}
      <div className="saved-ramps-header">
        <div className="ramps-count">
          {savedRamps.length} saved
        </div>
        <button 
          className="actions-toggle"
          onClick={() => setShowActions(!showActions)}
          title="Manage ramps"
        >
          ⚙️
        </button>
      </div>

      {/* Actions panel */}
      {showActions && (
        <div className="actions-panel">
          <div className="action-group">
            <label className="import-btn">
              📁 Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                style={{ display: 'none' }}
              />
            </label>
            
            {savedRamps.length > 0 && (
              <>
                <button 
                  className="export-btn"
                  onClick={onExportRamps}
                >
                  💾 Export
                </button>
                
                <button 
                  className="clear-btn"
                  onClick={() => {
                    if (confirm(`Delete all ${savedRamps.length} saved ramps?`)) {
                      onClearRamps()
                    }
                  }}
                >
                  🗑️ Clear
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Ramps list - tightly packed grid like original */}
      <div className="saved-ramps-list">
        {savedRamps.length === 0 ? (
          <div className="empty-state">
            <p>No saved ramps yet</p>
            <span>Generate and save a ramp!</span>
          </div>
        ) : (
          savedRamps.map(ramp => (
            <div key={ramp.id} className="saved-ramp-item">
              {/* Ramp preview grid */}
              {createRampPreview(ramp)}
              
              {/* Ramp info */}
              <div className="ramp-info">
                {editingRamp === ramp.id ? (
                  <div className="ramp-edit">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="edit-input"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit()
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-edit"
                        onClick={handleSaveEdit}
                      >
                        ✓
                      </button>
                      <button 
                        className="cancel-edit"
                        onClick={handleCancelEdit}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="ramp-name">{ramp.name}</div>
                )}
                
                {/* Action buttons */}
                <div className="ramp-actions">
                  <button 
                    className="ramp-action-btn"
                    onClick={() => onLoadRamp(ramp)}
                    title="Load"
                  >
                    📂
                  </button>
                  <button 
                    className="ramp-action-btn"
                    onClick={() => onDuplicateRamp(ramp.id)}
                    title="Duplicate"
                  >
                    📋
                  </button>
                  <button 
                    className="ramp-action-btn"
                    onClick={() => handleStartEdit(ramp)}
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button 
                    className="ramp-action-btn delete-btn"
                    onClick={() => {
                      if (confirm(`Delete "${ramp.name}"?`)) {
                        onDeleteRamp(ramp.id)
                      }
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SavedRamps
