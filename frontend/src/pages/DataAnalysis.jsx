import React, { useState } from "react";
import axios from "axios";
import {
  FaFileExcel,
  FaChartBar,
  FaListOl,
  FaColumns,
  FaHashtag,
  FaTags,
} from "react-icons/fa";
import ChartVisualization from "./ChartVisualization";

const DataAnalysis = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (
      selected &&
      (selected.name.endsWith(".xlsx") ||
        selected.name.endsWith(".xls") ||
        selected.name.endsWith(".csv"))
    ) {
      if (selected.size > 10 * 1024 * 1024) {
        alert("File too large. Max 10MB allowed.");
        setFile(null);
        return;
      }
      setFile(selected);
    } else {
      alert("Only Excel or CSV files allowed");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5500/api/v1/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setMetadata(response.data.metadata);
      setPreviewData(response.data.dataPreview);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  const getNumericCount = () => {
    return Object.values(metadata?.columnAnalysis || {}).filter(
      (col) => col.type === "numeric"
    ).length;
  };

  const getCategoricalCount = () => {
    return Object.values(metadata?.columnAnalysis || {}).filter(
      (col) => col.type === "categorical"
    ).length;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen overflow-x-hidden">
      <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen max-w-full overflow-x-hidden">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <FaChartBar className="text-blue-600" />
              Data Analysis
            </h2>

            {metadata && (
              <p className="text-gray-500 text-sm">
                Uploaded File: <strong>{file?.name}</strong> | Rows:{" "}
                {metadata.totalRows} | Columns: {metadata.totalColumns}
              </p>
            )}
          </div>

          {metadata && (
             <div className="text-center overflow-x-auto">
            <div className="flex flex-wrap items-center gap-2 ml-auto">
              
              <input
                type="file"
                onChange={handleFileChange}
                className="border p-2 rounded"
              />
              <button
                onClick={handleUpload}
                className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
              >
                Upload & Analyze
              </button>
            
            </div>
            </div>
          )}
        </div>

        {!metadata && (
          <div className="bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-xl mx-auto animate-fade-in-up">
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
              Upload Excel File
            </h1>
            <p className="text-center text-gray-500 mb-6">
              Upload your Excel file to start analyzing your data
            </p>

            <div className="border-2 border-dashed border-blue-400 rounded-xl p-6 text-center transition hover:bg-blue-50">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <input type="file" hidden onChange={handleFileChange} />
                <FaFileExcel className="text-5xl text-green-600 animate-pulse" />
                <p className="text-gray-600">Click to upload or drag & drop</p>
                <p className="text-sm text-gray-400">
                  Supported: .xlsx, .xls, .csv
                </p>
              </label>
            </div>

            {file && (
              <p className="mt-4 text-green-700 font-medium text-center">
                {file.name}
              </p>
            )}

            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-semibold shadow-lg"
            >
              {loading ? "Uploading..." : "Upload & Analyze"}
            </button>

            <div className="mt-6 text-center text-sm text-gray-500">
              Max file size: 10MB | Supported formats: .xlsx, .xls, .csv
            </div>
          </div>
        )}

        {metadata && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: "Total Rows",
                  icon: <FaListOl className="text-blue-600 text-xl" />,
                  value: metadata.totalRows,
                },
                {
                  label: "Total Columns",
                  icon: <FaColumns className="text-purple-600 text-xl" />,
                  value: metadata.totalColumns,
                },
                {
                  label: "Numeric Columns",
                  icon: <FaHashtag className="text-green-600 text-xl" />,
                  value: getNumericCount(),
                },
                {
                  label: "Categorical Columns",
                  icon: <FaTags className="text-pink-600 text-xl" />,
                  value: getCategoricalCount(),
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 backdrop-blur-md border border-white/30 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.03]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {item.icon}
                    <h4 className="text-sm text-gray-600">{item.label}</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {item.value}
                  </p>
                  <div className="w-full h-1 mt-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 opacity-30 blur-md animate-pulse rounded-full"></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/60 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  📊 Column Analysis
                </h3>
                <ul className="space-y-2 text-gray-800">
                  {Object.entries(metadata.columnAnalysis).map(
                    ([col, data]) => (
                      <li key={col}>
                        <strong>{col}</strong>:{" "}
                        <span
                          className={
                            data.type === "numeric"
                              ? "text-blue-600"
                              : "text-green-600"
                          }
                        >
                          {data.type}
                        </span>{" "}
                        ({data.uniqueCount} unique)
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="bg-white/60 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-md">
                <h3 className="text-lg font-semibold mb-4">✅ Data Quality</h3>
                <div className="text-center overflow-x-auto">
                <ul className="space-y-2 text-gray-800">
                  {Object.entries(metadata.columnAnalysis).map(
                    ([col, data]) => {
                      const completeness = (
                        ((metadata.totalRows - data.nullCount) /
                          metadata.totalRows) *
                        100
                      ).toFixed(1);
                      return (
                        <li
                          key={col}
                          className="flex justify-between items-center"
                        >
                          <span>{col}</span>
                          <span className="text-green-600 font-medium">
                            {completeness}% complete
                          </span>
                        </li>
                      );
                    }
                  )}
                </ul>
                </div>
              </div>
            </div>

            {/* 🔽 Responsive Scrollable Table */}
            <div className="bg-white/60 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-md mb-10">
              <h3 className="text-lg font-semibold mb-4">👁️ Data Preview</h3>

             
              <div className="overflow-x-auto rounded-lg text-center">
                <table className="min-w-max table-auto text-left whitespace-nowrap">
                  <thead className="text-sm text-gray-500 border-b border-gray-300">
                    <tr>
                      {metadata.columns.map((col) => (
                        <th key={col} className="pb-2 pr-4">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-100 transition">
                        {metadata.columns.map((col) => (
                          <td key={col} className="py-2 pr-4">
                            {row[col]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
            
          </>
        )}

        {metadata && (
          <ChartVisualization metadata={metadata} data={previewData} />
        )}
      </main>
    </div>
  );
};

export default DataAnalysis;
