import "./StackedPanels.css";
import { useState } from "react";
import { Layers, Settings, Plus } from "lucide-react";
import LayersPanel from "../Panels/LayersPanel.jsx";
import PropertiesPanel from "../Panels/PropertiesPanel.jsx";
import InsertPanel from "../Panels/InsertPanel.jsx";

function StackedPanels() {
  const [activeTab, setActiveTab] = useState("layers"); // layers | properties | insert

  const tabs = [
    { id: "layers", icon: Layers, label: "Camadas" },
    { id: "properties", icon: Settings, label: "Propriedades" },
    { id: "insert", icon: Plus, label: "Inserir" },
  ];

  return (
    <div className="StackedPanels-root">
      {/* Tab Navigation - Icon Only */}
      <div className="StackedPanels-tabs">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={`StackedPanels-tab ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}
            title={label}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="StackedPanels-content">
        {activeTab === "layers" && <LayersPanel />}
        {activeTab === "properties" && <PropertiesPanel />}
        {activeTab === "insert" && <InsertPanel />}
      </div>
    </div>
  );
}

export default StackedPanels;
