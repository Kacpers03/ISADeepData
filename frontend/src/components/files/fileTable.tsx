import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "../../styles/reports.module.css";
import { useRouter } from "next/router";

const FileTable = ({ filters, setFilteredItems }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5062/api/library/list");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        console.log("Library files response:", data);
        setTableData(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const filteredData = useMemo(() => {
    const filtered = tableData.filter((item) => {
      const matchCountry =
        filters.country === "all" || item.country?.toLowerCase() === filters.country.toLowerCase();

      const matchContractor =
        filters.contractor === "all" || item.contractor?.toLowerCase() === filters.contractor.toLowerCase();

      const matchYear =
        filters.year === "all" || item.year?.toString() === filters.year;

      const matchTheme =
        filters.theme === "all" || item.theme?.toLowerCase() === filters.theme.toLowerCase();

      const matchSearch =
        !filters.searchQuery ||
        item.fileName?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());

      return matchCountry && matchContractor && matchYear && matchTheme && matchSearch;
    });

    if (setFilteredItems) {
      setFilteredItems(filtered);
    }

    return filtered;
  }, [filters, tableData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "fileName",
        header: "File-name",
        cell: (info) => {
          const fileUrl = info.getValue();
          const fileName = fileUrl?.split("/").pop();
          return (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className={styles.fileLink}
            >
              {fileName}
            </a>
          );
        },
      },
      {
        accessorKey: "contractor",
        header: "Contractor",
        cell: (info) => <span>{info.getValue() || "Unknown"}</span>,
      },      
      {
        accessorKey: "country",
        header: "Country",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "theme",
        header: "Theme",
      },
      {
        id: "info",
        header: "Description",
        cell: ({ row }) => (
          <div className={styles.infoIcon}>
            ⓘ
            <span className={styles.tooltip}>{row.original.description}</span>
          </div>
        ),
      },
      {
        id: "moreInfo",
        header: "",
        cell: ({ row }) => {
          const router = useRouter();
          const handleClick = () => {
            router.push({
              pathname: "/library/moreinfo",
              query: { data: JSON.stringify(row.original) },
            });
          };

          return (
            <button
              onClick={handleClick}
              className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-2 py-1 rounded"
            >
              More Info
            </button>
          );
        },
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
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FileTable;
