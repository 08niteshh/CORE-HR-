import { useAppSelector } from '@/store/hooks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  CheckCircle,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmployeeProfile = () => {
  const { user } = useAppSelector(state => state.auth);
  const { employees } = useAppSelector(state => state.employees);

  // Find employee data linked to user (simulated - using first employee for demo)
  const employeeData = employees.find(e => e.email === user?.email) || employees[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">View and manage your personal information</p>
          </div>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div variants={itemVariants} className="stat-card">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-4xl">
                {employeeData?.firstName?.[0]}{employeeData?.lastName?.[0]}
              </span>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold">
                {employeeData?.firstName} {employeeData?.lastName}
              </h2>
              <p className="text-lg text-muted-foreground">{employeeData?.designation}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  {employeeData?.department}
                </span>
                <span className={`status-badge ${
                  employeeData?.status === 'active' ? 'status-active' :
                  employeeData?.status === 'onboarding' ? 'status-onboarding' :
                  'status-exit'
                }`}>
                  {employeeData?.status}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <motion.div variants={itemVariants} className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-medium">{employeeData?.firstName} {employeeData?.lastName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{employeeData?.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{employeeData?.phone}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-medium font-mono">EMP-{employeeData?.id?.padStart(4, '0')}</span>
              </div>
            </div>
          </motion.div>

          {/* Job Information */}
          <motion.div variants={itemVariants} className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Job Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{employeeData?.department}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Designation</span>
                <span className="font-medium">{employeeData?.designation}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Join Date</span>
                <span className="font-medium">
                  {employeeData?.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Status</span>
                <span className={`status-badge ${
                  employeeData?.status === 'active' ? 'status-active' :
                  employeeData?.status === 'onboarding' ? 'status-onboarding' :
                  'status-exit'
                }`}>
                  {employeeData?.status}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Compensation */}
          <motion.div variants={itemVariants} className="stat-card md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Compensation</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Annual Salary</p>
                <p className="text-2xl font-bold mt-1">
                  ${employeeData?.salary?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Monthly Gross</p>
                <p className="text-2xl font-bold mt-1">
                  ${Math.round((employeeData?.salary || 0) / 12).toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Pay Frequency</p>
                <p className="text-2xl font-bold mt-1">Monthly</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
