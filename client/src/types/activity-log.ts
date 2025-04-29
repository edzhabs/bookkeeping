export interface ActivityLogItem {
  id: string
  action: "Created" | "Updated" | "Deleted" | "Viewed"
  entityType: "Student" | "Tuition" | "Carpool"
  entityId: string
  timestamp: string
  user: string
  details: string
}
