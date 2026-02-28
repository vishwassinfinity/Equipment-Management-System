import { useState } from "react"
import { format } from "date-fns"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  History,
  Wrench,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import type { Equipment, EquipmentQuery } from "@/types/equipment"
import { EQUIPMENT_STATUSES } from "@/types/equipment"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EquipmentTableProps {
  equipment: Equipment[]
  query: EquipmentQuery
  totalElements: number
  totalPages: number
  onQueryChange: (partial: Partial<EquipmentQuery>) => void
  onSort: (field: string) => void
  onPageChange: (page: number) => void
  onEdit: (equipment: Equipment) => void
  onDelete: (equipment: Equipment) => void
  onViewHistory: (equipment: Equipment) => void
  onLogMaintenance: (equipment: Equipment) => void
}

function getStatusVariant(status: Equipment["status"]) {
  switch (status) {
    case "Active":
      return "default" as const
    case "Inactive":
      return "secondary" as const
    case "Under Maintenance":
      return "destructive" as const
  }
}

/** Sortable column header */
function SortableHeader({
  label,
  field,
  currentSort,
  currentDir,
  onSort,
}: {
  label: string
  field: string
  currentSort: string
  currentDir: "asc" | "desc"
  onSort: (field: string) => void
}) {
  const isActive = currentSort === field
  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 -ml-2 px-2 py-1 h-auto font-normal hover:bg-muted/50"
      onClick={() => onSort(field)}
    >
      {label}
      {isActive ? (
        currentDir === "asc" ? (
          <ArrowUp className="h-3.5 w-3.5" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5" />
        )
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
      )}
    </Button>
  )
}

export function EquipmentTable({
  equipment,
  query,
  totalElements,
  totalPages,
  onQueryChange,
  onSort,
  onPageChange,
  onEdit,
  onDelete,
  onViewHistory,
  onLogMaintenance,
}: EquipmentTableProps) {
  const [searchInput, setSearchInput] = useState(query.search ?? "")

  // Debounced-ish search: fires on Enter or blur
  function commitSearch() {
    const trimmed = searchInput.trim()
    if (trimmed !== (query.search ?? "")) {
      onQueryChange({ search: trimmed || undefined })
    }
  }

  const startItem = totalElements === 0 ? 0 : query.page * query.size + 1
  const endItem = Math.min((query.page + 1) * query.size, totalElements)

  return (
    <div className="space-y-4">
      {/* Toolbar: Search + Filters + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search — takes all remaining space */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or type..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitSearch()
            }}
            onBlur={commitSearch}
          />
        </div>

        {/* Status filter */}
        <Select
          value={query.status ?? "ALL"}
          onValueChange={(val) =>
            onQueryChange({ status: val === "ALL" ? undefined : val })
          }
        >
          <SelectTrigger className="w-full sm:w-[180px] shrink-0">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {EQUIPMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${query.sortBy}:${query.sortDir}`}
          onValueChange={(val) => {
            const [field, dir] = val.split(":")
            onQueryChange({ sortBy: field, sortDir: dir as "asc" | "desc", page: 0 })
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px] shrink-0">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name:asc">Name (A–Z)</SelectItem>
            <SelectItem value="name:desc">Name (Z–A)</SelectItem>
            <SelectItem value="typeName:asc">Type (A–Z)</SelectItem>
            <SelectItem value="typeName:desc">Type (Z–A)</SelectItem>
            <SelectItem value="status:asc">Status (A–Z)</SelectItem>
            <SelectItem value="status:desc">Status (Z–A)</SelectItem>
            <SelectItem value="lastCleanedDate:desc">Cleaned (Newest)</SelectItem>
            <SelectItem value="lastCleanedDate:asc">Cleaned (Oldest)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {equipment.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No equipment found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {query.search || query.status
              ? "Try adjusting your search or filter."
              : "Get started by adding your first piece of equipment."}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortableHeader
                      label="Name"
                      field="name"
                      currentSort={query.sortBy}
                      currentDir={query.sortDir}
                      onSort={onSort}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      label="Type"
                      field="typeName"
                      currentSort={query.sortBy}
                      currentDir={query.sortDir}
                      onSort={onSort}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      label="Status"
                      field="status"
                      currentSort={query.sortBy}
                      currentDir={query.sortDir}
                      onSort={onSort}
                    />
                  </TableHead>
                  <TableHead>
                    <SortableHeader
                      label="Last Cleaned"
                      field="lastCleanedDate"
                      currentSort={query.sortBy}
                      currentDir={query.sortDir}
                      onSort={onSort}
                    />
                  </TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.typeName}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.lastCleanedDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewHistory(item)}>
                            <History className="mr-2 h-4 w-4" />
                            Maintenance History
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onLogMaintenance(item)}>
                            <Wrench className="mr-2 h-4 w-4" />
                            Log Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(item)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startItem}–{endItem} of {totalElements} equipment
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={query.page === 0}
                onClick={() => onPageChange(0)}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={query.page === 0}
                onClick={() => onPageChange(query.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <span className="px-3 text-sm">
                Page {query.page + 1} of {Math.max(totalPages, 1)}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={query.page >= totalPages - 1}
                onClick={() => onPageChange(query.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={query.page >= totalPages - 1}
                onClick={() => onPageChange(totalPages - 1)}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
