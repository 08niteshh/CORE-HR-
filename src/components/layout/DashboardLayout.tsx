import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6 px-4 lg:px-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};
