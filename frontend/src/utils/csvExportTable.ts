// frontend/src/utils/csvExportTable.ts

type ExportColumn = {
  label: string;
  key: string;
  format?: (value: any) => string;
};

type CSVMeta = {
  title?: string;
  filters?: Record<string, string>;
};

const escapeCSV = (value: string) => {
  if (value === null || value === undefined) return '""';
  const clean = value.toString().replace(/"/g, '""').replace(/\r?\n|\r/g, ' ');
  return `"${clean}"`;
};

const padForExcel = (value: string, width: number = 10) => {
  return value?.toString().padEnd(width, " ");
};

// Check if a value might be interpreted as a date in Excel
const mightBeDate = (value: string): boolean => {
  // Check for patterns like "1.23", "01.23", "1-23", "01-23" which Excel might convert to dates
  return /^\d{1,2}[.,]\d{1,2}$/.test(value) || /^\d{1,2}[-/]\d{1,2}$/.test(value);
};

// Format value to prevent Excel from interpreting numbers as dates
const formatForExcel = (value: any): string => {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  
  // If it's a decimal number that Excel might interpret as a date
  if (mightBeDate(stringValue)) {
    // Prefix with = and wrap in quotes to force Excel to treat it as text/formula
    return `="=${stringValue}"`;
  }
  
  return stringValue;
};

export const convertToCSV = (
  data: any[],
  columns?: ExportColumn[],
  meta?: CSVMeta
): string => {
  if (!data?.length) return "";

  const delimiter = ";";

  const columnDefs = columns ?? Object.keys(data[0]).map(key => ({
    label: key,
    key,
  }));

  const titleLine = meta?.title ? escapeCSV(meta.title) : null;

  const filterLine = meta?.filters
    ? escapeCSV(
        "Filtered by: " +
          Object.entries(meta.filters)
            .map(([k, v]) => `${k} = ${v}`)
            .join("; ")
      )
    : null;

  const headers = columnDefs.map(col => escapeCSV(col.label));
  const rows = data.map(row =>
    columnDefs
      .map(col => {
        const raw = row[col.key];
        // Use custom formatter if provided, otherwise do default Excel-safe formatting
        const formatted = col.format 
          ? col.format(raw) 
          : formatForExcel(raw);
        return escapeCSV(padForExcel(formatted));
      })
      .join(delimiter)
  );

  const csvParts = [
    ...(titleLine ? [titleLine] : []),
    ...(filterLine ? [filterLine] : []),
    "", // empty line for spacing
    headers.join(delimiter),
    ...rows,
  ];

  return csvParts.join("\n");
};

export const downloadCSV = (csvString: string, filename: string) => {
  // Add UTF-8 BOM for better Excel compatibility with special characters
  const bomPrefix = "\uFEFF";
  const blob = new Blob([bomPrefix + csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};