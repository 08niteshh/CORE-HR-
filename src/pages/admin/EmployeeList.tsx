import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { deleteEmployee, updateEmployeeStatus } from '@/store/slices/employeesSlice';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Employee, EmployeeStatus } from '@/types';

const EmployeeList = () => {
  const { employees } = useAppSelector(state => state.employees);
  const dispatch = useAppDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const departments = useMemo(() => {
    return [...new Set(employees.map(e => e.department))];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, searchTerm, statusFilter, departmentFilter]);

  const handleDelete = () => {
    if (selectedEmployee) {
      dispatch(deleteEmployee(selectedEmployee.id));
      toast.success('Employee deleted successfully');
      setShowDeleteDialog(false);
      setSelectedEmployee(null);
    }
  };

  const handleStatusChange = (employee: Employee, status: EmployeeStatus) => {
    dispatch(updateEmployeeStatus({ id: employee.id, status }));
    toast.success(`Status updated to ${status}`);
  };

  const getStatusIcon = (status: EmployeeStatus) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'onboarding': return <Clock className="w-4 h-4" />;
      case 'exit': return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employees</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their information
            </p>
          </div>
          <Link
            to="/admin/add-employee"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </Link>
        </div>

        {/* Filters */}
        <div className="stat-card">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as EmployeeStatus | 'all')}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="onboarding">Onboarding</option>
                <option value="exit">Exit</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
          </div>
        </div>

        {/* Table */}
        <div className="stat-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-muted/50">
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent font-semibold text-sm">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{employee.department}</td>
                    <td>{employee.designation}</td>
                    <td>
                      <span className={`status-badge inline-flex items-center gap-1.5 ${
                        employee.status === 'active' ? 'status-active' :
                        employee.status === 'onboarding' ? 'status-onboarding' :
                        'status-exit'
                      }`}>
                        {getStatusIcon(employee.status)}
                        <span className="capitalize">{employee.status}</span>
                      </span>
                    </td>
                    <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                    <td className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowViewDialog(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/edit-employee/${employee.id}`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(employee, 'active')}
                            disabled={employee.status === 'active'}
                          >
                            <CheckCircle className="w-4 h-4 mr-2 text-success" />
                            Set Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(employee, 'onboarding')}
                            disabled={employee.status === 'onboarding'}
                          >
                            <Clock className="w-4 h-4 mr-2 text-info" />
                            Set Onboarding
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(employee, 'exit')}
                            disabled={employee.status === 'exit'}
                          >
                            <AlertCircle className="w-4 h-4 mr-2 text-warning" />
                            Set Exit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowDeleteDialog(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No employees found matching your criteria.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-bold text-xl">
                    {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedEmployee.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedEmployee.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`status-badge ${
                    selectedEmployee.status === 'active' ? 'status-active' :
                    selectedEmployee.status === 'onboarding' ? 'status-onboarding' :
                    'status-exit'
                  }`}>
                    {selectedEmployee.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-medium">${selectedEmployee.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{new Date(selectedEmployee.joiningDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.firstName} {selectedEmployee?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmployeeList;
