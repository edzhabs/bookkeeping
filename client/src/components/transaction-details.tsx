"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Tuition, Payment } from "@/types/tuition"
import type { Carpool } from "@/types/carpool"
import type { ActivityLogItem } from "@/types/activity-log"

// Sample activity logs for a specific transaction
const sampleTransactionLogs: ActivityLogItem[] = [
  {
    id: "1",
    action: "Created",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date().toISOString(),
    user: "Admin User",
    details: "Created payment record",
  },
  {
    id: "2",
    action: "Updated",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    user: "Admin User",
    details: "Updated payment method from Cash to Bank Transfer",
  },
  {
    id: "3",
    action: "Viewed",
    entityType: "Payment",
    entityId: "p1",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    user: "Admin User",
    details: "Viewed payment details",
  },
]

interface TransactionDetailsProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    id: string
    invoiceNumber: string
    studentName: string
    amount: number
    date: string
    method: string
    notes?: string
    type: "Tuition" | "Carpool"
    parentId: string
    originalPayment: Payment | any
    parentRecord: Tuition | Carpool
  }
}

export function TransactionDetails({ isOpen, onClose, transaction }: TransactionDetailsProps) {
  const isTuition = transaction.type === "Tuition"
  const tuitionPayment = isTuition ? (transaction.originalPayment as Payment) : null
  const parentRecord = transaction.parentRecord

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Details for invoice {transaction.invoiceNumber} ({transaction.type})
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Transaction Details</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 pt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Invoice Number</p>
                    <p className="text-sm text-muted-foreground">{transaction.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <Badge variant={isTuition ? "default" : "secondary"}>{transaction.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Student</p>
                    <p className="text-sm text-muted-foreground">{transaction.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Amount</p>
                    <p className="text-sm text-muted-foreground">₱{transaction.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">{transaction.method}</p>
                  </div>
                  {transaction.notes && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">{transaction.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {isTuition && tuitionPayment && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Payment Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Reservation Fee:</p>
                      <p className="text-sm font-medium">₱{tuitionPayment.reservationFee.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Tuition Fee:</p>
                      <p className="text-sm font-medium">₱{tuitionPayment.tuitionFee.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Advance Payment:</p>
                      <p className="text-sm font-medium">₱{tuitionPayment.advancePayment.toLocaleString()}</p>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <p className="text-sm font-medium">Total:</p>
                      <p className="text-sm font-bold">₱{tuitionPayment.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Related {transaction.type} Record</h3>
                <div className="grid grid-cols-2 gap-4">
                  {isTuition ? (
                    <>
                      <div>
                        <p className="text-sm font-medium">School Year</p>
                        <p className="text-sm text-muted-foreground">{(parentRecord as Tuition).schoolYear}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Grade Level</p>
                        <p className="text-sm text-muted-foreground">{(parentRecord as Tuition).gradeLevel}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Total Tuition</p>
                        <p className="text-sm text-muted-foreground">
                          ₱{(parentRecord as Tuition).totalAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Remaining Balance</p>
                        <p className="text-sm text-muted-foreground">
                          ₱{(parentRecord as Tuition).remainingBalance.toLocaleString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-medium">Route</p>
                        <p className="text-sm text-muted-foreground">{(parentRecord as Carpool).route}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Driver</p>
                        <p className="text-sm text-muted-foreground">{(parentRecord as Carpool).driver}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Fee</p>
                        <p className="text-sm text-muted-foreground">
                          ₱{(parentRecord as Carpool).fee.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">{(parentRecord as Carpool).status}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="pt-4">
            <Card>
              <CardContent className="pt-6">
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
                    {sampleTransactionLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
