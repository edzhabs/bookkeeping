import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import type { StudentDropdown } from "@/types/student";
import { formatFullNameLastFirst } from "@/utils";

interface StudentComboboxProps {
  students: StudentDropdown[] | undefined;
  selectedValue: string;
  isLoading: boolean;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function StudentCombobox({
  students,
  selectedValue,
  isLoading,
  onValueChange,
  placeholder = "Select a student...",
}: StudentComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedStudent = students?.find(
    (student) => student.id === selectedValue
  );

  const getStudentSearchValue = (student: StudentDropdown) => {
    return `${student.first_name} ${student.middle_name || ""} ${
      student.last_name
    } ${student.suffix || ""} ${student.grade_level} ${
      student.school_year
    }`.toLowerCase();
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
          disabled={isLoading}
        >
          {selectedValue ? (
            <div className="flex flex-col items-start">
              <span className="font-medium">
                {formatFullNameLastFirst(selectedStudent)}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {selectedStudent?.grade_level} • {selectedStudent?.school_year}
              </span>
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
            placeholder="Search students..."
            className="flex-1 border-0 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>No student found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-y-auto">
              {students?.map((student) => (
                <CommandItem
                  key={student.id}
                  value={getStudentSearchValue(student)}
                  onSelect={() => {
                    onValueChange(student.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === student.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {formatFullNameLastFirst(student)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{student.grade_level}</span>
                      <span>•</span>
                      <span>{student.school_year}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {student.address}
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
