import { format } from "date-fns";
import { IStudentFullName } from "./types/student";

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

export const formatDiscount = (discount: string) => {
  if (discount === "rank_1") {
    return "Quipper/Books";
  }
  if (discount === "sibling") {
    return "Siblings";
  }
  if (discount === "full_year") {
    return "Full Payment";
  }
  if (discount === "scholar") {
    return "Scholar";
  }
};

export const formatDisplayGradeLevel = (grade_level: string) => {
  return grade_level
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatFullNameLastFirst = (student: IStudentFullName) => {
  return `${student?.last_name}, ${student?.first_name} ${
    student?.middle_name || ""
  } ${student?.suffix || ""}`.trim();
};

export const formatFullName = (student: IStudentFullName) => {
  return `${student.first_name} ${
    student.middle_name ? student.middle_name + " " : ""
  }${student.last_name} ${student.suffix}`.trim();
};

export const getPaymentStatus = (total_amount: string, total_paid: string) => {
  if (Number(total_amount) <= Number(total_paid)) {
    return "paid";
  } else if (Number(total_paid) <= 0) {
    return "unpaid";
  } else {
    return "partial";
  }
};

export const displayCategories = (categories: string[]) => {
  if (categories.length <= 0) return;
  const labels: string[] = [];
  categories.map((category) => {
    labels.push(formatCategory(category));
  });

  return labels.join(", ");
};

export const formatCategory = (text: string) => {
  if (text === "lms_fee") {
    return "Quipper/Books ";
  } else if (text === "id") {
    return "School ID";
  } else {
    return text
      .split("_") // Split by underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" "); // Join with space
  }
};
