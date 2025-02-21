import PropTypes from "prop-types";
import { useState } from "react";
import { scanFile } from "../api";

const FileUpload = ({ onScanComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to scan.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await scanFile(file);
      console.log("Scan initiated:", response);
      if (response && response.task_id) {
        onScanComplete(response.task_id);
      } else {
        setError("No task ID received from API.");
      }
    } catch (err) {
      console.error("Error scanning file:", err);
      setError("Failed to start scan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md text-center">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 w-full border p-2"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {loading ? "Scanning..." : "Scan File"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

FileUpload.propTypes = {
  onScanComplete: PropTypes.func.isRequired,
};

export default FileUpload;
