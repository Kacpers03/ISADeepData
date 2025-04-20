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
  const clean = value?.toString().replace(/"/g, '""').replace(/\r?\n|\r/g, ' ');
  return `"${clean}"`;
};

const padForExcel = (value: string, width: number = 10) => {
  return value?.toString().padEnd(width, " ");
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
        const formatted = col.format ? col.format(raw) : raw ?? "";
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
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
