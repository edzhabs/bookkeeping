import { FileX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error))
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-8">
            <FileX className="h-12 w-12 text-slate-400" />
          </div>

          {/* Content */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold text-slate-900">404</h1>
            <h2 className="text-xl font-semibold text-slate-700">
              Page Not Found
            </h2>
            <p className="text-slate-500 leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  return <div>"unexpected error"</div>;
};

export default ErrorPage;
