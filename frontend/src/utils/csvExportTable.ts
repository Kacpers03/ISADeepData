    export const convertToCSV = (data: any[]) => {
    if (!data.length) return "";
  
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(header => `"${row[header] ?? ""}"`).join(",")
    );
    return [headers.join(","), ...rows].join("\n");
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
  