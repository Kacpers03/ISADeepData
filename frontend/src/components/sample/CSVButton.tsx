// CsvExportButton.tsx
import React from "react";
import { convertToCSV, downloadCSV } from "../../utils/csvExportTable";

interface CsvExportButtonProps {
  data: any[];
  filename?: string;
}

const CsvExportButton: React.FC<CsvExportButtonProps> = ({ data, filename = "export.csv" }) => {
  const handleExport = () => {
    const csv = convertToCSV(data);
    downloadCSV(csv, filename);
  };

  return (
    <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Export CSV
    </button>
  );
};

export default CsvExportButton;
