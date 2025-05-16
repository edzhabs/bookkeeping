import type { ActivityLogItem } from "@/types/activity-log"

// In a real application, this would be connected to a database
const activityLogs: ActivityLogItem[] = []

interface LogActivityParams {
  action: "Created" | "Updated" | "Deleted" | "Viewed"
  entityType: "Student" | "Tuition" | "Carpool"
  entityId: string
  details: string
  user?: string
}

export function logActivity(params: LogActivityParams): void {
  const { action, entityType, entityId, details, user = "Admin User" } = params

  const logItem: ActivityLogItem = {
    id: Date.now().toString(),
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    user,
    details,
  }

  activityLogs.push(logItem)
  console.log("Activity logged:", logItem)

  // In a real application, this would be saved to a database
}

export function getActivityLogs(filters?: {
  entityType?: "Student" | "Tuition" | "Carpool"
  entityId?: string
  action?: "Created" | "Updated" | "Deleted" | "Viewed"
}): ActivityLogItem[] {
  if (!filters)
    return [...activityLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return activityLogs
    .filter((log) => {
      if (filters.entityType && log.entityType !== filters.entityType) return false
      if (filters.entityId && log.entityId !== filters.entityId) return false
      if (filters.action && log.action !== filters.action) return false
      return true
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
