import { useAppSelector } from '@/store/hooks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const AdminDashboard = () => {
  const { user } = useAppSelector(state => state.auth);
  const { employees } = useAppSelector(state => state.employees);

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const onboarding = employees.filter(e => e.status === 'onboarding').length;
    const exiting = employees.filter(e => e.status === 'exit').length;

    const departments = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentJoiners = employees
      .filter(e => {
        const joinDate = new Date(e.joiningDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate >= thirtyDaysAgo;
      })
      .sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime())
      .slice(0, 5);

    return { total, active, onboarding, exiting, departments, recentJoiners };
  }, [employees]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}! Here's what's happening today.
            </p>
          </div>
          <Link
            to="/admin/add-employee"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-success font-medium">+12%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.active}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {((stats.active / stats.total) * 100).toFixed(0)}% of workforce
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Onboarding</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.onboarding}</p>
              </div>
              <div className="p-3 bg-info/10 rounded-lg">
                <Clock className="w-6 h-6 text-info" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">New team members</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exiting</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.exiting}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">In exit process</span>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <motion.div variants={itemVariants} className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Department Distribution</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(stats.departments).map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{dept}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Joiners */}
          <motion.div variants={itemVariants} className="stat-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold">Recent Joiners</h3>
              </div>
              <Link to="/admin/employees" className="text-sm text-accent hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentJoiners.length > 0 ? (
                stats.recentJoiners.map(emp => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-accent font-semibold">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {emp.designation} • {emp.department}
                      </p>
                    </div>
                    <span className={`status-badge ${
                      emp.status === 'active' ? 'status-active' :
                      emp.status === 'onboarding' ? 'status-onboarding' :
                      'status-exit'
                    }`}>
                      {emp.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No recent joiners in the last 30 days
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="stat-card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/admin/employees"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
            >
              <Users className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium">View Employees</span>
            </Link>
            <Link
              to="/admin/add-employee"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
            >
              <UserPlus className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium">Add Employee</span>
            </Link>
            <Link
              to="/admin/analytics"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
            >
              <TrendingUp className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium">Analytics</span>
            </Link>
            <Link
              to="/admin/employees"
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
            >
              <UserMinus className="w-6 h-6 text-accent" />
              <span className="text-sm font-medium">Exit Process</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
