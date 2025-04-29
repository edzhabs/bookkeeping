"use client";

import { useState, useMemo } from "react";
import { Eye, LucideDollarSign, ChevronUp, ChevronDown } from "lucide-react";

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
import { CarpoolDetails } from "@/components/carpool-details";
import { DataTablePagination } from "@/components/data-table-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Carpool } from "@/types/carpool";
import type { ActivityLogItem } from "@/types/activity-log";

interface CarpoolTableProps {
  carpools: Carpool[];
  onPayClick: (carpool: Carpool) => void;
}

type SortField = "student" | "route" | "driver" | "fee" | "status" | "payment";
type SortDirection = "asc" | "desc";

// Sample activity logs for carpools
const sampleCarpoolLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Carpool",
    entityId: "1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Created carpool record for John Doe",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Carpool",
    entityId: "1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Updated payment status to Paid",
  },
  {
    id: "3",
    action: "Viewed",
    entityType: "Carpool",
    entityId: "1",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: "Admin User",
    details: "Viewed carpool details",
  },
];

export function CarpoolTable({ carpools, onPayClick }: CarpoolTableProps) {
  const [selectedCarpool, setSelectedCarpool] = useState<Carpool | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>("student");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState<"carpools" | "activity">(
    "carpools"
  );

  const handleViewDetails = (carpool: Carpool) => {
    setSelectedCarpool(carpool);
    setIsDetailsOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPageIndex(0);
  };

  const sortedCarpools = useMemo(() => {
    return [...carpools].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "student":
          aValue = a.studentName;
          bValue = b.studentName;
          break;
        case "route":
          aValue = a.route;
          bValue = b.route;
          break;
        case "driver":
          aValue = a.driver;
          bValue = b.driver;
          break;
        case "fee":
          aValue = a.fee;
          bValue = b.fee;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "payment":
          aValue = a.paymentStatus;
          bValue = b.paymentStatus;
          break;
        default:
          return 0;
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [carpools, sortField, sortDirection]);

  // Calculate pagination
  const pageCount = Math.ceil(sortedCarpools.length / pageSize);
  const paginatedCarpools = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return sortedCarpools.slice(start, end);
  }, [sortedCarpools, pageIndex, pageSize]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  // Filter activity logs for carpools
  const filteredActivityLogs = sampleCarpoolLogs.filter((log) => {
    return carpools.some((carpool) => carpool.id === log.entityId);
  });

  return (
    <>
      <div className="space-y-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "carpools" | "activity")
          }
        >
          <TabsList className="mb-4">
            <TabsTrigger value="carpools">Carpools</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="carpools">
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
                      onClick={() => handleSort("route")}
                    >
                      Route {renderSortIcon("route")}
                    </TableHead>
                    <TableHead
                      className="hidden md:table-cell cursor-pointer"
                      onClick={() => handleSort("driver")}
                    >
                      Driver {renderSortIcon("driver")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("fee")}
                    >
                      Fee {renderSortIcon("fee")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status {renderSortIcon("status")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("payment")}
                    >
                      Payment {renderSortIcon("payment")}
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCarpools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No carpool records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCarpools.map((carpool) => (
                      <TableRow key={carpool.id}>
                        <TableCell className="font-medium">
                          {carpool.studentName}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {carpool.route}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {carpool.driver}
                        </TableCell>
                        <TableCell>₱{carpool.fee.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              carpool.status === "Active"
                                ? "outline"
                                : "secondary"
                            }
                          >
                            {carpool.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              carpool.paymentStatus === "Paid"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {carpool.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleViewDetails(carpool)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => onPayClick(carpool)}
                              disabled={
                                carpool.paymentStatus === "Paid" ||
                                carpool.status === "Inactive"
                              }
                            >
                              <LucideDollarSign className="h-4 w-4" />
                              <span className="sr-only">Pay</span>
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
              totalItems={sortedCarpools.length}
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
                <CardTitle>Carpool Activity Log</CardTitle>
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

      {selectedCarpool && (
        <CarpoolDetails
          carpool={selectedCarpool}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
        />
      )}
    </>
  );
}
