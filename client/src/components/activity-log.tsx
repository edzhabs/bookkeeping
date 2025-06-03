"use client";

import type { ActivityLogItem } from "@/types/activity-log";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TabsContent } from "./ui/tabs";

interface ActivityLogProps {
  activityLogs: ActivityLogItem[];
}

export function ActivityLog({ activityLogs }: ActivityLogProps) {
  return (
    <TabsContent value="activity" className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            History of actions performed on this tuition record
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {!activityLogs || activityLogs.length === 0 ? (
            <div className="text-center py-8 px-6">
              <p className="text-muted-foreground">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white border-b z-10">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">
                        Action
                      </th>
                      <th className="text-left p-4 font-medium text-sm">
                        Date & Time
                      </th>
                      <th className="text-left p-4 font-medium text-sm hidden md:table-cell">
                        User
                      </th>
                      <th className="text-left p-4 font-medium text-sm">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log, index) => (
                      <tr
                        key={log.id}
                        className={`border-b hover:bg-gray-50 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              log.action === "Created"
                                ? "border-green-500 text-green-700 bg-green-50"
                                : log.action === "Updated"
                                ? "border-blue-500 text-blue-700 bg-blue-50"
                                : log.action === "Viewed"
                                ? "border-gray-500 text-gray-700 bg-gray-50"
                                : "border-purple-500 text-purple-700 bg-purple-50"
                            }`}
                          >
                            {log.action}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">
                          {log.user || "N/A"}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground max-w-xs lg:max-w-md truncate">
                          {log.details || "No details available"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
