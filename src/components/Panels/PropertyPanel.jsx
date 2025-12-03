/**
 * PropertyPanel - Renderiza campos para um grupo de propriedades
 *
 * Usa schema:
 * {
 *   label: 'Posição',
 *   x: { type: 'number', label: 'X', min, max, step, decimals },
 *   y: { ... }
 * }
 */

import React from 'react'
import { useFormattedInput, useProportionalInputWidth } from '../../hooks/ui/useFormattedInput'
import './PropertyPanel.css'

export function PropertyPanel({ groupKey, groupSchema, value, onChange }) {
  const entries = Object.entries(groupSchema).filter(
    ([key]) => key !== 'label'
  )

  return (
    <div className="property-panel">
      <div className="property-panel-title">
        {groupSchema.label || groupKey}
      </div>
      <div className="property-panel-body">
        {entries.map(([propKey, propSchema]) => {
          const propValue = value?.[propKey]
          const widthClass = propSchema.type === 'number'
            ? useProportionalInputWidth(propSchema.min ?? 0, propSchema.max ?? 10)
            : 'w-full'

          return (
            <div key={propKey} className="property-row">
              <label className="property-label">
                {propSchema.label || propKey}
              </label>

              {propSchema.type === 'number' && (
                <input
                  className={`property-input ${widthClass}`}
                  type="number"
                  step={propSchema.step ?? 0.1}
                  min={propSchema.min}
                  max={propSchema.max}
                  value={useFormattedInput(propValue ?? propSchema.default ?? 0, propSchema.decimals ?? 2)}
                  onChange={(e) => {
                    const next = parseFloat(e.target.value)
                    onChange?.(groupKey, propKey, next)
                  }}
                />
              )}

              {propSchema.type === 'color' && (
                <input
                  className="property-input color-input"
                  type="color"
                  value={propValue ?? propSchema.default ?? '#000000'}
                  onChange={(e) => onChange?.(groupKey, propKey, e.target.value)}
                />
              )}

              {propSchema.type === 'text' && (
                <input
                  className="property-input w-full"
                  type="text"
                  placeholder={propSchema.placeholder}
                  value={propValue ?? ''}
                  onChange={(e) => onChange?.(groupKey, propKey, e.target.value)}
                />
              )}

              {propSchema.type === 'textarea' && (
                <textarea
                  className="property-textarea"
                  rows={3}
                  placeholder={propSchema.placeholder}
                  value={propValue ?? ''}
                  onChange={(e) => onChange?.(groupKey, propKey, e.target.value)}
                />
              )}

              {propSchema.type === 'select' && (
                <select
                  className="property-input w-full"
                  value={propValue ?? propSchema.options?.[0]}
                  onChange={(e) => onChange?.(groupKey, propKey, e.target.value)}
                >
                  {propSchema.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PropertyPanel
