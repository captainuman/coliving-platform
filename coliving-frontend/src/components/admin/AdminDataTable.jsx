import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

const AdminDataTable = ({
  title,
  data = [],
  columns = [],
  searchableFields = [],
  pageSize = 10,
}) => {
  const safeData = Array.isArray(data) ? data : [];
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search.trim()) return safeData;

    return safeData.filter((item) =>
      searchableFields.some((field) => {
        const value = getNestedValue(item, field);
        return String(value || "")
          .toLowerCase()
          .includes(search.toLowerCase());
      })
    );
  }, [safeData, search, searchableFields]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;

  const paginatedData = sortedData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const exportCsv = () => {
    const headers = columns.map((col) => col.label).join(",");

    const rows = sortedData.map((row) =>
      columns
        .map((col) => {
          const value = col.render
            ? col.render(row)
            : getNestedValue(row, col.key);

          return `"${String(value || "").replaceAll('"', '""')}"`;
        })
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${title.replaceAll(" ", "_").toLowerCase()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-6 sm:mt-8 w-full overflow-hidden">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-xl sm:text-2xl">
          {title}
        </CardTitle>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              className="h-9 w-full sm:w-64 rounded-md border bg-background pl-9 pr-3 text-sm outline-none"
            />
          </div>

          <button
            onClick={exportCsv}
            className="inline-flex h-9 w-full sm:w-auto items-center justify-center gap-2 rounded-md border px-3 text-sm"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-3 sm:px-6">
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/60">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() =>
                      col.sortable !== false && handleSort(col.key)
                    }
                    className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-medium"
                  >
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <tr key={row._id || rowIndex} className="border-t">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="whitespace-nowrap px-4 py-3"
                      >
                        {col.render
                          ? col.render(row)
                          : getNestedValue(row, col.key) || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            Showing {paginatedData.length} of {sortedData.length} records
          </p>

          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-normal">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
            >
              Previous
            </button>

            <span className="whitespace-nowrap text-sm">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export default AdminDataTable;