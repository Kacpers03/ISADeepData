// CsvExportButton.tsx
import React from "react";
import { convertToCSV, downloadCSV } from "../../utils/csvExportTable";

interface CsvExportButtonProps {
  data: any[];
  columns?: ExportColumn[];
  filename?: string;
  meta?: CSVMeta;
}

const CsvExportButton: React.FC<CsvExportButtonProps> = ({ data, columns, filename = "export.csv", meta }) => {
  const handleExport = () => {
    const csv = convertToCSV(data, columns, meta);
    downloadCSV(csv, filename);
  };

  return (
    <button onClick={handleExport} className="csvbutton">
      Export CSV
    </button>
  );
};

export default CsvExportButton;
