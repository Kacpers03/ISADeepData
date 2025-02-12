import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "../../styles/reports.module.css"; // Import CSS Module

const FileTable = () => {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedContractor, setSelectedContractor] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const data = useMemo(
    () => [
        { id: 1, file: "file1.pdf", name: "Project A", date: "2024-02-10", contractor: "Company X", country: "Denmark", year: "2024", category: "Reports", description: "Economic Report of the Atlantic Ocean in 2023" },
        { id: 2, file: "file2.pdf", name: "Project B", date: "2023-05-15", contractor: "Company Y", country: "USA", year: "2023", category: "Contracts", description: "USA's Mineral Contract" },
        { id: 3, file: "file3.pdf", name: "Project C", date: "2022-08-21", contractor: "Company Z", country: "Germany", year: "2022", category: "Environmental Data", description: "Deep Sea Ecosystem Study in the Pacific" },
        { id: 4, file: "file4.pdf", name: "Project D", date: "2024-01-30", contractor: "Company A", country: "Denmark", year: "2024", category: "Reports", description: "Sustainable Mining Analysis" },
        { id: 5, file: "file5.pdf", name: "Project E", date: "2021-11-12", contractor: "Company B", country: "Sweden", year: "2021", category: "Contracts", description: "Seabed Mineral Exploration Agreement" },
        { id: 6, file: "file6.pdf", name: "Project F", date: "2023-07-22", contractor: "Company C", country: "France", year: "2023", category: "Environmental Data", description: "Impact Study on Deep Sea Mining" },
        { id: 7, file: "file7.pdf", name: "Project G", date: "2022-04-18", contractor: "Company D", country: "Japan", year: "2022", category: "Reports", description: "Economic Viability of Seabed Mining" },
        { id: 8, file: "file8.pdf", name: "Project H", date: "2024-01-05", contractor: "Company E", country: "Canada", year: "2024", category: "Contracts", description: "Agreement for Exploration in the Arctic Seabed" },
        { id: 9, file: "file9.pdf", name: "Project I", date: "2023-09-10", contractor: "Company F", country: "Norway", year: "2023", category: "Environmental Data", description: "Assessment of Marine Biodiversity" },
        { id: 10, file: "file10.pdf", name: "Project J", date: "2022-06-30", contractor: "Company G", country: "Australia", year: "2022", category: "Reports", description: "Annual Deep Sea Mineral Survey" },
        { id: 11, file: "file11.pdf", name: "Project K", date: "2023-11-15", contractor: "Company H", country: "UK", year: "2023", category: "Contracts", description: "Mining License for North Atlantic" },
        { id: 12, file: "file12.pdf", name: "Project L", date: "2021-09-25", contractor: "Company I", country: "Russia", year: "2021", category: "Reports", description: "Geological Survey of the Arctic Ocean" },
        { id: 13, file: "file13.pdf", name: "Project M", date: "2024-03-14", contractor: "Company J", country: "China", year: "2024", category: "Environmental Data", description: "Analysis of Deep Sea Sediments" },
        { id: 14, file: "file14.pdf", name: "Project N", date: "2022-10-22", contractor: "Company K", country: "Brazil", year: "2022", category: "Contracts", description: "Agreement on Exclusive Mining Rights" },
        { id: 15, file: "file15.pdf", name: "Project O", date: "2023-05-30", contractor: "Company L", country: "South Korea", year: "2023", category: "Reports", description: "Marine Resources and Economic Impact" },
        { id: 16, file: "file16.pdf", name: "Project P", date: "2021-12-20", contractor: "Company M", country: "India", year: "2021", category: "Environmental Data", description: "Study on Seabed Pollution" },
        { id: 17, file: "file17.pdf", name: "Project Q", date: "2024-04-05", contractor: "Company N", country: "Netherlands", year: "2024", category: "Contracts", description: "New International Seabed Mining Permit" },
        { id: 18, file: "file18.pdf", name: "Project R", date: "2022-07-18", contractor: "Company O", country: "New Zealand", year: "2022", category: "Reports", description: "Analysis of Pacific Ocean Reserves" },
        { id: 19, file: "file19.pdf", name: "Project S", date: "2023-08-12", contractor: "Company P", country: "South Africa", year: "2023", category: "Environmental Data", description: "Evaluation of Coral Reef Damage" },
        { id: 20, file: "file20.pdf", name: "Project T", date: "2021-06-05", contractor: "Company Q", country: "Mexico", year: "2021", category: "Contracts", description: "Offshore Drilling Agreement in the Gulf" }
      ],
    []
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (selectedCountry === "All" || item.country === selectedCountry) &&
        (selectedContractor === "All" || item.contractor === selectedContractor) &&
        (selectedYear === "All" || item.year === selectedYear) &&
        (selectedCategory === "All" || item.category === selectedCategory)
      );
    });
  }, [selectedCountry, selectedContractor, selectedYear, selectedCategory, data]);

  const columns = useMemo(
    () => [
      { accessorKey: "file", header: "File", cell: (info) => <a href={`/downloads/${info.getValue()}`} download className={styles.fileLink}>{info.getValue()}</a> },
      { accessorKey: "name", header: "Name" },
      { accessorKey: "date", header: "Date Uploaded" },
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
      <div className={styles.filterContainer}>
        <label>Country:</label>
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
          <option value="All">All</option>
          <option value="Denmark">Denmark</option>
          <option value="USA">USA</option>
          <option value="Germany">Germany</option>
          <option value="Sweden">Sweden</option>
        </select>
        
        <label>Contractor:</label>
        <select value={selectedContractor} onChange={(e) => setSelectedContractor(e.target.value)}>
          <option value="All">All</option>
          <option value="Company X">Company X</option>
          <option value="Company Y">Company Y</option>
          <option value="Company Z">Company Z</option>
          <option value="Company A">Company A</option>
        </select>

        <label>Year Published:</label>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="All">All</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>

        <label>Category:</label>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Reports">Reports</option>
          <option value="Contracts">Contracts</option>
          <option value="Environmental Data">Environmental Data</option>
        </select>
      </div>
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
            <button
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            >
            {'<<'}
            </button>
            <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            {'<'}
            </button>
            <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            {'>'}
            </button>
            <button
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            >
            {'>>'}
            </button>
            <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
                table.setPageSize(Number(e.target.value))
            }}
            >
            {[10, 20, 30, 40, 50].map(pageSize => (
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
