import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { ActivityLogItem } from "@/types/activity-log";

// Sample activity logs for demonstration
const sampleActivityLogs: ActivityLogItem[] = [
  // Student logs
  {
    id: "1",
    action: "Created",
    entityType: "Student",
    entityId: "1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Created student record for John Doe",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Student",
    entityId: "1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Updated student information",
  },
  {
    id: "3",
    action: "Viewed",
    entityType: "Student",
    entityId: "2",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: "Admin User",
    details: "Viewed student details for Emma Smith",
  },

  // Tuition logs
  {
    id: "4",
    action: "Created",
    entityType: "Tuition",
    entityId: "1",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    user: "Admin User",
    details: "Created tuition record for John Doe",
  },
  {
    id: "5",
    action: "Updated",
    entityType: "Tuition",
    entityId: "1",
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    user: "Admin User",
    details: "Updated payment status to Partial",
  },
  {
    id: "6",
    action: "Created",
    entityType: "Tuition",
    entityId: "3",
    timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    user: "Admin User",
    details: "Created tuition record for Michael Johnson",
  },

  // Payment logs
  {
    id: "7",
    action: "Created",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    user: "Admin User",
    details: "Created payment record for John Doe",
  },
  {
    id: "8",
    action: "Updated",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    user: "Admin User",
    details: "Updated payment method from Cash to Bank Transfer",
  },

  // Carpool logs
  {
    id: "9",
    action: "Created",
    entityType: "Carpool",
    entityId: "1",
    timestamp: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
    user: "Admin User",
    details: "Created carpool record for John Doe",
  },
  {
    id: "10",
    action: "Updated",
    entityType: "Carpool",
    entityId: "1",
    timestamp: new Date(Date.now() - 777600000).toISOString(), // 9 days ago
    user: "Admin User",
    details: "Updated payment status to Paid",
  },
];

type SortField = "timestamp" | "action" | "entityType" | "user" | "details";
type SortDirection = "asc" | "desc";

export default function ActivityLogsPage() {
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPageIndex(0);
  };

  const filteredLogs = useMemo(() => {
    return sampleActivityLogs.filter((log) => {
      // Filter by entity type
      if (entityTypeFilter !== "all" && log.entityType !== entityTypeFilter) {
        return false;
      }

      // Filter by action
      if (actionFilter !== "all" && log.action !== actionFilter) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          log.details.toLowerCase().includes(query) ||
          log.user.toLowerCase().includes(query) ||
          log.entityType.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [entityTypeFilter, actionFilter, searchQuery]);

  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "timestamp":
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case "action":
          aValue = a.action;
          bValue = b.action;
          break;
        case "entityType":
          aValue = a.entityType;
          bValue = b.entityType;
          break;
        case "user":
          aValue = a.user;
          bValue = b.user;
          break;
        case "details":
          aValue = a.details;
          bValue = b.details;
          break;
        default:
          return 0;
      }

      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredLogs, sortField, sortDirection]);

  // Calculate pagination
  const pageCount = Math.ceil(sortedLogs.length / pageSize);
  const paginatedLogs = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return sortedLogs.slice(start, end);
  }, [sortedLogs, pageIndex, pageSize]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  // Get unique entity types and actions for filters
  const entityTypes = [
    "all",
    ...new Set(sampleActivityLogs.map((log) => log.entityType)),
  ];
  const actionTypes = [
    "all",
    ...new Set(sampleActivityLogs.map((log) => log.action)),
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by entity type" />
            </SelectTrigger>
            <SelectContent>
              {entityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Entity Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/3">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              {actionTypes.map((action) => (
                <SelectItem key={action} value={action}>
                  {action === "all" ? "All Actions" : action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("timestamp")}
                >
                  Date & Time {renderSortIcon("timestamp")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("action")}
                >
                  Action {renderSortIcon("action")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("entityType")}
                >
                  Entity Type {renderSortIcon("entityType")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("user")}
                >
                  User {renderSortIcon("user")}
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("details")}
                >
                  Details {renderSortIcon("details")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log) => (
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
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <DataTablePagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={pageCount}
            totalItems={sortedLogs.length}
            onPageChange={setPageIndex}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPageIndex(0);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
