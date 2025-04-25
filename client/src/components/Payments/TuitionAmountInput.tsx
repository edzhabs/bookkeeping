import { cn } from "@/lib/utils";
import { WeightIcon as Peso } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface Props<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  label: string;
  name: string;
}

const AmountInput = <T extends FieldValues>({
  form,
  label,
  name,
}: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className={cn(
              form.formState.errors.fees ? "text-destructive" : "" // Apply red to label when fees error is present
            )}
          >
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Peso className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0.00"
                className={cn(
                  "pl-9",
                  form.formState.errors.fees && "border-destructive"
                )}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("fees" as Path<T>);
                }}
              />
            </div>
          </FormControl>
          <div className="h-1">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default AmountInput;
