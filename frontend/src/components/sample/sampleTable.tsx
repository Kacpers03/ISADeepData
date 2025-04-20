import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "../../styles/files/reports.module.css";
import CsvExportButton from "./CSVButton"; // adjust path if needed


const SampleTable = ({ filters, visibleColumns }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch("http://localhost:5062/api/sample/list");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error("Error fetching samples:", error);
      }
    };

    fetchSamples();
  }, []);

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchSampleType =
        filters.sampleType === "all" || item.sampleType?.toLowerCase() === filters.sampleType?.toLowerCase();
      const matchMatrixType =
        filters.matrixType === "all" || item.matrixType?.toLowerCase() === filters.matrixType?.toLowerCase();
      const matchHabitatType =
        filters.habitatType === "all" || item.habitatType?.toLowerCase() === filters.habitatType?.toLowerCase();
      const matchAnalysis =
        filters.analysis === "all" || item.analysis?.toLowerCase() === filters.analysis?.toLowerCase();
      const matchSearch =
        !filters.searchQuery ||
        item.sampleCode?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchSampleType && matchMatrixType && matchHabitatType && matchAnalysis && matchSearch;
    });
  }, [filters, tableData]);

  // 👇 Define all possible columns
  const allColumns = {
    sampleCode: {
      accessorKey: "sampleCode",
      header: "Sample Code",
    },
    sampleType: {
      accessorKey: "sampleType",
      header: "Sample Type",
    },
    matrixType: {
      accessorKey: "matrixType",
      header: "Matrix Type",
    },
    habitatType: {
      accessorKey: "habitatType",
      header: "Habitat Type",
    },
    analysis: {
      accessorKey: "analysis",
      header: "Analysis",
    },
    result: {
      accessorKey: "result",
      header: "Result",
      cell: (info) => info.getValue() ?? "-",
    },
    sampleDescription: {
      accessorKey: "sampleDescription",
      header: "Description",
    },
  };

  //  Only include columns the user selected
  const columns = useMemo(() => {
    return Object.keys(allColumns)
      .filter((key) => visibleColumns.includes(key))
      .map((key) => allColumns[key]);
  }, [visibleColumns]);
  

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  const exportColumns = useMemo(() => {
    if (!filteredData.length) return [];
  
    const formatters: Record<string, (val: any) => string> = {
      result: (val) => val ?? "-",
      depthLower: (val) => typeof val === "number" ? val.toFixed(2) : val ?? "-",
      depthUpper: (val) => typeof val === "number" ? val.toFixed(2) : val ?? "-",
    };
  
    return Object.keys(filteredData[0]).map((key) => ({
      label: key, // You could prettify it later (e.g., capitalize words)
      key,
      format: formatters[key],
    }));
  }, [filteredData]);
  
  

  return (
    <div className={styles.fileTableContainer}>
      <CsvExportButton
  data={filteredData}
  columns={exportColumns}
  filename="filtered-files.csv"
  meta={{
    title: "Samples",
    filters: {
      "Sample Type": filters.sampleType,
      "Matrix Type": filters.matrixType,
      "Habitat Type": filters.habitatType,
      "Analysis": filters.analysis,
    }
  }}
/>
      <div className={styles.tableWrapper}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={styles.sortableHeader}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className={styles.sortIndicator}>
                          {header.column.getIsSorted() === "desc" ? " ▼" : " ▲"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles.tableRow}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        <div className={styles.pagination}>
          <div className={styles.paginationControls}>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className={styles.paginationButton}
            >
              {"<<"}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={styles.paginationButton}
            >
              {"<"}
            </button>
            <span className={styles.pageInfo}>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={styles.paginationButton}
            >
              {">"}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className={styles.paginationButton}
            >
              {">>"}
            </button>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className={styles.pageSizeSelect}
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleTable;
