import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { FaClock, FaDownload, FaFileAlt } from "react-icons/fa";

const History = () => {
  const { backendUrl } = useContext(AppContext);
  const [historyFiles, setHistoryFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/v1/file/history`);
        setHistoryFiles(res.data.files);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [backendUrl]);

  return (
    <div className="flex">
      
      <main className="flex-1 min-h-screen bg-slate-100 pt-4 pb-10 px-4 sm:px-6 md:px-10 md:ml-64">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6">
          Upload History
        </h1>

        {loading ? (
          <div className="text-gray-500 text-lg">Loading...</div>
        ) : historyFiles.length === 0 ? (
          <div className="text-center text-gray-500">
            <FaClock className="text-4xl mx-auto mb-2 opacity-50" />
            <p className="text-md">No uploads yet</p>
          </div>
        ) : (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow max-h-[600px] overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {historyFiles.map((file) => (
                <li
                  key={file._id}
                  className="py-4 flex flex-col sm:flex-row sm:justify-between gap-4 items-start sm:items-center"
                >
                  <div className="flex gap-4 w-full">
                    <FaFileAlt className="text-blue-500 mt-1 shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-800 break-all">
                        {file.filename}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Uploaded: {new Date(file.createdAt).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">
                        {file.totalRows} rows, {file.totalColumns} columns •
                        Quality: {file.dataQualityScore}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href={`${backendUrl}/api/v1/file/download/${file._id}`}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-2 sm:mt-0"
                    >
                      <FaDownload /> Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
