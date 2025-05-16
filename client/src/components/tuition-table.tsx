"use client";
import { useState, useMemo } from "react";
import {
  LucideDollarSign,
  Eye,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tuition } from "@/types/tuition";
import type { ActivityLogItem } from "@/types/activity-log";

interface TuitionTableProps {
  tuitions: Tuition[];
  onPayClick: (tuition: Tuition) => void;
  onViewClick: (tuitionId: string) => void;
  onStudentClick: (studentId: string) => void;
}

type SortField =
  | "student"
  | "schoolYear"
  | "totalAmount"
  | "remaining"
  | "status";
type SortDirection = "asc" | "desc";

// Sample activity logs for tuitions
const sampleTuitionLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Tuition",
    entityId: "1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Created tuition record for John Doe",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Updated payment status to Partial",
  },
  {
    id: "3",
    action: "Created",
    entityType: "Tuition",
    entityId: "3",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: "Admin User",
    details: "Created tuition record for Michael Johnson",
  },
];

export function TuitionTable({
  tuitions,
  onPayClick,
  onViewClick,
  onStudentClick,
}: TuitionTableProps) {
  const [sortField, setSortField] = useState<SortField>("student");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<"tuitions" | "activity">(
    "tuitions"
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPageIndex(0);
  };

  const sortedTuitions = useMemo(() => {
    return [...tuitions].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "student":
          aValue = a.studentName;
          bValue = b.studentName;
          break;
        case "schoolYear":
          aValue = a.schoolYear;
          bValue = b.schoolYear;
          break;
        case "totalAmount":
          aValue = a.totalAmount;
          bValue = b.totalAmount;
          break;
        case "remaining":
          aValue = a.remainingBalance;
          bValue = b.remainingBalance;
          break;
        case "status":
          // Sort by status priority: Unpaid > Partial > Paid
          const statusPriority = { Unpaid: 0, Partial: 1, Paid: 2 };
          aValue = statusPriority[a.status];
          bValue = statusPriority[b.status];
          break;
        default:
          return 0;
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [tuitions, sortField, sortDirection]);

  // Calculate pagination
  const pageCount = Math.ceil(sortedTuitions.length / pageSize);
  const paginatedTuitions = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return sortedTuitions.slice(start, end);
  }, [sortedTuitions, pageIndex, pageSize]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  // Filter activity logs for tuitions
  const filteredActivityLogs = sampleTuitionLogs.filter((log) => {
    return tuitions.some((tuition) => tuition.id === log.entityId);
  });

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "tuitions" | "activity")
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="tuitions">Tuitions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="tuitions">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("student")}
                  >
                    Student {renderSortIcon("student")}
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => handleSort("schoolYear")}
                  >
                    School Year {renderSortIcon("schoolYear")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("totalAmount")}
                  >
                    Total Amount {renderSortIcon("totalAmount")}
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => handleSort("remaining")}
                  >
                    Remaining {renderSortIcon("remaining")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status {renderSortIcon("status")}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTuitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No tuition records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTuitions.map((tuition) => (
                    <TableRow key={tuition.id}>
                      <TableCell className="font-medium">
                        <button
                          onClick={() => onStudentClick(tuition.studentId)}
                          className="hover:underline text-left font-medium"
                        >
                          {tuition.studentName}
                        </button>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {tuition.schoolYear}
                      </TableCell>
                      <TableCell>
                        ₱{tuition.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ₱{tuition.remainingBalance.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tuition.status === "Paid"
                              ? "success"
                              : tuition.status === "Partial"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {tuition.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onViewClick(tuition.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onPayClick(tuition)}
                              disabled={tuition.status === "Paid"}
                            >
                              <LucideDollarSign className="mr-2 h-4 w-4" />
                              Make Payment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
            totalItems={sortedTuitions.length}
            onPageChange={setPageIndex}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageIndex(0);
            }}
          />
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Tuition Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivityLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No activity logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.action === "Created"
                                ? "default"
                                : log.action === "Updated"
                                ? "outline"
                                : log.action === "Deleted"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
