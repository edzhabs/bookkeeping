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

interface StudentComboboxProps {
  students: StudentDropdown[];
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

  const selectedStudent = students.find(
    (student) => student.id === selectedValue
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {selectedValue
            ? `${selectedStudent?.last_name} , ${selectedStudent?.first_name} ${
                selectedStudent?.middle_name || ""
              } ${selectedStudent?.suffix || ""} (${
                selectedStudent?.grade_level
              })`
            : placeholder}
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
            <CommandGroup className="max-h-60 overflow-y-auto">
              {students.map((student) => (
                <CommandItem
                  key={student.id}
                  value={`${student.last_name} ${student.first_name} ${
                    student.middle_name || ""
                  } ${student.suffix || ""} ${student.grade_level}`}
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
                  <div className="flex flex-col">
                    <span>
                      {student.last_name}, {student.first_name}{" "}
                      {student.middle_name} {student.suffix}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {student.grade_level} ({student.school_year})
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
