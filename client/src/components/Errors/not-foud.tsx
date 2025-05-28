import {
  UserX,
  ArrowLeft,
  Users,
  FileText,
  CreditCard,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface RecordNotFoundProps {
  entityType?:
    | "student"
    | "tuition"
    | "payment"
    | "transaction"
    | "carpool"
    | "record";
  entityName?: string;
  backHref?: string;
  listHref?: string;
}

const entityConfig = {
  student: {
    icon: UserX,
    title: "Student Not Found",
    description:
      "The student record you're looking for doesn't exist or has been removed.",
    listLabel: "View All Students",
    listHref: "/enrollment",
  },
  tuition: {
    icon: FileText,
    title: "Tuition Record Not Found",
    description:
      "The tuition record you're looking for doesn't exist or has been removed.",
    listLabel: "View All Tuitions",
    listHref: "/tuitions",
  },
  payment: {
    icon: CreditCard,
    title: "Payment Not Found",
    description:
      "The payment record you're looking for doesn't exist or has been removed.",
    listLabel: "View All Payments",
    listHref: "/transactions",
  },
  transaction: {
    icon: CreditCard,
    title: "Transaction Not Found",
    description:
      "The transaction record you're looking for doesn't exist or has been removed.",
    listLabel: "View All Transactions",
    listHref: "/transactions",
  },
  carpool: {
    icon: Car,
    title: "Carpool Record Not Found",
    description:
      "The carpool record you're looking for doesn't exist or has been removed.",
    listLabel: "View All Carpools",
    listHref: "/carpool",
  },
  record: {
    icon: FileText,
    title: "Record Not Found",
    description:
      "The record you're looking for doesn't exist or has been removed.",
    listLabel: "Go Back",
    listHref: "/",
  },
};

export function NotFoundComponent({
  entityType = "record",
  entityName,
  backHref,
  listHref,
}: RecordNotFoundProps) {
  const config = entityConfig[entityType];
  const IconComponent = config.icon;
  const finalListHref = listHref || config.listHref;
  const finalBackHref = backHref || finalListHref;

  return (
    <div className="container py-8 sm:py-16">
      <div className="max-w-md mx-auto text-center">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <IconComponent className="h-10 w-10 text-slate-400" />
        </div>

        {/* Content */}
        <div className="space-y-3 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{config.title}</h1>
          {entityName && (
            <p className="text-lg font-medium text-slate-600">"{entityName}"</p>
          )}
          <p className="text-slate-500 leading-relaxed">{config.description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto text-slate-600 border-slate-300 hover:bg-slate-50"
          >
            <Link to={finalBackHref}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link to={finalListHref}>
              <Users className="mr-2 h-4 w-4" />
              {config.listLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
