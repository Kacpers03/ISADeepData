import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "../../styles/files/reports.module.css";

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

  return (
    <div className={styles.homeWrapper}>
      <h1 className={styles.title}>Sample Management</h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted()
                      ? header.column.getIsSorted() === "desc"
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
            {"<<"}
          </button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            {"<"}
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {">"}
          </button>
          <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
            {">>"}
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SampleTable;
