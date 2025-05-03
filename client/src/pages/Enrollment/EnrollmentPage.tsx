import { LucidePlus, LucideSearch } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NAVTITLE } from "@/constants/side-menu";
import { HeaderContext } from "@/context/headerContext";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/custom-table";
import useTable from "@/hooks/useTable";
import { EnrollmentColumns } from "@/components/Table/Columns/enrollment-column";
import { Enrollment } from "@/types/enrollment";
import { DataTableViewOptions } from "@/components/Table/Columns/column-options";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/services/api-client";

const fetchEnrollment = async (searchQuery: string) => {
  try {
    const response = await axiosClient.get("/enrollment.json", {
      params: { searchQuery: searchQuery },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching enrollment data", error);
    throw error;
  }
};

export default function EnrollmentPage() {
  const header = useContext(HeaderContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Tuition" | "Carpool">(
    "All"
  );

  const { data } = useQuery({
    queryKey: ["enrollment", searchQuery],
    queryFn: () => fetchEnrollment(searchQuery),
  });

  useEffect(() => {
    header.setHeaderTitle(NAVTITLE.ENROLLMENTS.title);
  }, [header]);

  const { table } = useTable<Enrollment>(EnrollmentColumns, data);
  const handleClick = (id: string) => {
    navigate("/enrollment/" + id);
  };

  return (
    <>
      <Button
        className="w-full sm:w-[180px]"
        onClick={() => navigate(NAVTITLE.ENROLL_STUDENT.url)}
      >
        <LucidePlus className="mr-2 h-4 w-4" />
        Enroll Student
      </Button>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-[300px]">
          <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        {/* Filter Dropdown */}
        <Select
          value={filterType}
          onValueChange={(value) =>
            setFilterType(value as "All" | "Tuition" | "Carpool")
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Transactions</SelectItem>
            <SelectItem value="Tuition">Tuition Payments</SelectItem>
            <SelectItem value="Carpool">Carpool Payments</SelectItem>
          </SelectContent>
        </Select>
        {/* Visibility */}
        <DataTableViewOptions table={table} />
      </div>

      <DataTable
        table={table}
        columns={EnrollmentColumns}
        handleClick={handleClick}
      />
      {/* <EnrollmentTable
        students={filteredStudents}
        onEdit={handleEditStudent}
        onView={handleViewStudent}
        onDelete={handleDeleteStudent}
      /> */}
    </>
  );
}
