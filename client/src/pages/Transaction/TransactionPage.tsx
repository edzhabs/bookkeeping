import { DataTable } from "@/components/custom-table";
import { DebouncedInput } from "@/components/DebouncedInput";
import { DataTableViewOptions } from "@/components/Table/Columns/column-options";
import { TransactionColumns } from "@/components/Table/Columns/transaction-column";
import { Button } from "@/components/ui/button";
import CONSTANTS from "@/constants/constants";
import { NAVTITLE } from "@/constants/side-menu";
import { HeaderContext } from "@/context/headerContext";
import { useLoading } from "@/context/loading-prover";
import useTable from "@/hooks/useTable";
import { fetchTransactions } from "@/services/transactions";
import { TransactionTable } from "@/types/transactions";
import { useQuery } from "@tanstack/react-query";
import { LucidePlus, LucideSearch } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const visibleColumns = {
  invoice_number: true,
  full_name: true,
  category: true,
  payment_date: true,
  amount: true,
  payment_method: true,
};

export default function TransactionsPage() {
  const header = useContext(HeaderContext);
  const navigate = useNavigate();
  const { hideLoading } = useLoading();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Tuition" | "Carpool">(
    "All"
  );

  const savedState =
    typeof window !== "undefined"
      ? JSON.parse(
          localStorage.getItem(CONSTANTS.STORAGEKEY.TRANSACTIONTABLE) || "{}"
        )
      : {};

  const {
    data: transactions,
    isLoading,
    isError,
  } = useQuery<{
    data: TransactionTable[] | undefined;
  }>({
    queryKey: [CONSTANTS.QUERYKEY.TRANSACTIONS],
    queryFn: fetchTransactions,
  });

  const columns = useMemo(
    () => TransactionColumns(transactions?.data || []),
    [transactions?.data]
  );

  const { table } = useTable<TransactionTable>(
    columns,
    visibleColumns,
    transactions?.data,
    CONSTANTS.STORAGEKEY.TRANSACTIONTABLE
  );

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  useEffect(() => {
    header.setHeaderTitle(NAVTITLE.TRANSACTIONS.title);
  }, [header]);

  const handleOpenModal = () => {
    // setIsEnrollmentTypeModalOpen(true);
  };

  const handleCloseModal = () => {
    // setIsEnrollmentTypeModalOpen(false);
  };

  const handleClick = (id: string) => {
    navigate("/transactions/" + id);
  };

  const handleViewTransaction = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`);
  };

  const handleSearch = (value: string) => {
    table.getColumn("full_name")?.setFilterValue(value ?? "");
  };

  return (
    <>
      <Button
        className="w-full sm:w-[180px] cursor-pointer"
        onClick={handleOpenModal}
      >
        <LucidePlus className="mr-2 h-4 w-4" />
        Add Payment
      </Button>

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
