import { TabsList, TabsTrigger } from "../ui/tabs";

const EnrollmentTabLists = ({ data }: { data: object | null }) => {
  return (
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="student">Student Information</TabsTrigger>
      <TabsTrigger value="fees" disabled={!data}>
        Fees & Discounts
      </TabsTrigger>
      <TabsTrigger value="tuition" disabled={!data}>
        Tuition Summary
      </TabsTrigger>
    </TabsList>
  );
};

export default EnrollmentTabLists;
