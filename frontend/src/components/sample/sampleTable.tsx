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
import { formatNumericValue } from "../../utils/dataUtilities"; // Import the formatNumericValue function


const SampleTable = ({ filters, visibleColumns }) => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await fetch("http://localhost:5062/api/sample/list");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setTableData(data.result); // Just save the array part
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

  const matchStation =
  filters.station === "all" || item.stationCode === filters.station;

const matchCruise =
  filters.cruise === "all" || item.cruiseName === filters.cruise;

const matchContractor =
  filters.contractor === "all" || item.contractorName === filters.contractor;


return (
  matchSampleType &&
  matchMatrixType &&
  matchHabitatType &&
  matchAnalysis &&
  matchSearch &&
  matchStation &&
  matchCruise &&
  matchContractor
  );
    });
  }, [filters, tableData]);

  // Define all possible columns
  const allColumns = {
    sampleCode: {
      accessorKey: "sampleCode",
      header: "Sample Code",
    },
    station: {
      accessorKey: "stationCode",
      header: "StationCode",
    },
    cruise: {
      accessorKey: "cruiseName",
      header: "Cruise",
      
    },
    contractor: {
      accessorKey: "contractorName",
      header: "Contractor",
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

  // Updated exportColumns to prevent Excel date conversion issues
  const exportColumns = useMemo(() => {
    if (!filteredData.length) return [];
  
    // Define formatters for specific fields to prevent Excel date conversion
    const formatters = {
      // For all numeric fields that might be misinterpreted as dates
      result: (val) => formatNumericValue(val),
      depthLower: (val) => formatNumericValue(val),
      depthUpper: (val) => formatNumericValue(val),
      // Add any other numeric fields that need protection
    };
  
    return Object.keys(filteredData[0]).map((key) => ({
      label: key,
      key,
      format: formatters[key] || ((val) => val !== null && val !== undefined ? String(val) : ""),
    }));
  }, [filteredData]);
  

  return (
    <div className={styles.fileTableContainer}>
      <CsvExportButton
        data={filteredData}
        columns={exportColumns}
        filename="filtered-samples.csv"
        meta={{
          title: "Samples",
          filters: {
            "Sample Type": filters.sampleType,
            "Matrix Type": filters.matrixType,
            "Habitat Type": filters.habitatType,
            "Analysis": filters.analysis,
            "Station": filters.station,
            "Cruise": filters.cruise,
            "Contractor": filters.contractor,
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