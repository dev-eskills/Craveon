// src/hooks/useLogs.js

import { useEffect, useState } from "react";
import socket from "../socket";
import logsApi from "../api/logsApi";

export default function useLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();

    socket.on("new-log", handleNewLog);

    return () => {
      socket.off("new-log", handleNewLog);
    };
  }, []);

  const loadLogs = async () => {
    try {
      const data = await logsApi.getLogs();

      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  const handleNewLog = (log) => {
    setLogs((prev) => [...prev, log]);
  };

  return {
    logs,
    loading,
  };
}