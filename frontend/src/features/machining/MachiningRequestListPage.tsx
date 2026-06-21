import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { STATUS_LABELS } from "./constants";
import { fetchMachiningRequests } from "./machiningApi";
import type { MachiningRequest } from "./types";

const columnHelper = createColumnHelper<MachiningRequest>();

export function MachiningRequestListPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MachiningRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const canCreate = user?.role.name === "admin" || user?.role.name === "leader";

  useEffect(() => {
    fetchMachiningRequests()
      .then(setRequests)
      .catch(() => setError("加工依頼一覧の取得に失敗しました"))
      .finally(() => setIsLoading(false));
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      }),
      columnHelper.accessor("request_no", { header: "依頼番号" }),
      columnHelper.accessor("product_code", { header: "品番" }),
      columnHelper.accessor("product_name", { header: "品名" }),
      columnHelper.accessor("quantity", { header: "数量" }),
      columnHelper.accessor("due_date", {
        header: "納期",
        cell: (info) => new Date(info.getValue()).toLocaleDateString("ja-JP"),
      }),
      columnHelper.accessor("status", {
        header: "進捗",
        cell: (info) => STATUS_LABELS[info.getValue()],
      }),
      columnHelper.accessor((row) => row.created_by.name, {
        id: "created_by",
        header: "登録者",
      }),
      columnHelper.display({
        id: "detail",
        header: "詳細",
        cell: ({ row }) => <Link to={`/machining/requests/${row.original.id}`}>詳細</Link>,
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: requests,
    columns,
    state: { globalFilter, sorting, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  if (isLoading) {
    return <p>読み込み中...</p>;
  }
  if (error) {
    return <p className="login-error">{error}</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>加工依頼一覧</h1>
        {canCreate && (
          <Link to="/machining/requests/new" className="primary-button">
            新規登録
          </Link>
        )}
      </div>
      <input
        type="text"
        placeholder="検索..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="table-filter"
      />
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" && " ▲"}
                  {header.column.getIsSorted() === "desc" && " ▼"}
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
      <div className="table-pagination">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          前へ
        </button>
        <span>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          次へ
        </button>
      </div>
    </div>
  );
}
