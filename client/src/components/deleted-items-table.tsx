"use client";

import { useState } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/data-table-pagination";
import { RemarksModal } from "@/components/remarks-modal";

interface DeletedItem {
  id: string;
  name: string;
  type: "Student" | "Tuition" | "Carpool" | "Transaction";
  deletedAt: string;
  deletedBy: string;
  deletionRemarks?: string;
}

interface DeletedItemsTableProps {
  items: DeletedItem[];
  onView: (item: DeletedItem) => void;
  onRestore: (itemId: string, remarks: string) => void;
}

export function DeletedItemsTable({
  items,
  onView,
  onRestore,
}: DeletedItemsTableProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState<DeletedItem | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  // Calculate pagination
  const pageCount = Math.ceil(items.length / pageSize);
  const paginatedItems = items.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const handleRestoreClick = (item: DeletedItem) => {
    setSelectedItem(item);
    setIsRestoreModalOpen(true);
  };

  const handleRestoreConfirm = (remarks: string) => {
    if (selectedItem) {
      onRestore(selectedItem.id, remarks);
      setIsRestoreModalOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <>
      <div className="rounded-md border w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead>Deleted By</TableHead>
              <TableHead className="hidden md:table-cell">Remarks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No deleted items found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.type === "Student"
                          ? "default"
                          : item.type === "Tuition"
                          ? "secondary"
                          : item.type === "Carpool"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.deletedAt), "PPP p")}
                  </TableCell>
                  <TableCell>{item.deletedBy}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                    {item.deletionRemarks || "No remarks provided"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onView(item)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRestoreClick(item)}
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="sr-only">Restore</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        totalItems={items.length}
        onPageChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />

      {selectedItem && (
        <RemarksModal
          isOpen={isRestoreModalOpen}
          onClose={() => setIsRestoreModalOpen(false)}
          onConfirm={handleRestoreConfirm}
          title={`Restore ${selectedItem.type}`}
          description={`Please provide a reason for restoring ${selectedItem.name}.`}
          actionLabel="Restore"
          actionVariant="default"
        />
      )}
    </>
  );
}
