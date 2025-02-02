import { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";
import DataPreview from "./DataPreview";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format} from "date-fns";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheetsData, setSheetsData] = useState([]);
  const [importDone, setImportDone] = useState(false);
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
        setImportDone(true);
      } else {
        toast.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error importing the data!");
    }
  };

  const handleExport = () => {
    if (sheetsData.length === 0) {
      alert("No data to export!");
      return;
    }
  
    const workbook = XLSX.utils.book_new();
  
    sheetsData.forEach((sheet) => {
      if (sheet.data.length > 0) {
        // Format dates & restructure data
        const formattedData = sheet.data.map((row) => ({
          Name: row.name,
          Amount: row.amount,
          Date: format(new Date(row.date), "dd-MM-yyyy"), // Ensures proper date formatting
          Verified: row.verified ? "Yes" : "No", // Converts boolean to readable text
        }));
  
        // Create worksheet with formatted data
        const worksheet = XLSX.utils.json_to_sheet(formattedData, {
          header: ["Name", "Amount", "Date", "Verified"], // Ensuring correct header order
        });
  
        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name || "Sheet");
      }
    });
  
    // Convert workbook to Excel file & trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
  
    saveAs(blob, "exported_data.xlsx");
  };

  return (
    <div className="flex flex-col items-center justify-center p-7">
      {/* Drag-and-drop area */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-white/30 bg-white/10 backdrop-blur-lg p-6 w-full max-w-md text-center rounded-xl shadow-md transition-all transform hover:scale-102 hover:border-white/50 hover:bg-white/20 cursor-pointer"
      >
        <input {...getInputProps()} />
        <p className="text-white text-lg">
          Drag & drop an .xlsx file here, or click to select a File
        </p>
      </div>

      {/* Fallback button */}
      <div className="mt-4">
        <button
          className="bg-white/10 text-white px-4 py-2 rounded-lg shadow-md border border-white/20 backdrop-blur-lg hover:bg-white/20 transition-all transform hover:scale-105"
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          Select File
        </button>
      </div>

      {/* Display file name */}
      {file && <p className="mt-3 text-white text-lg">{file.name}</p>}

      {/* Upload button */}
      <button
        className={`mt-4 px-6 py-2 rounded-lg shadow-md border border-white/30 backdrop-blur-lg transition-all transform hover:scale-105 ${
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
          importDone={importDone}
          handleExport={handleExport}
        />
      )}
    </div>
  );
};

export default FileUpload;
