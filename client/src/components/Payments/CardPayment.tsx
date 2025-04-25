import { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

const CardPayment = ({ title, description, children }: Props) => {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardPayment;
