/**
 * PropertyPanel - Renderiza qualquer tipo de campo AUTOMATICAMENTE
 * Suporta: number, text, color, select, textarea
 */

import React, { useState, useEffect } from 'react';
import './PropertyPanel.css';

export function PropertyPanel({ groupKey, groupSchema, element, onChange }) {
  const [localValues, setLocalValues] = useState({});
  const [errors, setErrors] = useState({});

  // Sincronizar com element
  useEffect(() => {
    if (!element) return;
    const values = {};
    Object.keys(groupSchema).forEach(key => {
      if (key !== 'label') {
        values[key] = element[key];
      }
    });
    setLocalValues(values);
  }, [element, groupSchema]);

  const handleChange = (propKey, value) => {
    // Validar
    const schema = groupSchema[propKey];
    let error = null;

    if (schema.type === 'number') {
      const num = parseFloat(value);
      if (isNaN(num)) {
        error = 'Número inválido';
      } else if (schema.min !== undefined && num < schema.min) {
        error = `Mínimo: ${schema.min}`;
      } else if (schema.max !== undefined && num > schema.max) {
        error = `Máximo: ${schema.max}`;
      }
    }

    // Atualizar localmente
    setLocalValues(prev => ({ ...prev, [propKey]: value }));
    setErrors(prev => ({ ...prev, [propKey]: error }));

    // Propagar se válido
    if (!error) {
      onChange(propKey, value);
    }
  };

  if (!element) {
    return (
      <div className="property-panel-empty">
        Nenhum elemento selecionado
      </div>
    );
  }

  return (
    <div className="property-panel-group">
      <div className="property-panel-group-header">
        {groupSchema.label || groupKey}
      </div>
      <div className="property-panel-group-body">
        {Object.entries(groupSchema).map(([propKey, propSchema]) => {
          if (propKey === 'label') return null;

          const value = localValues[propKey] ?? '';
          const error = errors[propKey];

          return (
            <div key={propKey} className="property-field">
              <label className="property-field-label">
                {propSchema.label || propKey}
              </label>

              {/* NUMBER */}
              {propSchema.type === 'number' && (
                <input
                  type="number"
                  className={`property-field-input ${error ? 'error' : ''}`}
                  value={value}
                  onChange={(e) => handleChange(propKey, e.target.value)}
                  step={propSchema.step || 0.1}
                  min={propSchema.min}
                  max={propSchema.max}
                />
              )}

              {/* TEXT */}
              {propSchema.type === 'text' && (
                <input
                  type="text"
                  className="property-field-input"
                  value={value}
                  onChange={(e) => handleChange(propKey, e.target.value)}
                  placeholder={propSchema.placeholder}
                />
              )}

              {/* COLOR */}
              {propSchema.type === 'color' && (
                <div className="property-field-color">
                  <input
                    type="color"
                    className="property-field-color-picker"
                    value={value || '#000000'}
                    onChange={(e) => handleChange(propKey, e.target.value)}
                  />
                  <input
                    type="text"
                    className="property-field-color-text"
                    value={value || ''}
                    onChange={(e) => handleChange(propKey, e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              )}

              {/* SELECT */}
              {propSchema.type === 'select' && propSchema.options && (
                <select
                  className="property-field-select"
                  value={value}
                  onChange={(e) => handleChange(propKey, e.target.value)}
                >
                  {propSchema.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {/* TEXTAREA */}
              {propSchema.type === 'textarea' && (
                <textarea
                  className="property-field-textarea"
                  value={value}
                  onChange={(e) => handleChange(propKey, e.target.value)}
                  rows={propSchema.rows || 3}
                />
              )}

              {error && (
                <div className="property-field-error">{error}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
