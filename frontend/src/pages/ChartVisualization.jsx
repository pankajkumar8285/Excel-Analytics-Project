import React, { useState, useRef } from "react";
import Chart2DRenderer from "../components/Chart2DRenderer.jsx";
import Chart3DRenderer from "../components/Chart3DRenderer.jsx";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";

const ChartVisualization = ({ metadata, data }) => {
  const [chartType, setChartType] = useState("Bar Chart (2D)");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [zAxis, setZAxis] = useState("");
  const [size, setSize] = useState(5);
  const [cameraView, setCameraView] = useState("default")
  
  ;
  const chartRef = useRef(null);

  const is3DChart = chartType.includes("(3D)");

  const chartOptions = [
    "Bar Chart (2D)",
    "Line Chart",
    "Pie Chart",
    "Scatter Plot (3D)",
    "Surface Plot (3D)",
    "Mesh Plot (3D)",
    "Volume Plot (3D)",
    "Cone Plot (3D)",
  ];

  const handleExportPNG = async () => {
    if (!chartRef.current) return;
    domtoimage.toPng(chartRef.current).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = dataUrl;
      link.click();
    });
  };

  const handleExportPDF = async () => {
    if (!chartRef.current) return;
    const dataUrl = await domtoimage.toPng(chartRef.current);
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.addImage(dataUrl, "PNG", 40, 40, 700, 400);
    pdf.save("chart.pdf");
  };

  const handleReset = () => {
    setXAxis("");
    setYAxis("");
    setZAxis("");
    setSize(5);
    setCameraView("default");
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        📈 Data Visualization
      </h3>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full border border-gray-200">
        <h4 className="text-lg font-semibold text-cyan-700 mb-4">
          Chart Configuration
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              X Axis
            </label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 cursor-pointer"
            >
              <option value="">Select X Axis</option>
              {metadata.columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Y Axis
            </label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 cursor-pointer"
            >
              <option value="">Select Y Axis</option>
              {metadata.columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 cursor-pointer"
            >
              {chartOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Selected: <span className="font-medium text-blue-700">{chartType}</span>
            </p>
          </div>
        </div>

        {is3DChart && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Z Axis
              </label>
              <select
                value={zAxis}
                onChange={(e) => setZAxis(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Z Axis</option>
                {metadata.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Camera View
              </label>
              <select
                value={cameraView}
                onChange={(e) => setCameraView(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="default">Default</option>
                <option value="top">Top View</option>
                <option value="side">Side View</option>
                <option value="front">Front View</option>
              </select>
            </div>
          </div>
        )}

   
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <button
            title="Download PNG"
            className="bg-blue-600 text-white px-2 py-2 text-xs rounded cursor-pointer"
            onClick={handleExportPNG}
          >
            📥 PNG Download
          </button>
          <button
            title="Download PDF"
            className="bg-red-500 text-white px-2 py-2 text-xs rounded cursor-pointer"
            onClick={handleExportPDF}
          >
            📄 PDF Download
          </button>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 font-medium">📏 Size</label>
            <input
              type="range"
              min={1}
              max={20}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-24 h-2 cursor-pointer"
            />
          </div>
          <button
            onClick={handleReset}
            className="bg-gray-300 text-gray-800 px-2 py-1 text-xs rounded cursor-pointer"
            title="Reset configuration"
          >
            🔄 Reset
          </button>
        </div>

        {/* Chart Display */}
         <div className="text-center overflow-x-auto">
        <div
          id="chart-box"
          ref={chartRef}
          className="border border-dashed border-gray-300 rounded-xl p-4 mx-auto min-w-[300px]"
          style={{
            minWidth: "300px",
            maxWidth: "100%",
            width: `${size * 30 + 300}px`,
            height: `${size * 30 + 300}px`,
            overflow: "auto",
          }}
        >
          {is3DChart ? (
            <Chart3DRenderer
              xAxis={xAxis}
              yAxis={yAxis}
              zAxis={zAxis}
              chartType={chartType}
              data={data}
              size={size}
              view={cameraView}

            />
          ) : (
            <Chart2DRenderer
              xAxis={xAxis}
              yAxis={yAxis}
              chartType={chartType}
              data={data}
              size={size}
            />
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default ChartVisualization;
