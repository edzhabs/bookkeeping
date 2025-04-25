import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface Props<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

const InvoiceNumber = <T extends FieldValues>({ form }: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={"salesInvoiceNo" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sales Invoice No.</FormLabel>
          <FormControl>
            <Input placeholder="Enter receipt number" {...field} />
          </FormControl>
          <div className="h-1">
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default InvoiceNumber;
