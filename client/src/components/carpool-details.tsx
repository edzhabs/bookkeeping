"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ActivityLog } from "@/components/activity-log"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Carpool } from "@/types/carpool"
import type { ActivityLogItem } from "@/types/activity-log"

interface CarpoolDetailsProps {
  carpool: Carpool
  isOpen: boolean
  onClose: () => void
}

// Sample activity log data
const sampleActivityLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Carpool",
    entityId: "1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Carpool record was created",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Carpool",
    entityId: "1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Payment status updated to Paid",
  },
]

export function CarpoolDetails({ carpool, isOpen, onClose }: CarpoolDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carpool Details</DialogTitle>
          <DialogDescription>Detailed information about {carpool.studentName}'s carpool arrangement</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Carpool Information</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Carpool Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Student Name</p>
                  <p className="text-sm text-muted-foreground">{carpool.studentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Route</p>
                  <p className="text-sm text-muted-foreground">{carpool.route}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Driver</p>
                  <p className="text-sm text-muted-foreground">{carpool.driver}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fee</p>
                  <p className="text-sm text-muted-foreground">₱{carpool.fee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={carpool.status === "Active" ? "outline" : "secondary"} className="mt-1">
                    {carpool.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <Badge variant={carpool.paymentStatus === "Paid" ? "success" : "destructive"} className="mt-1">
                    {carpool.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {carpool.payments && carpool.payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="hidden md:table-cell">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {carpool.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell>₱{payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.method}</TableCell>
                          <TableCell className="hidden md:table-cell">{payment.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No payment records found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <ActivityLog logs={sampleActivityLogs.filter((log) => log.entityId === carpool.id)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
