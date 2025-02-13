import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "../../styles/reports.module.css"; // Import CSS Module

const FileTable = ({ filters }) => {
  const data = useMemo(
    () => [
        { id: 1, file: "file1.pdf", contractor: "Company X", country: "Denmark", year: "2024", category: "Reports", description: "Economic Report of the Atlantic Ocean in 2023" },
        { id: 2, file: "file2.pdf",   contractor: "Company Y", country: "USA", year: "2023", category: "Contracts", description: "USA's Mineral Contract" },
        { id: 3, file: "file3.pdf",  contractor: "Company Z", country: "Germany", year: "2022", category: "Environmental Data", description: "Deep Sea Ecosystem Study in the Pacific" },
        { id: 4, file: "file4.pdf",   contractor: "Company A", country: "Denmark", year: "2024", category: "Reports", description: "Sustainable Mining Analysis" },
        { id: 5, file: "file5.pdf",  contractor: "Company B", country: "Sweden", year: "2021", category: "Contracts", description: "Seabed Mineral Exploration Agreement" },
        { id: 6, file: "file6.pdf",   contractor: "Company C", country: "France", year: "2023", category: "Environmental Data", description: "Impact Study on Deep Sea Mining" },
        { id: 7, file: "file7.pdf",   contractor: "Company D", country: "Japan", year: "2022", category: "Reports", description: "Economic Viability of Seabed Mining" },
        { id: 8, file: "file8.pdf",   contractor: "Company E", country: "Canada", year: "2024", category: "Contracts", description: "Agreement for Exploration in the Arctic Seabed" },
        { id: 9, file: "file9.pdf",   contractor: "Company F", country: "Norway", year: "2023", category: "Environmental Data", description: "Assessment of Marine Biodiversity" },
        { id: 10, file: "file10.pdf",  contractor: "Company G", country: "Australia", year: "2022", category: "Reports", description: "Annual Deep Sea Mineral Survey" },
        { id: 11, file: "file11.pdf",  contractor: "Company H", country: "UK", year: "2023", category: "Contracts", description: "Mining License for North Atlantic" },
        { id: 12, file: "file12.pdf",   contractor: "Company I", country: "Russia", year: "2021", category: "Reports", description: "Geological Survey of the Arctic Ocean" },
        { id: 13, file: "file13.pdf",   contractor: "Company J", country: "China", year: "2024", category: "Environmental Data", description: "Analysis of Deep Sea Sediments" },
        { id: 14, file: "file14.pdf",  contractor: "Company K", country: "Brazil", year: "2022", category: "Contracts", description: "Agreement on Exclusive Mining Rights" },
        { id: 15, file: "file15.pdf",  contractor: "Company L", country: "South Korea", year: "2023", category: "Reports", description: "Marine Resources and Economic Impact" },
        { id: 16, file: "file16.pdf",  contractor: "Company M", country: "India", year: "2021", category: "Environmental Data", description: "Study on Seabed Pollution" },
        { id: 17, file: "file17.pdf",  contractor: "Company N", country: "Netherlands", year: "2024", category: "Contracts", description: "New International Seabed Mining Permit" },
        { id: 18, file: "file18.pdf",   contractor: "Company O", country: "New Zealand", year: "2022", category: "Reports", description: "Analysis of Pacific Ocean Reserves" },
        { id: 19, file: "file19.pdf",  contractor: "Company P", country: "South Africa", year: "2023", category: "Environmental Data", description: "Evaluation of Coral Reef Damage" },
        { id: 20, file: "file20.pdf", contractor: "Company Q", country: "Mexico", year: "2021", category: "Contracts", description: "Offshore Drilling Agreement in the Gulf" }
      ],
    []
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (filters.country === "All" || filters.country.includes(item.country)) &&
        (filters.contractor === "All" || filters.contractor.includes(item.contractor)) &&
        (filters.year === "All" || filters.year.includes(item.year)) &&
        (filters.category === "All" || filters.category.includes(item.category))
      );
    });
  }, [filters, data]);

  const columns = useMemo(
    () => [
      { accessorKey: "file", header: "File", cell: (info) => <a href={`/downloads/${info.getValue()}`} download className={styles.fileLink}>{info.getValue()}</a> },
      { accessorKey: "contractor", header: "Contractor" },
      { accessorKey: "country", header: "Country" },
      { accessorKey: "year", header: "Year" },
      { accessorKey: "category", header: "Category" },
      {
        id: "info",
        header: "Info",
        cell: ({ row }) => (
          <div className={styles.infoIcon}>
            ⓘ
            <span className={styles.tooltip}>{row.original.description}</span>
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
                    {column.column.getIsSorted() ? (column.column.getIsSorted() === "desc" ? " 🔽" : " 🔼") : ""}
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
        <button onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>{'<<'}</button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button>
        <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>{'>>'}</button>
        <select value={table.getState().pagination.pageSize} onChange={e => { table.setPageSize(Number(e.target.value)) }}>
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>{pageSize}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FileTable;
