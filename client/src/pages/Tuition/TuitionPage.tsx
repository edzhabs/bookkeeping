import { DebouncedInput } from "@/components/DebouncedInput";
import { ErrorComponent } from "@/components/Errors/error";
import { DataTableViewOptions } from "@/components/Table/Columns/column-options";
import { TuitionColumns } from "@/components/Table/Columns/tuition-column";
import { DataTable } from "@/components/custom-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NAVTITLE } from "@/constants/side-menu";
import { HeaderContext } from "@/context/headerContext";
import { useLoading } from "@/context/loading-prover";
import useTable from "@/hooks/useTable";
import { logActivity } from "@/lib/activity-logger";
import { fetchTuitions } from "@/services/tuitions";
import { TuitionsTable } from "@/types/tuition";
import { useQuery } from "@tanstack/react-query";
import { LucideSearch } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const visibleColumns = {
  full_name: true,
  grade_level: true,
  school_year: true,
  discount: true,
  total_amount: true,
  remaining_amount: true,
  payment_status: true,
};

export default function TuitionsPage() {
  const header = useContext(HeaderContext);
  const navigate = useNavigate();
  const { hideLoading } = useLoading();

  const [schoolYears, setSchoolYears] = useState<string[]>([]);
  const [schoolYear, setSchoolYear] = useState("All");

  const {
    data: tuitions,
    isLoading,
    isError,
  } = useQuery<{
    data: TuitionsTable[] | undefined;
  }>({
    queryKey: ["tuitions"],
    queryFn: fetchTuitions,
  });

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    header.setHeaderTitle(NAVTITLE.TUITION.title);
  }, [header]);

  useEffect(() => {
    if (tuitions?.data && schoolYears.length === 0) {
      const distinctYears = Array.from(
        new Set(tuitions?.data.map((e) => e.school_year))
      );
      setSchoolYears(distinctYears);
    }
  }, [tuitions, schoolYears]);

  const columns = useMemo(
    () => TuitionColumns(tuitions?.data || []),
    [tuitions?.data]
  );

  const { table } = useTable<TuitionsTable>(
    columns,
    visibleColumns,
    tuitions?.data
  );

  const handleSchoolYear = (value: string) => {
    setSchoolYear(value);
    if (value === "All") {
      table.getColumn("school_year")?.setFilterValue("");
    } else {
      table.getColumn("school_year")?.setFilterValue(value);
    }
  };

  const handleSearch = (value: string) => {
    table.getColumn("full_name")?.setFilterValue(value);
  };

  const handlePayment = (
    tuitionId: string,
    paymentData: {
      reservationFee: number;
      tuitionFee: number;
      advancePayment: number;
      method: string;
      invoiceNumber: string;
      date: string;
      notes: string;
    }
  ) => {
    setTuitions((prevTuitions) =>
      prevTuitions.map((tuition) => {
        if (tuition.id === tuitionId) {
          const totalAmount =
            paymentData.reservationFee +
            paymentData.tuitionFee +
            paymentData.advancePayment;

          const newPayment = {
            id: `p${Date.now()}`,
            invoiceNumber: paymentData.invoiceNumber,
            amount: totalAmount,
            date: paymentData.date,
            method: paymentData.method,
            notes: paymentData.notes,
            reservationFee: paymentData.reservationFee,
            tuitionFee: paymentData.tuitionFee,
            advancePayment: paymentData.advancePayment,
          };

          const newRemainingBalance = Math.max(
            0,
            tuition.remainingBalance - totalAmount
          );
          const newStatus =
            newRemainingBalance === 0
              ? "Paid"
              : newRemainingBalance < tuition.totalAmount
              ? "Partial"
              : "Unpaid";

          const updatedTuition = {
            ...tuition,
            status: newStatus,
            remainingBalance: newRemainingBalance,
            payments: [...(tuition.payments || []), newPayment],
          };

          logActivity({
            action: "Updated",
            entityType: "Tuition",
            entityId: tuitionId,
            details: `Payment of ₱${totalAmount} made via ${paymentData.method}. Invoice #${paymentData.invoiceNumber} generated. Status updated to ${newStatus}.`,
          });

          return updatedTuition;
        }
        return tuition;
      })
    );
    setIsPaymentFormOpen(false);
    setSelectedTuition(null);
  };

  const handleClick = (tuitionId: string) => {
    navigate(`/tuitions/${tuitionId}`);
  };

  if (isError) return <ErrorComponent />;

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-[300px]">
          <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <DebouncedInput
            type="text"
            value={
              (table.getColumn("full_name")?.getFilterValue() as string) ?? ""
            }
            placeholder="Search name.."
            onChange={handleSearch}
            className="w-full pl-10"
            disabled={isLoading}
          />
        </div>

        {/* Filter Dropdown */}
        <Select
          value={schoolYear}
          onValueChange={handleSchoolYear}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All School Years</SelectItem>
            {schoolYears.map((year, index) => (
              <SelectItem key={index} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Visibility */}
        {!isLoading && <DataTableViewOptions table={table} />}
      </div>

      <DataTable
        table={table}
        handleClick={handleClick}
        isLoading={isLoading}
      />
    </>
  );
}
