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
    <button onClick={handleExport} className="csv_button">
      Export CSV
    </button>
  );
};

export default CsvExportButton;
