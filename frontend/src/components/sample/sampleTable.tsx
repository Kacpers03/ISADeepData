import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "../../styles/files/reports.module.css";

interface SampleTableProps {
  filters: any;
  setFilteredItems?: (items: any[]) => void;
}

const SampleTable: React.FC<SampleTableProps> = ({ filters, setFilteredItems }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch("http://localhost:5062/api/sample/list");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("Sample data response:", data);
        setTableData(data);
      } catch (error) {
        console.error("Error fetching samples:", error);
      }
    };

    fetchSamples();
  }, []);

  const filteredData = useMemo(() => {
    const filtered = tableData.filter((item) => {
      const matchSampleType =
        filters?.sampleType === "all" || item.sampleType?.toLowerCase() === filters.sampleType?.toLowerCase();

      const matchMatrixType =
        filters?.matrixType === "all" || item.matrixType?.toLowerCase() === filters.matrixType?.toLowerCase();

      const matchHabitatType =
        filters?.habitatType === "all" || item.habitatType?.toLowerCase() === filters.habitatType?.toLowerCase();

      const matchSearch =
        !filters?.searchQuery ||
        item.sampleCode?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchSampleType && matchMatrixType && matchHabitatType && matchSearch;
    });

    if (setFilteredItems) {
      setFilteredItems(filtered);
    }

    return filtered;
  }, [filters, tableData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "sampleCode",
        header: "Sample Code",
      },
      {
        accessorKey: "sampleType",
        header: "Sample Type",
      },
      {
        accessorKey: "matrixType",
        header: "Matrix Type",
      },
      {
        accessorKey: "habitatType",
        header: "Habitat Type",
      },
      {
        accessorKey: "collectionDate",
        header: "Collection Date",
        cell: (info) => {
          const date = info.getValue();
          return date ? new Date(date).toLocaleDateString() : "-";
        },
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    []
  );

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination, sorting },
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
                {headerGroup.headers.map((column) => (
                  <th key={column.id} onClick={column.column.getToggleSortingHandler()}>
                    {flexRender(column.column.columnDef.header, column.getContext())}
                    {column.column.getIsSorted()
                      ? column.column.getIsSorted() === "desc"
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

        {/* Pagination Controls */}
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
