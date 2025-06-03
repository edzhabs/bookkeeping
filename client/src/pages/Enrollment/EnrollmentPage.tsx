import { LucidePlus, LucideSearch } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/custom-table";
import { DebouncedInput } from "@/components/DebouncedInput";
import { DataTableViewOptions } from "@/components/Table/Columns/column-options";
import { EnrollmentColumns } from "@/components/Table/Columns/enrollment-column";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NAVTITLE } from "@/constants/side-menu";
import { HeaderContext } from "@/context/headerContext";
import useTable from "@/hooks/useTable";
import { EnrollmentTable } from "@/types/enrollment";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchEnrollments } from "@/services/enrollments";
import { EnrollmentTypeModal } from "@/components/enrollment-type-modal";
import { ErrorComponent } from "@/components/Errors/error";
import { useLoading } from "@/context/loading-prover";
import CONSTANTS from "@/constants/constants";

const visibleColumns = {
  full_name: true,
  type: false,
  gender: false,
  grade_level: true,
  school_year: true,
  discount: true,
  total_tuition_amount_due: true,
  total_tuition_paid: true,
  tuition_balance: true,
  tuition_payment_status: true,
};

export default function EnrollmentPage() {
  const header = useContext(HeaderContext);
  const navigate = useNavigate();
  const { hideLoading } = useLoading();

  const [schoolYears, setSchoolYears] = useState<string[]>([]);
  const [schoolYear, setSchoolYear] = useState("All");
  const [isEnrollmentTypeModalOpen, setIsEnrollmentTypeModalOpen] =
    useState(false);

  const {
    data: enrollments,
    isLoading,
    isError,
  } = useQuery<{
    data: EnrollmentTable[] | undefined;
  }>({
    queryKey: [CONSTANTS.QUERYKEY.ENROLLMENT],
    queryFn: fetchEnrollments,
  });

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    header.setHeaderTitle(NAVTITLE.ENROLLMENTS.title);
  }, [header]);

  useEffect(() => {
    if (enrollments?.data && schoolYears.length === 0) {
      const distinctYears = Array.from(
        new Set(enrollments?.data.map((e) => e.school_year))
      );
      setSchoolYears(distinctYears);
    }
  }, [enrollments, schoolYears]);

  const columns = useMemo(
    () => EnrollmentColumns(enrollments?.data || []),
    [enrollments?.data]
  );

  const { table } = useTable<EnrollmentTable>(
    columns,
    visibleColumns,
    enrollments?.data
  );

  const handleOpenModal = () => {
    setIsEnrollmentTypeModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEnrollmentTypeModalOpen(false);
  };

  const handleClick = (id: string) => {
    navigate("/enrollment/" + id);
  };

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

  if (isError) return <ErrorComponent />;

  return (
    <>
      <Button
        className="w-full sm:w-[180px] cursor-pointer"
        onClick={handleOpenModal}
      >
        <LucidePlus className="mr-2 h-4 w-4" />
        Enroll Student
      </Button>
      <EnrollmentTypeModal
        isOpen={isEnrollmentTypeModalOpen}
        onClose={handleCloseModal}
      />

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
