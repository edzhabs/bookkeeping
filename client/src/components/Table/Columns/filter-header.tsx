import { useState } from "react";
import { Column } from "@tanstack/react-table";
import { Check, Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnFilterProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  options: string[]; // e.g., ['Male', 'Female']
}

export function DataTableColumnFilter<TData, TValue>({
  column,
  title,
  options,
  className,
}: DataTableColumnFilterProps<TData, TValue>) {
  const [selected, setSelected] = useState<string[]>(
    (column.getFilterValue() as []) || []
  );

  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];

    setSelected(newSelected);
    column.setFilterValue(newSelected.length ? newSelected : undefined);
  };

  const clear = () => {
    setSelected([]);
    column.setFilterValue(undefined);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent cursor-pointer"
          >
            <span>{title}</span>
            <Filter className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {options.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => toggleOption(option)}
              className="flex items-center justify-between"
            >
              {option}
              {selected.includes(option) && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={clear}>
            <X className="h-4 w-4 text-muted-foreground/70 mr-2" />
            Clear Filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
