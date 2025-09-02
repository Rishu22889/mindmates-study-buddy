import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="text-8xl md:text-9xl font-bold text-primary mb-8">404</div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for seems to have wandered off to a different study session.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="btn-primary" onClick={() => window.history.go(-1)}>
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
          <Button variant="outline" className="btn-secondary" asChild>
            <a href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
