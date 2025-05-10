import { format } from "date-fns";

export const capitalFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (dateString: string) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") return "N/A";
  return format(new Date(dateString), "MMMM d, yyyy 'at' h:mm a");
};

export const formatBirthDate = (dateString: string) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") return "N/A";
  return format(new Date(dateString), "MMMM d, yyyy");
};

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
};

export const formatToCurrency = (value: number | string) => {
  const number = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(number);
};
