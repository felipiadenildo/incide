import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { elementRegistry } from '../../libs/elementRegistry';
import { PropertyPanel } from './PropertyPanel';
import './PropertiesPanel.css';

export function PropertiesPanel() {
  const selectedIds = useAppStore((state) => state.selectedElementIds);
  const elements = useAppStore((state) => state.elements);
  const updateElement = useAppStore((state) => state.updateElement);

  // Elemento selecionado
  const selectedElement = elements.find(el => selectedIds.includes(el.id));

  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <div className="properties-header">Properties</div>
        <div className="properties-empty">
          Nenhum elemento selecionado
        </div>
      </div>
    );
  }

  // Descriptor do elemento
  const descriptor = elementRegistry.get(selectedElement.type);
  if (!descriptor?.propertySchema) {
    return (
      <div className="properties-panel">
        <div className="properties-header">Properties</div>
        <div className="properties-empty">
          Sem propriedades editáveis
        </div>
      </div>
    );
  }

  const handleChange = (propKey, value) => {
    updateElement(selectedElement.id, { [propKey]: value });
  };

  return (
    <div className="properties-panel">
      <div className="properties-header">
        Properties - {descriptor.label}
      </div>
      <div className="properties-body">
        {Object.entries(descriptor.propertySchema).map(([groupKey, groupSchema]) => {
          if (groupKey === 'label') return null;
          
          return (
            <PropertyPanel
              key={groupKey}
              groupKey={groupKey}
              groupSchema={groupSchema}
              element={selectedElement}
              onChange={handleChange}
            />
          );
        })}
      </div>
    </div>
  );
}
