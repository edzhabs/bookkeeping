import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div>
      {isRouteErrorResponse(error) ? "Page does not exist" : "unexpected error"}
    </div>
  );
};

export default ErrorPage;
