import { useState } from "react";
import FileUpload from "../components/FileUpload";
import ScanResults from "../components/ScanResults";

const Home = () => {
  const [taskId, setTaskId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Upload a File to Scan</h1>
      <FileUpload onScanComplete={setTaskId} />
      {taskId && <ScanResults taskId={taskId} />}
    </div>
  );
};

export default Home;
