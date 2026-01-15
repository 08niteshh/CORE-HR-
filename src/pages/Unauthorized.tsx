import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldOff, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link to="/">
          <Button className="bg-accent hover:bg-accent/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
