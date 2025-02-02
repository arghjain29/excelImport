/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";

const formatNumber = (num) => num.toLocaleString("en-IN");

const DataPreview = ({
  sheetsData,
  handleDeleteRow,
  handleImport,
  importDone,
  handleExport,
}) => {
  const [selectedSheet, setSelectedSheet] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const rowsPerPage = 8;

  // Update the selected sheet when new data comes in
  useEffect(() => {
    if (sheetsData.length > 0) {
      setSelectedSheet(sheetsData[0].name);
    }
  }, [sheetsData]);

  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const handleDelete = (sheetIndex, rowIndex) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      // Call handleDeleteRow passed from FileUpload
      handleDeleteRow(sheetIndex, rowIndex);
    }
  };

  const currentSheetData =
    sheetsData.find((sheet) => sheet.name === selectedSheet)?.data || [];
  const paginatedData = currentSheetData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  return (
    <div className="mt-5">
      {/* Dropdown for selecting sheets */}
      {sheetsData.length > 0 ? (
        <select
          className="mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-lg text-white shadow-md transition-all w-full sm:w-auto"
          value={selectedSheet}
          onChange={(e) => {
            setSelectedSheet(e.target.value);
            setCurrentPage(0); // Reset pagination on sheet change
          }}
        >
          {sheetsData.map((sheet, index) => (
            <option
              key={index}
              value={sheet.name}
              className="bg-white/10 backdrop-blur-lg text-black hover:bg-white/20"
            >
              {sheet.name}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-red-500">No sheets available.</p>
      )}

      {/* Table Display */}
      <div className="overflow-x-auto w-full">
        <table className="w-full sm:w-[70%] table-auto border-collapse border border-gray-400 shadow-lg rounded-lg mx-auto">
          <thead>
            <tr className="bg-white/10 backdrop-blur-lg text-left">
              <th className="border px-4 py-2 font-semibold min-w-[150px]">
                Name
              </th>
              <th className="border px-4 py-2 font-semibold min-w-[100px]">
                Amount
              </th>
              <th className="border px-4 py-2 font-semibold min-w-[150px]">
                Date
              </th>
              <th className="border px-4 py-2 font-semibold min-w-[100px]">
                Verified
              </th>
              <th className="border px-4 py-2 font-semibold min-w-[150px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-white/10 backdrop-blur-lg"
                >
                  <td className="border px-4 py-2">{row.name}</td>
                  <td className="border px-4 py-2">
                    {formatNumber(row.amount)}
                  </td>
                  <td className="border px-4 py-2">
                    {format(new Date(row.date), "dd-MM-yyyy")}
                  </td>
                  <td className="border px-4 py-2">
                    {row.verified ? "Yes" : "No"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition-all duration-200 transform hover:scale-105"
                      onClick={() => handleDelete(0, rowIndex)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-3">
                  No data available for this sheet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {currentSheetData.length > rowsPerPage && (
        <div className="mt-5 flex justify-center w-full">
          <ReactPaginate
            pageCount={Math.ceil(currentSheetData.length / rowsPerPage)}
            onPageChange={handlePageChange}
            containerClassName="pagination flex items-center space-x-2"
            activeClassName="text-white text-xl font-semibold"
            previousLabel={
              <span className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 px-4 py-2 rounded-lg cursor-pointer">
                {"< Prev"}
              </span>
            }
            nextLabel={
              <span className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 px-4 py-2 rounded-lg cursor-pointer">
                {"Next >"}
              </span>
            }
            breakLabel={<span className="px-2 py-1">...</span>}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageLinkClassName="flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer border border-white/20 text-white hover:bg-white/10 backdrop-blur-lg block select-none"
            previousClassName="cursor-pointer select-none"
            nextClassName="cursor-pointer select-none"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          className="bg-green-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
          onClick={handleImport}
        >
          📥 Import Data
        </button>

        {/* Export Button (Only visible after import) */}
        {importDone && (
          <button
            className="bg-purple-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
            onClick={handleExport}
          >
            📤 Export to Excel
          </button>
        )}
      </div>
    </div>
  );
};

export default DataPreview;
