const CONSTANTS = {
  SCHOOL: "Talisay Mind Power Creativity Center, Inc.",
  STALETIME: 60 * 30000, // 30min
  RETRY: 3,
  GENDER: ["Male", "Female"],
  PAYMENTMETHODS: [
    {
      label: "Cash",
      value: "cash",
    },
    {
      label: "G-Cash",
      value: "g-cash",
    },
    {
      label: "Bank",
      value: "bank",
    },
  ],
  GRADELEVELS: [
    "nursery-1",
    "nursery-2",
    "kinder-1",
    "kinder-2",
    "grade-1",
    "grade-2",
    "grade-3",
    "grade-4",
    "grade-5",
    "grade-6",
    "grade-7",
  ] as const,
  CATEGORIES: [
    {
      label: "Enrollment Fee",
      value: "enrollment_fee",
    },
    {
      label: "PTA Fee",
      value: "pta_fee",
    },
    {
      label: "Misc Fee",
      value: "misc_fee",
    },
    {
      label: "Quipper LMS and Books Fee",
      value: "lms_fee",
    },
    {
      label: "P.E Shirt",
      value: "pe_shirt",
    },
    {
      label: "P.E Pants",
      value: "pe_pants",
    },
    {
      label: "I.D",
      value: "id",
    },
    {
      label: "Patch",
      value: "patch",
    },
    {
      label: "Carpool",
      value: "carpool",
    },
    {
      label: "Others",
      value: "others",
    },
  ],
  QUERYKEY: {
    ENROLLMENT: "enrollment",
    STUDENTS: "students",
    TUITIONS: "tuitions",
    TUITIONDROPDOWN: "tuitions_dropdown",
    OTHERS: "others",
    PAYMENTS: "payments",
  },
  STORAGEKEY: {
    ENROLLMENTABLE: "enrollmentTable",
  },
};

export default CONSTANTS;
