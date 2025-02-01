import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";
import DataPreview from "./DataPreview";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheetsData, setSheetsData] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".xlsx",
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload!");
      return;
    }
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      toast.error("Invalid file format! Please upload an .xlsx file.");
      return;
    }

    if (file.size === 0) {
      toast.error("File is empty!");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds the 2MB limit!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const loadingToastId = toast.loading("Uploading file...");

    try {
      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.errors && response.data.errors.length > 0) {
        response.data.errors.forEach((error) => {
          if (error.row) {
            toast.error(
              <div>
                <b>Sheet:</b> {error.sheet}
                <br />
                <b>Row:</b> {error.row}
                <br />
                <b>Error:</b> {error.error}
              </div>
            );
          } else {
            toast.error(
              <div>
                <b>Sheet:</b> {error.sheet}
                <br />
                <b>Error:</b> {error.error}
              </div>
            );
          }
        });
      }

      if (response.data.importedCount > 0) {
        setSheetsData(response.data.sheets || []);
        toast.success("File uploaded successfully!");
      }
    } catch (error) {
      toast.error("Error uploading the file!");
      console.error(error);
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  };

  // Handle Row Deletion
  const handleDeleteRow = (sheetIndex, rowIndex) => {
    const updatedSheets = [...sheetsData];
    updatedSheets[sheetIndex].data.splice(rowIndex, 1); // Remove the row
    toast.success("Row deleted successfully!");
    setSheetsData(updatedSheets); // Update state to reflect changes
  };

  const handleImport = async () => {
    if (sheetsData.length === 0) {
      toast.error("No data available to import!");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/import`, {
        data: sheetsData,
      });

      if (response.status === 200) {
        toast.success("Data imported successfully!");
      } else {
        toast.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error importing the data!");
    }
  };

  // return (

  //   <div className="flex flex-col items-center justify-center p-7">
  //     {/* Drag-and-drop area */}
  //     <div
  //       {...getRootProps()}
  //       className="border-2 border-dashed border-gray-500 p-5 w-full max-w-md text-center"
  //     >
  //       <input {...getInputProps()} />
  //       <p>Drag & drop an .xlsx file here, or click to select a file</p>
  //     </div>

  //     {/* Fallback button */}
  //     <div className="mt-3">
  //       <button
  //         className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all duration-300"
  //         onClick={() => document.querySelector('input[type="file"]').click()}
  //       >
  //         Select File
  //       </button>
  //     </div>

  //     {/* Display file name */}
  //     {file && <p className="mt-2 text-lg">{file.name}</p>}

  //     {/* Upload button */}
  //     <button
  //       className="mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all duration-300"
  //       onClick={handleFileUpload}
  //       disabled={loading}
  //     >
  //       {loading ? "Uploading..." : "Upload File"}
  //     </button>

  //     {/* Data Preview Section */}
  //     {sheetsData.length > 0 && (
  //       <DataPreview
  //         sheetsData={sheetsData}
  //         handleDeleteRow={handleDeleteRow}
  //         handleImport={handleImport}
  //       />
  //     )}
  //   </div>
  // );

  return (
    <div className="flex flex-col items-center justify-center p-7">
      {/* Drag-and-drop area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-white/30 bg-white/10 backdrop-blur-lg p-6 w-full max-w-md text-center rounded-xl shadow-md transition-all hover:border-white/50 hover:bg-white/20 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-white text-lg">Drag & drop an .xlsx file here, or click to select a File</p>
      </div>
  
      {/* Fallback button */}
      <div className="mt-4">
        <button
          className="bg-white/10 text-white px-4 py-2 rounded-lg shadow-md border border-white/20 backdrop-blur-lg hover:bg-white/20 transition-all"
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          Select File
        </button>
      </div>
  
      {/* Display file name */}
      {file && <p className="mt-3 text-white text-lg">{file.name}</p>}
  
      {/* Upload button */}
      <button
        className={`mt-4 px-6 py-2 rounded-lg shadow-md border border-white/30 backdrop-blur-lg transition-all ${
          loading
            ? "bg-gray-400 text-gray-300 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
        onClick={handleFileUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>
  
      {/* Data Preview Section */}
      {sheetsData.length > 0 && (
        <DataPreview
          sheetsData={sheetsData}
          handleDeleteRow={handleDeleteRow}
          handleImport={handleImport}
        />
      )}
    </div>
  );
  
};

export default FileUpload;
