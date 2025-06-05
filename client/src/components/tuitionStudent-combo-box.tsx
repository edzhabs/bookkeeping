import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TuitionDropdown } from "@/types/tuition";

interface TuitionStudentComboboxProps {
  tuitions: TuitionDropdown[] | undefined;
  selectedValue: string;
  isLoading: boolean;
  isDisabled: boolean;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function TuitionStudentCombobox({
  tuitions,
  selectedValue,
  isLoading,
  isDisabled,
  onValueChange,
  placeholder = "Select a student...",
}: TuitionStudentComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedStudent = tuitions?.find(
    (tuition) => tuition.student_id === selectedValue
  );

  const getStudentSearchValue = (tuition: TuitionDropdown) => {
    return tuition.full_name;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !selectedValue && "text-muted-foreground"
          )}
          disabled={isLoading || isDisabled}
        >
          {selectedValue ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">{selectedStudent?.full_name}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search tuitions..."
            className="flex-1 border-0 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>No student found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {tuitions?.map((tuition, index) => (
                <CommandItem
                  key={index}
                  value={getStudentSearchValue(tuition)}
                  onSelect={() => {
                    onValueChange(tuition.student_id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === tuition.student_id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {tuition.full_name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {tuition.address}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
