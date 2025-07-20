import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { motion } from "framer-motion";

const Insight = () => {
  const { backendUrl } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    const fetchRecentFiles = async () => {
      const res = await axios.get(`${backendUrl}/api/v1/file/recent`, {
        withCredentials: true,
      });
      setFiles(res.data?.recentFiles || []);
    };
    fetchRecentFiles();
  }, [backendUrl]);

  const generateInsight = async () => {
    if (!selectedFileId) return;
    const res = await axios.get(
      `${backendUrl}/api/v1/insight/${selectedFileId}`,
      {
        withCredentials: true,
      }
    );
    setInsight(res.data);
  };

  return (
    <div className="pt-20 px-4 sm:px-6 md:px-8 md:ml-64 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">AI Insights</h1>

      {/* File Selector */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <label className="block font-semibold mb-2 text-gray-700">
          Select a file:
        </label>
        <select
          value={selectedFileId || ""}
          onChange={(e) => setSelectedFileId(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">-- Select File --</option>
          {files.map((file) => (
            <option key={file._id} value={file._id}>
              {file.filename} ({new Date(file.createdAt).toLocaleDateString()})
            </option>
          ))}
        </select>

        <button
          onClick={generateInsight}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate Insight
        </button>
      </div>

      {/* Insight Display */}
      {insight && (
        <motion.div
          className="bg-white p-6 rounded shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            File: {insight.file}
          </h2>
          <p className="text-gray-700 mb-4 font-medium">{insight.summary}</p>

          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-sm border rounded overflow-hidden shadow-sm">
              <thead className="bg-blue-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-2 border">Column</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Null Count</th>
                  <th className="px-4 py-2 border">Unique Count</th>
                  <th className="px-4 py-2 border">Sample Values</th>
                </tr>
              </thead>
              <tbody>
                {insight.columnDetails?.map((col, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border font-medium">{col.name}</td>
                    <td className="px-4 py-2 border">{col.type}</td>
                    <td className="px-4 py-2 border">{col.nullCount}</td>
                    <td className="px-4 py-2 border">{col.uniqueCount}</td>
                    <td className="px-4 py-2 border">
                      {col.sampleValues?.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI Suggestions
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              {insight.insights.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Insight;