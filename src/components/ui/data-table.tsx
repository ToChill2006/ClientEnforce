"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { Checkbox } from "./input";
import { Button } from "./button";

export type Column<T> = {
  key: string;
  header: React.ReactNode;
  /** Default cell renderer — falls back to String(row[key]) */
  render?: (row: T) => React.ReactNode;
  /** When provided, column is sortable; return a comparable value. */
  sortValue?: (row: T) => string | number | Date | null | undefined;
  width?: string;
  align?: "left" | "right" | "center";
  hideOnMobile?: boolean;
  className?: string;
  headerClassName?: string;
};

export type SortState = { key: string | null; dir: "asc" | "desc" };

export type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  getRowId: (row: T) => string;
  /** Optional row click handler (or navigation href) */
  onRowClick?: (row: T) => void;
  rowHref?: (row: T) => string;
  /** Optional trailing actions rendered in each row. */
  rowActions?: (row: T) => React.ReactNode;
  /** Enables bulk selection with checkboxes. */
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Sticky toolbar rendered above the table */
  toolbar?: React.ReactNode;
  /** Shown when data is empty */
  empty?: React.ReactNode;
  /** Shown as a bar above the table when rows are selected. */
  bulkBar?: (ids: string[], clear: () => void) => React.ReactNode;
  loading?: boolean;
  className?: string;
  /** Initial sort */
  defaultSort?: SortState;
  /** When provided, renders a CSV export button in the toolbar area. */
  csvExport?: {
    filename: string;
    /** Column keys to include. Defaults to all columns. */
    columns?: string[];
  };
};

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = typeof v === "string" ? v : v instanceof Date ? v.toISOString() : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement(node)) {
    const props = (node as any).props;
    return extractText(props?.children);
  }
  return "";
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  onRowClick,
  rowHref,
  rowActions,
  selectable = false,
  selectedIds,
  onSelectionChange,
  toolbar,
  empty,
  bulkBar,
  loading = false,
  className = "",
  defaultSort,
  csvExport,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<SortState>(defaultSort ?? { key: null, dir: "desc" });

  const selectionControlled = selectedIds !== undefined;
  const [internalSel, setInternalSel] = React.useState<string[]>([]);
  const sel = selectionControlled ? selectedIds! : internalSel;
  const setSel = (ids: string[]) => {
    if (selectionControlled) onSelectionChange?.(ids);
    else setInternalSel(ids);
  };

  const sortedData = React.useMemo(() => {
    if (!sort.key) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return data;
    const dirMul = sort.dir === "asc" ? 1 : -1;
    return [...data].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av instanceof Date && bv instanceof Date) return (av.getTime() - bv.getTime()) * dirMul;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dirMul;
      return String(av).localeCompare(String(bv)) * dirMul;
    });
  }, [data, columns, sort]);

  const allIds = React.useMemo(() => sortedData.map(getRowId), [sortedData, getRowId]);
  const allSelected = sel.length > 0 && sel.length === allIds.length;
  const someSelected = sel.length > 0 && !allSelected;

  const toggleAll = () => setSel(allSelected ? [] : allIds);
  const toggleOne = (id: string) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);

  const clickHeader = (col: Column<T>) => {
    if (!col.sortValue) return;
    setSort((s) =>
      s.key === col.key
        ? { key: col.key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key: col.key, dir: "asc" }
    );
  };

  const hasBulk = selectable && sel.length > 0 && bulkBar;

  const exportCsv = React.useCallback(() => {
    if (!csvExport) return;
    const includeKeys = csvExport.columns?.length
      ? csvExport.columns
      : columns.map((c) => c.key);
    const cols = includeKeys
      .map((k) => columns.find((c) => c.key === k))
      .filter((c): c is Column<T> => !!c);
    const header = cols.map((c) => csvEscape(extractText(c.header) || c.key)).join(",");
    const lines = sortedData.map((row) =>
      cols
        .map((c) => {
          let v: unknown;
          if (c.sortValue) v = c.sortValue(row);
          else if (c.render) v = extractText(c.render(row));
          else v = (row as any)[c.key];
          return csvEscape(v);
        })
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = csvExport.filename.endsWith(".csv") ? csvExport.filename : `${csvExport.filename}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [csvExport, columns, sortedData]);

  const csvButton = csvExport ? (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={exportCsv}
      iconLeft={<Download className="h-3.5 w-3.5" />}
    >
      Export CSV
    </Button>
  ) : null;

  const toolbarNode = toolbar || csvButton ? (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">{toolbar}</div>
      {csvButton && <div className="shrink-0">{csvButton}</div>}
    </div>
  ) : null;

  return (
    <div className={cn("w-full", className)}>
      {toolbarNode && <div className="mb-3">{toolbarNode}</div>}
      {hasBulk && (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] px-3 py-1.5 text-xs">
          <div className="font-medium text-[var(--color-accent)]">
            {sel.length} selected
          </div>
          <div className="flex items-center gap-2">{bulkBar!(sel, () => setSel([]))}</div>
        </div>
      )}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
              <tr>
                {selectable && (
                  <th scope="col" className="w-[34px] px-3">
                    <Checkbox
                      aria-label="Select all"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={toggleAll}
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const activeSort = sort.key === col.key;
                  return (
                    <th
                      key={col.key}
                      scope="col"
                      style={{ width: col.width }}
                      className={cn(
                        "px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        col.align !== "right" && col.align !== "center" && "text-left",
                        col.hideOnMobile && "hidden md:table-cell",
                        col.headerClassName
                      )}
                    >
                      {col.sortValue ? (
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-[var(--radius-xs)] px-0.5 hover:text-[var(--color-text-primary)]"
                          onClick={() => clickHeader(col)}
                        >
                          {col.header}
                          {activeSort ? (
                            sort.dir === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )
                          ) : (
                            <ChevronDown className="h-3 w-3 opacity-30" />
                          )}
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  );
                })}
                {rowActions && <th aria-label="Actions" className="w-8 px-3" />}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`sk-${i}`} className="border-t border-[var(--color-border)]">
                    {selectable && <td className="px-3 py-3" />}
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-3 py-3", c.hideOnMobile && "hidden md:table-cell")}>
                        <div className="h-3.5 w-24 rounded-[var(--radius-xs)] bg-[var(--color-bg-muted)] animate-pulse" />
                      </td>
                    ))}
                    {rowActions && <td className="px-3 py-3" />}
                  </tr>
                ))
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}>
                    {empty ?? (
                      <div className="py-14 text-center text-sm text-[var(--color-text-muted)]">
                        No results.
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                sortedData.map((row) => {
                  const id = getRowId(row);
                  const isSelected = sel.includes(id);
                  const clickable = Boolean(onRowClick || rowHref);
                  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
                    const tgt = e.target as HTMLElement;
                    // Don't navigate when clicking interactive elements.
                    if (tgt.closest("button, a, input, label, [role=button]")) return;
                    if (rowHref) {
                      window.location.href = rowHref(row);
                    } else if (onRowClick) {
                      onRowClick(row);
                    }
                  };
                  return (
                    <tr
                      key={id}
                      onClick={clickable ? handleRowClick : undefined}
                      className={cn(
                        "border-t border-[var(--color-border)] row-hover",
                        clickable && "cursor-pointer",
                        isSelected && "bg-[var(--color-accent-subtle)]"
                      )}
                    >
                      {selectable && (
                        <td className="px-3 align-middle">
                          <Checkbox
                            aria-label="Select row"
                            checked={isSelected}
                            onChange={() => toggleOne(id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      {columns.map((col) => {
                        const value = col.render ? col.render(row) : (row as any)[col.key];
                        return (
                          <td
                            key={col.key}
                            className={cn(
                              "px-3 py-3 align-middle text-sm text-[var(--color-text-primary)]",
                              col.align === "right" && "text-right",
                              col.align === "center" && "text-center",
                              col.hideOnMobile && "hidden md:table-cell",
                              col.className
                            )}
                          >
                            {value}
                          </td>
                        );
                      })}
                      {rowActions && (
                        <td className="px-2 text-right align-middle">{rowActions(row)}</td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
