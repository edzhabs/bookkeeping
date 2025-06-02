// src/types/react-table.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  export interface ColumnMeta<TData, TValue> {
    name: string;
  }
}
