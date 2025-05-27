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

export const displayDiscounts = (discounts: string[]) => {
  if (discounts.length <= 0) return "None";
  const labels: string[] = [];
  discounts.map((discount) => {
    if (discount === "rank_1") {
      labels.push("Quipper/Books");
    }
    if (discount === "sibling") {
      labels.push("Siblings");
    }
    if (discount === "full_year") {
      labels.push("Full Payment");
    }
    if (discount === "scholar") {
      labels.push("Scholar");
    }
  });

  return labels.join(", ");
};

export const formatDisplayGradeLevel = (grade_level: string) => {
  return grade_level
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getStudentDisplayName = (
  student:
    | {
        first_name: string;
        middle_name: string;
        last_name: string;
        suffix: string;
      }
    | undefined
) => {
  return `${student?.last_name}, ${student?.first_name} ${
    student?.middle_name || ""
  } ${student?.suffix || ""}`.trim();
};
