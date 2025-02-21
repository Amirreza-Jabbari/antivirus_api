import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getScanResult } from "../api";

const ScanResults = ({ taskId }) => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskId) return;

    let isMounted = true;
    let retryTimeout = null;

    const fetchResults = async () => {
      try {
        console.log("Fetching results for taskId:", taskId);
        const data = await getScanResult(taskId);
        console.log("API scan result:", data);

        if (!isMounted) return;

        if (data.status === "Processing" || data.status === "Waiting") {
          retryTimeout = setTimeout(fetchResults, 3000);
        } else {
          setScanResult(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching scan results:", err);
        if (isMounted) {
          setError("Failed to fetch scan results.");
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [taskId]);

  if (!taskId) return <p className="text-gray-500">Waiting for scan to start...</p>;
  if (loading) return <p className="text-blue-500">Scanning... Please wait.</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!scanResult) return <p className="text-gray-500">No scan results available.</p>;

  const { status, report = {} } = scanResult;
  const { detail = "No details available.", matched_rules = [] } = report;

  let bgColor = "bg-gray-200";
  if (status === "malicious") bgColor = "bg-red-200";
  else if (status === "clean") bgColor = "bg-green-200";
  else if (status === "error") bgColor = "bg-yellow-200";

  return (
    <div className={`p-6 mt-4 rounded-md shadow-md ${bgColor}`}>
      <h2 className="text-lg font-bold">
        {status === "malicious" ? "⚠️ Threat Detected!" : status === "clean" ? "✅ File is Safe" : "❗ Scan Error"}
      </h2>
      <p className="text-sm">{detail}</p>
      {matched_rules.length > 0 && (
        <div className="mt-2">
          <h3 className="text-md font-semibold">Matched Rules:</h3>
          <ul className="list-disc ml-5 text-sm">
            {matched_rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

ScanResults.propTypes = {
  taskId: PropTypes.string,
};

export default ScanResults;
