// src/pages/AdminLogs.jsx

import { useMemo } from "react";
import useLogs from "../hooks/useLogs";

export default function AdminLogs() {
  const { logs, loading } = useLogs();

  const sortedLogs = useMemo(() => {
    return [...(logs || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [logs]);

  if (loading) {
    return (
      <div className="p-10">
        Loading Logs...
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-semibold text-white">Admin Logs</h2>
        <span className="text-sm text-gray-400">{new Date().toLocaleString()}</span>
      </div>
      {/* Logs container */}
      <div
        className="bg-black text-green-400 p-4 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {sortedLogs.length > 0 ? (
          sortedLogs.map((log) => (
            <div
              key={log._id}
              className="font-mono text-sm border-b border-zinc-800 py-2 text-white"
            >
              {`${new Date(log.createdAt).toISOString()} | ${log.level} | ${log.message} | ${log.meta?.endpoint || ""}`}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">No logs available</div>
        )}
      </div>
    </>
  );
}