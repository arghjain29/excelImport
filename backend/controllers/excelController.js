const exceljs = require("exceljs");
const Data = require("../models/DataModel.js");
const moment = require("moment");

const requiredColumns = ["Name", "Amount", "Date", "Verified"];

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    await Data.deleteMany({}); // Remove old records

    let errors = [];
    let validData = [];
    let sheets = [];

    workbook.eachSheet((sheet) => {
      let headers = [];
      sheet.getRow(1).eachCell((cell) => headers.push(cell.value));

      if (!requiredColumns.every((col) => headers.includes(col))) {
        errors.push({ sheet: sheet.name, error: "Missing required columns" });
        return; // Continue to the next sheet without returning from the callback
      }

      let sheetData = [];

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip headers

        const verifiedCell = row.getCell(headers.indexOf("Verified") + 1).value;
        const rowData = {
          name: row.getCell(headers.indexOf("Name") + 1).value,
          amount: row.getCell(headers.indexOf("Amount") + 1).value,
          date: row.getCell(headers.indexOf("Date") + 1).value,
          verified: String(verifiedCell).trim().toLowerCase() === "yes",
        };

        if (typeof rowData.date === "string") {
          rowData.date = moment(rowData.date, "DD-MM-YYYY").toDate();
        }

        if (isNaN(rowData.date.getTime())) {
          errors.push({
            sheet: sheet.name,
            row: rowNumber,
            error: `Invalid date format: "${row.getCell(3).value}". Expected DD-MM-YYYY.`,
          });
          return;
        } else if (!rowData.name || !rowData.amount || !rowData.date) {
          errors.push({ sheet: sheet.name, row: rowNumber, error: "Missing required fields" });
          return;
        } else if (isNaN(rowData.amount) || rowData.amount <= 0) {
          errors.push({ sheet: sheet.name, row: rowNumber, error: "Amount must be a positive number" });
          return;
        } else {
          validData.push(rowData);
          sheetData.push(rowData);
        }
      });

      sheets.push({ name: sheet.name, data: sheetData });
    });

      var importedCount = 0;
      for (const row of validData) {
        const existingRecord = await Data.findOne({
          name: row.name,
          amount: row.amount,
          date: row.date,
          verified: row.verified,
        });
  
        if (!existingRecord) {
          await Data.create(row);
          importedCount++;
        }
      }
    

    res.json({
      message: "File processed successfully",
      importedCount,
      errors,
      sheets, // ✅ Send sheets data to frontend
    });
  } catch (err) {
    console.error("File processing error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.importData = async (req, res) => {
  const { data } = req.body;

  if (!data || data.length === 0) {
    return res.status(400).json({ error: "No data to import" });
  }

  try {
    // Step 1: Create a set of unique records from the import data
    let importEntriesSet = new Set();

    data.forEach(sheet => {
      const { data: dataRows } = sheet;

      if (dataRows && dataRows.length > 0) {
        dataRows.forEach(row => {
          const uniqueKey = `${row.name}-${row.amount}-${new Date(row.date).toISOString()}`;
          importEntriesSet.add(uniqueKey);
        });
      }
    });

    // Step 2: Get existing records from the database
    const existingRecords = await Data.find({}, { name: 1, amount: 1, date: 1 });

    // Step 3: Find records in the database that are not in the import data
    const recordsToDelete = existingRecords.filter(record => {
      const uniqueKey = `${record.name}-${record.amount}-${record.date.toISOString()}`;
      return !importEntriesSet.has(uniqueKey); // Keep only those that are not in the import data
    });

    // Step 4: Delete records that are not in the import data
    if (recordsToDelete.length > 0) {
      await Data.deleteMany({
        _id: { $in: recordsToDelete.map(record => record._id) },
      });
    }

    res.status(200).json({ message: "Data updated successfully!" });
  } catch (error) {
    console.error("Import Error:", error);
    res.status(500).json({ error: "Failed to update data" });
  }
};
