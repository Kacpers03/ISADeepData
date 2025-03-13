import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "../../styles/reports.module.css"; // CSS Module
import { Row } from "react-bootstrap";

const FileTable = ({ filters }) => {
  const [tableData, setTableData] = useState([]);

  // Fetch data from .NET API using fetch
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5062/api/library/list");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTableData(data);
      } catch (error) {
        console.error("Failed to fetch files:", error);
      }
    };

    fetchFiles();
  }, []);

  // Apply filters
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      return (
        (filters.country === "All" || filters.country.includes(item.country)) &&
        (filters.contractor === "All" || filters.contractor.includes(item.contractor)) &&
        (filters.year === "All" || filters.year.includes(item.year)) &&
        (filters.theme === "All" || filters.theme.includes(item.theme))
      );
    });
  }, [filters, tableData]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "fileName",
        header: "File-name",
        cell: (info) => {
          const fileUrl = `https://isalibraryfiles.blob.core.windows.net/files/${info.getValue()}`;
          return (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download // 👈 this triggers download instead of opening in browser
              className={styles.fileLink}
            >
              {info.getValue()}
            </a>
          );
        },
      },
      { accessorKey: "contractor", header: "Contractor" },
      { accessorKey: "theme", header: "Theme" },
      {
        id: "info",
        header: "Info",
        cell: ({ row }) => (
          <div className={styles.infoIcon}>
            ⓘ
            <span className={styles.tooltip}>{row.original.description} <br /> <br />
            Created in year: {row.original.year}<br />
            Published by: {row.original.contractor}<br />
            Contact-info: {row.original.email}<br />
            File size: {row.original.size}<br />
            Format: {row.original.format} <br />
            </span>
          </div>
        ),
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
      <h1 className={styles.title}>File Management</h1>
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
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
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
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FileTable;
