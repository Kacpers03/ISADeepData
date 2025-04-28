import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLanguage } from "../../contexts/languageContext";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";
import styles from "../../styles/files/reports.module.css";
import { useRouter } from "next/router";


interface FileData {
  fileName: string;
  contractor: string;
  country: string;
  year: number;
  theme: string;
  description: string;
}

const FileTable: React.FC<{ 
  filters: {
    country: string;
    contractor: string;
    year: string;
    theme: string;
    searchQuery: string;
  };
  setFilteredItems?: (items: FileData[]) => void;
  
}> = ({ filters, setFilteredItems }) => {
  const { t } = useLanguage();
  const [tableData, setTableData] = useState<FileData[]>([]);
  const router = useRouter();
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Track previous filter values to detect changes
  const prevFiltersRef = useRef(filters);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5062/api/library/list");
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setTableData(data);
        setInitialLoad(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setInitialLoad(false);
      }
    };

    fetchFiles();
  }, []);

  // Save scroll position when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (tableScrollRef.current) {
        setScrollPosition(tableScrollRef.current.scrollTop);
      }
    };

    const scrollContainer = tableScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const filteredData = useMemo(() => {
    const filtered = tableData.filter((item) => {
      const matchCountry =
        filters.country === "all" || 
        item.country?.toLowerCase() === filters.country.toLowerCase();

      const matchContractor =
        filters.contractor === "all" || 
        item.contractor?.toLowerCase() === filters.contractor.toLowerCase();

      const matchYear =
        filters.year === "all" || item.year?.toString() === filters.year;

      const matchTheme =
        filters.theme === "all" || 
        item.theme?.toLowerCase() === filters.theme.toLowerCase();

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
  }, [filters, tableData, setFilteredItems]);

  // Get summary statistics for the filter bar
  const filterSummary = useMemo(() => {
    if (!filteredData.length) return null;
    
    const uniqueContractors = new Set(filteredData.map(item => item.contractor).filter(Boolean));
    const uniqueCountries = new Set(filteredData.map(item => item.country).filter(Boolean));
    const uniqueThemes = new Set(filteredData.map(item => item.theme).filter(Boolean));
    
    return {
      contractorCount: uniqueContractors.size,
      countryCount: uniqueCountries.size,
      themeCount: uniqueThemes.size
    };
  }, [filteredData]);

  // Restore scroll position when filtered data changes
  useEffect(() => {
    // Only restore scroll if it's not the initial load and filters have changed
    if (!initialLoad && tableScrollRef.current && 
        (filters.country !== prevFiltersRef.current.country ||
         filters.contractor !== prevFiltersRef.current.contractor ||
         filters.year !== prevFiltersRef.current.year ||
         filters.theme !== prevFiltersRef.current.theme ||
         filters.searchQuery !== prevFiltersRef.current.searchQuery)) {
      
      // Small delay to ensure the DOM has updated
      setTimeout(() => {
        if (tableScrollRef.current) {
          tableScrollRef.current.scrollTop = scrollPosition;
        }
      }, 0);
    }
    
    // Update the previous filters reference
    prevFiltersRef.current = filters;
  }, [filteredData, initialLoad, scrollPosition, filters]);

  const columns: ColumnDef<FileData>[] = useMemo(
    () => [
      {
        accessorKey: "fileName",
        header: t('library.table.fileName') || "File Name",
        minWidth: 200,
        cell: (info) => {
          const fileUrl = info.getValue<string>();
          const fileName = fileUrl?.split("/").pop() || "Unknown File";
          return (
            <div className={styles.fileLinkContainer}>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className={styles.fileLink}
                onClick={(e) => e.stopPropagation()} // Stop event propagation to prevent navigation
              >
                <Download className={styles.downloadIcon} size={16} />
                {fileName}
              </a>
            </div>
          );
        },
      },
      {
        accessorKey: "contractor",
        header: t('library.table.contractor') || "Contractorr",
        minWidth: 120,
        cell: (info) => <span>{info.getValue<string>() || t('library.table.unknown') || "Unknown"}</span>,
      },
      {
        accessorKey: "country",
        header: t('library.table.country') || "Country",
        minWidth: 120,
        cell: (info) => <span>{info.getValue<string>() || t('library.table.na') || "N/A"}</span>,
      },
      {
        accessorKey: "year",
        header: t('library.table.year') || "Year",
        minWidth: 80,
        cell: (info) => <span>{info.getValue<string | number>() || t('library.table.na') || "N/A"}</span>,
      },
      {
        accessorKey: "theme",
        header: t('library.table.theme') || "Theme",
        minWidth: 120,
        cell: (info) => <span>{info.getValue<string>() || t('library.table.na') || "N/A"}</span>,
      },
      {
        id: "description",
        header: t('library.table.description') || "Description",
        minWidth: 100,
        cell: ({ row }) => {
          const description = row.original.description || t('library.table.noDescription') || "No description available";
          return (
            <div className={styles.tooltipContainer} onClick={(e) => e.stopPropagation()}>
              <div className={styles.tooltip}>
                {description}
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ 
    pageIndex: 0, 
    pageSize: 10 
  });

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
    <div className={styles.fileTableContainer}>
      {/* Filter Summary */}
      {filterSummary && (
        <div className={styles.filterSummary}>
          Showing {filterSummary.contractorCount} contractor{filterSummary.contractorCount !== 1 ? 's' : ''}, 
          {' '}{filterSummary.countryCount} countr{filterSummary.countryCount !== 1 ? 'ies' : 'y'}, 
          and {filterSummary.themeCount} theme{filterSummary.themeCount !== 1 ? 's' : ''}
        </div>
      )}
      
      <div 
        className={styles.tableScrollContainer} 
        ref={tableScrollRef}
        style={{ height: 'auto' }} // Ensure height is based on content
      >
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th 
                    key={column.id} 
                    onClick={column.column.getToggleSortingHandler()}
                    className={styles.sortableHeader}
                    style={{ minWidth: (column.column.columnDef as any).minWidth }}
                  >
                    {flexRender(column.column.columnDef.header, column.getContext())}
                    {column.column.getIsSorted() && (
                      <span className={styles.sortIndicator}>
                        {column.column.getIsSorted() === "desc" ? " ▼" : " ▲"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={styles.tableRow}
                  onClick={() =>
                    router.push({
                      pathname: "/library/moreinfo",
                      query: { data: JSON.stringify(row.original) },
                    })
                  }
                  style={{ cursor: "pointer" }}
                > 
                  {row.getVisibleCells().map((cell) => (
                    <td 
                      key={cell.id}
                      style={{ minWidth: (cell.column.columnDef as any).minWidth }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px 20px' }}>
                  No results match your current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <div className={styles.paginationControls}>
          <button 
            onClick={() => table.setPageIndex(0)} 
            disabled={!table.getCanPreviousPage()}
            className={styles.paginationButton}
          >
            <ChevronsLeft size={16} />
          </button>
          <button 
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()}
            className={styles.paginationButton}
          >
            <ChevronLeft size={16} />
          </button>
          <span className={styles.pageInfo}>
          <span className={styles.pageInfo}>
  {t('library.pagination.page') || "Page"} {table.getState().pagination.pageIndex + 1} {t('library.pagination.of') || "of"} {Math.max(1, table.getPageCount())}
</span>
          </span>
          <button 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
            className={styles.paginationButton}
          >
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={() => table.setPageIndex(table.getPageCount() - 1)} 
            disabled={!table.getCanNextPage()}
            className={styles.paginationButton}
          >
            <ChevronsRight size={16} />
          </button>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className={styles.pageSizeSelect}
          >
              {[5, 10, 20, 30, 50].map((pageSize) => (
    <option key={pageSize} value={pageSize}>
      {t('library.pagination.show') || "Show"} {pageSize}
    </option>
  ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FileTable;