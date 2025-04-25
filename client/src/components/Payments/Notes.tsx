import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface Props<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
}

const Notes = <T extends FieldValues>({ form }: Props<T>) => {
  return (
    <FormField
      control={form.control}
      name={"notes" as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes (Optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Add any additional notes here..."
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default Notes;
