/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import * as XLSX from "xlsx";

function ExcelUpload({ onFileUpload }) {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet contains the data
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      // Convert sheet to JSON data
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      onFileUpload(jsonData); // Pass the data to the parent component
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg w-72 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-indigo-600">
        Upload Excel File
      </h3>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {fileName && <p className="text-gray-600">Uploaded File: {fileName}</p>}
    </div>
  );
}

export default ExcelUpload;
