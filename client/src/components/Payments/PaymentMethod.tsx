import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

// Add these imports at the top of the file

interface Props<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

const typesOfMethod = [
  { label: "Cash", value: "cash" },
  { label: "GCash", value: "gcash" },
  { label: "Bank Transfer", value: "bank" },
];

const PaymentMethod = <T extends FieldValues>({ form }: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={"paymentMethod" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payment Method</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {typesOfMethod.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-1">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default PaymentMethod;
