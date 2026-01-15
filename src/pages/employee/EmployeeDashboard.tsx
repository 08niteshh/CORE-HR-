import { useAppSelector } from '@/store/hooks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Briefcase,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const { employees } = useAppSelector(state => state.employees);

  // Find employee data linked to user (simulated)
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

  // Get current time and date
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const currentDate = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Welcome Banner */}
        <motion.div
          variants={itemVariants}
          className="stat-card bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-primary-foreground/80 mt-1">{currentDate}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5" />
              <span>Check-in: 09:00 AM</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold capitalize">{employeeData?.status || 'Active'}</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time with Company</p>
                <p className="text-lg font-semibold">
                  {employeeData ? 
                    `${Math.floor((Date.now() - new Date(employeeData.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months` 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-info/10 rounded-lg">
                <Users className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-lg font-semibold">
                  {employees.filter(e => e.department === employeeData?.department).length} members
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={itemVariants} className="stat-card">
          <h2 className="text-xl font-semibold mb-6">My Profile</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 text-center">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <span className="text-accent font-bold text-3xl">
                  {employeeData?.firstName?.[0]}{employeeData?.lastName?.[0]}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                {employeeData?.firstName} {employeeData?.lastName}
              </h3>
              <p className="text-muted-foreground">{employeeData?.designation}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{employeeData?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{employeeData?.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{employeeData?.department}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Designation</p>
                  <p className="font-medium">{employeeData?.designation}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">
                    {employeeData?.joiningDate ? new Date(employeeData.joiningDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
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
          </div>
        </motion.div>

        {/* Attendance Tracker (Simulated) */}
        <motion.div variants={itemVariants} className="stat-card">
          <h2 className="text-xl font-semibold mb-6">This Week's Attendance</h2>
          <div className="grid grid-cols-5 gap-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => {
              const isToday = new Date().getDay() === index + 1;
              const isPast = new Date().getDay() > index + 1;
              return (
                <div
                  key={day}
                  className={`p-4 rounded-lg text-center transition-all ${
                    isToday
                      ? 'bg-accent/10 border-2 border-accent'
                      : isPast
                      ? 'bg-success/5 border border-success/20'
                      : 'bg-muted/50 border border-border'
                  }`}
                >
                  <p className="text-sm font-medium text-muted-foreground">{day}</p>
                  <div className="mt-2">
                    {isPast ? (
                      <CheckCircle className="w-6 h-6 text-success mx-auto" />
                    ) : isToday ? (
                      <Clock className="w-6 h-6 text-accent mx-auto" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted mx-auto" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isPast ? 'Present' : isToday ? 'Today' : '-'}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
