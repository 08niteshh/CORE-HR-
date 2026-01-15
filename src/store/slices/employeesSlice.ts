import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee, EmployeeStatus } from '@/types';

const EMPLOYEES_KEY = 'corehr_employees';

const defaultEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    designation: 'Senior Developer',
    salary: 95000,
    joiningDate: '2023-01-15',
    status: 'active',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    designation: 'Marketing Manager',
    salary: 85000,
    joiningDate: '2023-03-20',
    status: 'active',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Sales',
    designation: 'Sales Representative',
    salary: 65000,
    joiningDate: '2023-06-01',
    status: 'active',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '+1 (555) 456-7890',
    department: 'Human Resources',
    designation: 'HR Coordinator',
    salary: 55000,
    joiningDate: '2024-01-02',
    status: 'onboarding',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@company.com',
    phone: '+1 (555) 567-8901',
    department: 'Engineering',
    designation: 'Junior Developer',
    salary: 60000,
    joiningDate: '2022-08-15',
    status: 'exit',
    createdAt: '2022-08-15T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: '6',
    firstName: 'Jessica',
    lastName: 'Martinez',
    email: 'jessica.martinez@company.com',
    phone: '+1 (555) 678-9012',
    department: 'Finance',
    designation: 'Financial Analyst',
    salary: 75000,
    joiningDate: '2023-09-10',
    status: 'active',
    createdAt: '2023-09-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '7',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@company.com',
    phone: '+1 (555) 789-0123',
    department: 'Engineering',
    designation: 'Tech Lead',
    salary: 120000,
    joiningDate: '2021-05-20',
    status: 'active',
    createdAt: '2021-05-20T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '8',
    firstName: 'Amanda',
    lastName: 'Anderson',
    email: 'amanda.anderson@company.com',
    phone: '+1 (555) 890-1234',
    department: 'Marketing',
    designation: 'Content Strategist',
    salary: 70000,
    joiningDate: '2024-01-08',
    status: 'onboarding',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
];

const loadEmployees = (): Employee[] => {
  const employeesStr = localStorage.getItem(EMPLOYEES_KEY);
  if (employeesStr) {
    return JSON.parse(employeesStr);
  }
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(defaultEmployees));
  return defaultEmployees;
};

const saveEmployees = (employees: Employee[]) => {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
};

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  selectedEmployee: Employee | null;
}

const initialState: EmployeesState = {
  employees: loadEmployees(),
  loading: false,
  error: null,
  selectedEmployee: null,
};

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addEmployee: (state, action: PayloadAction<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const newEmployee: Employee = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.employees.push(newEmployee);
      saveEmployees(state.employees);
    },
    updateEmployee: (state, action: PayloadAction<{ id: string; updates: Partial<Employee> }>) => {
      const index = state.employees.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = {
          ...state.employees[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
        saveEmployees(state.employees);
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(e => e.id !== action.payload);
      saveEmployees(state.employees);
    },
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
    updateEmployeeStatus: (state, action: PayloadAction<{ id: string; status: EmployeeStatus }>) => {
      const index = state.employees.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index].status = action.payload.status;
        state.employees[index].updatedAt = new Date().toISOString();
        saveEmployees(state.employees);
      }
    },
  },
});

export const {
  setLoading,
  setError,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setSelectedEmployee,
  updateEmployeeStatus,
} = employeesSlice.actions;

export default employeesSlice.reducer;
