import React, { useState } from "react";
import Tree from "react-d3-tree";
import web3ChartJson from "./data/web3-chart.json";
import { useCenteredTree } from "./helpers";
import "./styles.css";

const containerStyles = {
  width: "100vw",
  height: "100vh",
  overflow: "auto"
};

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  isDefinitionVisible,
  toggleDefinitionVisibility
}) => {
  const isExpanded = !nodeDatum.__rd3t.collapsed;
  const nodeBackgroundColor = isExpanded ? "#e0f7fa" : "#f5f5f5";
  const nodeBorderColor = isExpanded ? "#00796b" : "#ccc";
  const circleColor = isExpanded ? "#00796b" : "#757575";

  return (
    <g>
      <circle
        r={20}
        fill={circleColor}
        stroke="#004d40"
        strokeWidth="3"
      ></circle>
      <foreignObject {...foreignObjectProps}>
        <div style={{
          border: `2px solid ${nodeBorderColor}`,
          backgroundColor: nodeBackgroundColor,
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          padding: "15px",
          boxSizing: "border-box",
          transition: "background-color 0.3s ease, border-color 0.3s ease"
        }}>
          <h3 style={{
            textAlign: "center",
            color: "#004d40",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            margin: "0",
            fontSize: "16px"
          }}>
            {nodeDatum.name}
          </h3>
          {nodeDatum.children && (
            <button 
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "10px",
                border: "none",
                backgroundColor: "#00796b",
                color: "#fff",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                transition: "background-color 0.3s ease"
              }}
              onClick={toggleNode}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          )}
          <button 
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              border: "none",
              backgroundColor: "#004d40",
              color: "#fff",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "background-color 0.3s ease"
            }}
            onClick={toggleDefinitionVisibility}
          >
            {isDefinitionVisible ? "Hide Definition" : "See Definition"}
          </button>
          {isDefinitionVisible && nodeDatum.definition && (
            <div style={{
              marginTop: "10px",
              padding: "10px",
              border: `1px solid ${nodeBorderColor}`,
              backgroundColor: "#fafafa",
              borderRadius: "5px",
              maxHeight: "100px",
              overflowY: "auto",
              fontSize: "14px",
              lineHeight: "1.5"
            }}>
              <strong style={{ display: "block", marginBottom: "5px" }}>Definition:</strong>
              <p>{nodeDatum.definition}</p>
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
};

export default function App() {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 300, y: 560 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 0 };

  // State to manage visibility of definition box
  const [visibleDefinitions, setVisibleDefinitions] = useState({});

  const toggleDefinitionVisibility = (nodeId) => {
    setVisibleDefinitions(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  return (
    <div style={containerStyles} ref={containerRef}>
      <Tree
        data={web3ChartJson}
        translate={translate}
        nodeSize={nodeSize}
        pathFunc="step"
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({
            ...rd3tProps,
            foreignObjectProps,
            isDefinitionVisible: visibleDefinitions[rd3tProps.nodeDatum.id] || false,
            toggleDefinitionVisibility: () => toggleDefinitionVisibility(rd3tProps.nodeDatum.id)
          })
        }
        orientation="vertical"
      />
    </div>
  );
}
