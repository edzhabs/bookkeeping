"use client";

import { useState } from "react";
import { LucideSearch } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeletedItemsTable } from "@/components/deleted-items-table";
import { logActivity } from "@/lib/activity-logger";

// Sample deleted items for demonstration
const sampleDeletedItems = [
  {
    id: "1",
    name: "John Doe",
    type: "Student" as const,
    deletedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    deletedBy: "Admin User",
    deletionRemarks: "Student transferred to another school",
  },
  {
    id: "2",
    name: "TUI-2023-005",
    type: "Transaction" as const,
    deletedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    deletedBy: "Finance Officer",
    deletionRemarks: "Duplicate payment record",
  },
  {
    id: "3",
    name: "Michael Johnson - Grade 9",
    type: "Tuition" as const,
    deletedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    deletedBy: "Admin User",
    deletionRemarks: "Student withdrew from enrollment",
  },
  {
    id: "4",
    name: "Sarah Williams - North Route",
    type: "Carpool" as const,
    deletedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    deletedBy: "Transport Officer",
    deletionRemarks: "Student no longer needs carpool service",
  },
];

export default function ArchivePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "All" | "Student" | "Tuition" | "Carpool" | "Transaction"
  >("All");
  const [deletedItems, setDeletedItems] = useState(sampleDeletedItems);

  // Filter deleted items based on search term and filter type
  const filteredItems = deletedItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    if (filterType === "All") {
      return matchesSearch;
    } else {
      return matchesSearch && item.type === filterType;
    }
  });

  const handleViewItem = (item: (typeof deletedItems)[0]) => {
    // In a real app, you would navigate to a view that shows the deleted item
    console.log(`Viewing deleted item: ${item.name}`);

    logActivity({
      action: "Viewed",
      entityType: item.type,
      entityId: item.id,
      details: `Viewed deleted ${item.type.toLowerCase()} record: ${item.name}`,
    });
  };

  const handleRestoreItem = (itemId: string, remarks: string) => {
    // In a real app, you would restore the item in your database
    console.log(`Restoring item with ID: ${itemId}, Remarks: ${remarks}`);

    // Find the item to be restored
    const itemToRestore = deletedItems.find((item) => item.id === itemId);
    if (!itemToRestore) return;

    // Remove the item from the deleted items list
    setDeletedItems(deletedItems.filter((item) => item.id !== itemId));

    logActivity({
      action: "Updated",
      entityType: itemToRestore.type,
      entityId: itemToRestore.id,
      details: `Restored ${itemToRestore.type.toLowerCase()} record: ${
        itemToRestore.name
      }. Reason: ${remarks}`,
    });
  };

  return (
    <div className="container py-8 w-full max-w-full px-4 md:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Archive</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Deleted Items</CardTitle>
          <CardDescription>
            View and manage soft-deleted records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-xs"
              icon={<LucideSearch className="h-4 w-4" />}
            />
            <Select
              value={filterType}
              onValueChange={(value) =>
                setFilterType(
                  value as
                    | "All"
                    | "Student"
                    | "Tuition"
                    | "Carpool"
                    | "Transaction"
                )
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Items</SelectItem>
                <SelectItem value="Student">Students</SelectItem>
                <SelectItem value="Tuition">Tuitions</SelectItem>
                <SelectItem value="Carpool">Carpools</SelectItem>
                <SelectItem value="Transaction">Transactions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DeletedItemsTable
            items={filteredItems}
            onView={handleViewItem}
            onRestore={handleRestoreItem}
          />
        </CardContent>
      </Card>
    </div>
  );
}
