export type UserRole = 'admin' | 'employee';

export type EmployeeStatus = 'active' | 'onboarding' | 'exit';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  employeeId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: EmployeeStatus;
  avatar?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  headId?: string;
}

export interface AnalyticsData {
  totalEmployees: number;
  activeEmployees: number;
  onboardingEmployees: number;
  exitEmployees: number;
  departmentDistribution: Record<string, number>;
  monthlyJoiners: { month: string; count: number }[];
  salaryDistribution: { range: string; count: number }[];
  exitRatio: number;
}
