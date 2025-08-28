// app/ramps/hooks/useSavedRamps.js
/**
 * React hook for managing saved gradient ramps
 */
import { useState, useEffect, useCallback } from 'react'
import {
  getSavedRamps,
  saveRamp,
  updateRamp,
  deleteRamp,
  generateThumbnail,
  exportSavedRamps,
  importSavedRamps,
  clearAllRamps
} from '../utils/savedRampsUtils'
import { showNotification } from '../utils/performanceUtils'

export function useSavedRamps() {
  const [savedRamps, setSavedRamps] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load saved ramps on mount
  useEffect(() => {
    loadSavedRamps()
  }, [])

  /**
   * Load all saved ramps from storage
   */
  const loadSavedRamps = useCallback(() => {
    setIsLoading(true)
    try {
      const ramps = getSavedRamps()
      setSavedRamps(ramps.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
    } catch (error) {
      console.error('Error loading saved ramps:', error)
      showNotification('Error loading saved ramps', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Save current gradient as a new ramp
   */
  const saveCurrentRamp = useCallback((rampData) => {
    try {
      // Generate thumbnail if colors are provided
      const thumbnail = rampData.colors && rampData.colors.length > 0 
        ? generateThumbnail(rampData.colors)
        : null

      const savedRamp = saveRamp({
        ...rampData,
        thumbnail
      })

      if (savedRamp) {
        setSavedRamps(prev => [savedRamp, ...prev])
        showNotification(`Saved "${savedRamp.name}"`, 'success')
        return savedRamp
      } else {
        showNotification('Failed to save ramp', 'error')
        return null
      }
    } catch (error) {
      console.error('Error saving ramp:', error)
      showNotification('Error saving ramp', 'error')
      return null
    }
  }, [])

  /**
   * Update an existing saved ramp
   */
  const updateSavedRamp = useCallback((rampId, updateData) => {
    try {
      const updatedRamp = updateRamp(rampId, updateData)
      
      if (updatedRamp) {
        setSavedRamps(prev => 
          prev.map(ramp => 
            ramp.id === rampId ? updatedRamp : ramp
          ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        )
        showNotification(`Updated "${updatedRamp.name}"`, 'success')
        return updatedRamp
      } else {
        showNotification('Failed to update ramp', 'error')
        return null
      }
    } catch (error) {
      console.error('Error updating ramp:', error)
      showNotification('Error updating ramp', 'error')
      return null
    }
  }, [])

  /**
   * Delete a saved ramp
   */
  const deleteSavedRamp = useCallback((rampId) => {
    try {
      const rampToDelete = savedRamps.find(ramp => ramp.id === rampId)
      const success = deleteRamp(rampId)
      
      if (success) {
        setSavedRamps(prev => prev.filter(ramp => ramp.id !== rampId))
        showNotification(
          `Deleted "${rampToDelete?.name || 'ramp'}"`, 
          'success'
        )
        return true
      } else {
        showNotification('Failed to delete ramp', 'error')
        return false
      }
    } catch (error) {
      console.error('Error deleting ramp:', error)
      showNotification('Error deleting ramp', 'error')
      return false
    }
  }, [savedRamps])

  /**
   * Duplicate a saved ramp
   */
  const duplicateRamp = useCallback((rampId) => {
    try {
      const originalRamp = savedRamps.find(ramp => ramp.id === rampId)
      if (!originalRamp) return null

      const duplicatedRamp = saveCurrentRamp({
        ...originalRamp,
        name: `${originalRamp.name} (Copy)`,
        sourceType: 'duplicate'
      })

      return duplicatedRamp
    } catch (error) {
      console.error('Error duplicating ramp:', error)
      showNotification('Error duplicating ramp', 'error')
      return null
    }
  }, [savedRamps, saveCurrentRamp])

  /**
   * Export all saved ramps to a file
   */
  const exportRamps = useCallback(() => {
    try {
      exportSavedRamps()
      showNotification('Ramps exported successfully', 'success')
    } catch (error) {
      console.error('Error exporting ramps:', error)
      showNotification('Error exporting ramps', 'error')
    }
  }, [])

  /**
   * Import ramps from a file
   */
  const importRamps = useCallback(async (file) => {
    try {
      setIsLoading(true)
      const importedCount = await importSavedRamps(file)
      await loadSavedRamps() // Reload to show imported ramps
      showNotification(
        `Imported ${importedCount} ramp${importedCount !== 1 ? 's' : ''}`, 
        'success'
      )
      return importedCount
    } catch (error) {
      console.error('Error importing ramps:', error)
      showNotification('Error importing ramps: ' + error.message, 'error')
      return 0
    } finally {
      setIsLoading(false)
    }
  }, [loadSavedRamps])

  /**
   * Clear all saved ramps
   */
  const clearRamps = useCallback(() => {
    try {
      const success = clearAllRamps()
      if (success) {
        setSavedRamps([])
        showNotification('All ramps cleared', 'success')
        return true
      } else {
        showNotification('Failed to clear ramps', 'error')
        return false
      }
    } catch (error) {
      console.error('Error clearing ramps:', error)
      showNotification('Error clearing ramps', 'error')
      return false
    }
  }, [])

  /**
   * Get ramp statistics
   */
  const getRampStats = useCallback(() => {
    const totalRamps = savedRamps.length
    const sourceTypes = savedRamps.reduce((acc, ramp) => {
      acc[ramp.sourceType] = (acc[ramp.sourceType] || 0) + 1
      return acc
    }, {})

    return {
      totalRamps,
      sourceTypes,
      oldestRamp: savedRamps.length > 0 
        ? savedRamps.reduce((oldest, ramp) => 
            new Date(ramp.createdAt) < new Date(oldest.createdAt) ? ramp : oldest
          )
        : null,
      newestRamp: savedRamps.length > 0 
        ? savedRamps.reduce((newest, ramp) => 
            new Date(ramp.createdAt) > new Date(newest.createdAt) ? ramp : newest
          )
        : null
    }
  }, [savedRamps])

  return {
    // State
    savedRamps,
    isLoading,
    
    // Actions
    saveCurrentRamp,
    updateSavedRamp,
    deleteSavedRamp,
    duplicateRamp,
    loadSavedRamps,
    
    // Import/Export
    exportRamps,
    importRamps,
    clearRamps,
    
    // Utilities
    getRampStats
  }
}
