import {
  LucideBook,
  LucideCar,
  LucideDollarSign,
  LucideUsers,
  LucideFileText,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import DemoLoading from "@/components/demo-loading";

export default function DashboardPage() {
  return (
    <div className="container py-8 w-full max-w-full px-4 md:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <DemoLoading />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/enrollment" className="transition-transform hover:scale-105">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Enrollment</CardTitle>
              <LucideBook className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage student enrollment and records
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link to="/tuitions" className="transition-transform hover:scale-105">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Tuitions</CardTitle>
              <LucideDollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage tuition payments and records
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link to="/carpool" className="transition-transform hover:scale-105">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Carpool</CardTitle>
              <LucideCar className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage carpool arrangements and payments
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link
          to="/transactions"
          className="transition-transform hover:scale-105"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">
                Transactions
              </CardTitle>
              <LucideFileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                View and manage all payment transactions
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Link to="#" className="transition-transform hover:scale-105">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium">Users</CardTitle>
              <LucideUsers className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage system users and permissions
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Latest student enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">
                    Grade 10 • Enrolled today
                  </p>
                </div>
                <Link
                  to="/enrollment/1"
                  className="text-sm text-primary hover:underline"
                >
                  View
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emma Smith</p>
                  <p className="text-sm text-muted-foreground">
                    Grade 8 • Enrolled yesterday
                  </p>
                </div>
                <Link
                  to="/enrollment/2"
                  className="text-sm text-primary hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">TUI-2023-015</p>
                  <p className="text-sm text-muted-foreground">
                    ₱25,000 • John Doe
                  </p>
                </div>
                <Link
                  to="/transactions/p2"
                  className="text-sm text-primary hover:underline"
                >
                  View
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">CAR-2023-001</p>
                  <p className="text-sm text-muted-foreground">
                    ₱2,000 • John Doe
                  </p>
                </div>
                <Link
                  to="/transactions/cp1"
                  className="text-sm text-primary hover:underline"
                >
                  View
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
