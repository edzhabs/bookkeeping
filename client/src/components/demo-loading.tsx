import { Button } from "./ui/button";
import { useLoading } from "@/context/loading-prover";

const DemoLoading = () => {
  const { showLoading, hideLoading } = useLoading();
  const handleClick = () => {
    showLoading("Processing..");
    setTimeout(() => {
      hideLoading();
    }, 3000);
  };
  return <Button onClick={handleClick}>click for loading</Button>;
};

export default DemoLoading;
