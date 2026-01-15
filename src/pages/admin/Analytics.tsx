import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  UserPlus,
  UserMinus,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Analytics = () => {
  const { employees } = useAppSelector(state => state.employees);

  const analytics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;
    const onboarding = employees.filter(e => e.status === 'onboarding').length;
    const exiting = employees.filter(e => e.status === 'exit').length;

    // Department distribution
    const departments = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Salary distribution
    const salaryRanges = {
      '0-50k': 0,
      '50k-75k': 0,
      '75k-100k': 0,
      '100k-150k': 0,
      '150k+': 0,
    };

    employees.forEach(emp => {
      if (emp.salary < 50000) salaryRanges['0-50k']++;
      else if (emp.salary < 75000) salaryRanges['50k-75k']++;
      else if (emp.salary < 100000) salaryRanges['75k-100k']++;
      else if (emp.salary < 150000) salaryRanges['100k-150k']++;
      else salaryRanges['150k+']++;
    });

    // Monthly joiners (last 6 months)
    const monthlyJoiners: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyJoiners[monthKey] = 0;
    }

    employees.forEach(emp => {
      const joinDate = new Date(emp.joiningDate);
      const monthKey = `${months[joinDate.getMonth()]} ${joinDate.getFullYear()}`;
      if (monthlyJoiners[monthKey] !== undefined) {
        monthlyJoiners[monthKey]++;
      }
    });

    // Average salary
    const avgSalary = employees.length > 0 
      ? employees.reduce((sum, e) => sum + e.salary, 0) / employees.length 
      : 0;

    // Exit ratio
    const exitRatio = total > 0 ? ((exiting / total) * 100).toFixed(1) : '0';

    return {
      total,
      active,
      onboarding,
      exiting,
      departments,
      salaryRanges,
      monthlyJoiners,
      avgSalary,
      exitRatio,
    };
  }, [employees]);

  const chartColors = {
    primary: 'hsl(173, 58%, 39%)',
    primaryLight: 'hsla(173, 58%, 39%, 0.2)',
    secondary: 'hsl(215, 28%, 17%)',
    accent: 'hsl(199, 89%, 48%)',
    success: 'hsl(142, 71%, 45%)',
    warning: 'hsl(38, 92%, 50%)',
  };

  const departmentChartData = {
    labels: Object.keys(analytics.departments),
    datasets: [
      {
        data: Object.values(analytics.departments),
        backgroundColor: [
          chartColors.primary,
          chartColors.accent,
          chartColors.success,
          chartColors.warning,
          chartColors.secondary,
          'hsl(280, 60%, 50%)',
          'hsl(320, 60%, 50%)',
          'hsl(30, 60%, 50%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const salaryChartData = {
    labels: Object.keys(analytics.salaryRanges),
    datasets: [
      {
        label: 'Employees',
        data: Object.values(analytics.salaryRanges),
        backgroundColor: chartColors.primaryLight,
        borderColor: chartColors.primary,
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const monthlyJoinersData = {
    labels: Object.keys(analytics.monthlyJoiners),
    datasets: [
      {
        label: 'New Joiners',
        data: Object.values(analytics.monthlyJoiners),
        borderColor: chartColors.primary,
        backgroundColor: chartColors.primaryLight,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: chartColors.primary,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'hsl(214, 32%, 91%)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

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
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            HR metrics and workforce insights
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Workforce</p>
                <p className="text-3xl font-bold text-foreground mt-1">{analytics.total}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Salary</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  ${Math.round(analytics.avgSalary / 1000)}k
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Joiners</p>
                <p className="text-3xl font-bold text-foreground mt-1">{analytics.onboarding}</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <UserPlus className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exit Ratio</p>
                <p className="text-3xl font-bold text-foreground mt-1">{analytics.exitRatio}%</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <UserMinus className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <motion.div variants={itemVariants} className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Department Distribution</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              <div className="w-full max-w-xs">
                <Doughnut
                  data={departmentChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 15,
                          usePointStyle: true,
                          pointStyle: 'circle',
                        },
                      },
                    },
                    cutout: '60%',
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Salary Distribution */}
          <motion.div variants={itemVariants} className="stat-card">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Salary Distribution</h3>
            </div>
            <div className="h-64">
              <Bar data={salaryChartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Monthly Joiners Trend */}
          <motion.div variants={itemVariants} className="stat-card lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold">Monthly Joiners Trend</h3>
            </div>
            <div className="h-64">
              <Line data={monthlyJoinersData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Status Summary */}
        <motion.div variants={itemVariants} className="stat-card">
          <h3 className="text-lg font-semibold mb-4">Workforce Status Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="font-medium">Active</span>
              </div>
              <p className="text-2xl font-bold mt-2">{analytics.active}</p>
              <p className="text-sm text-muted-foreground">
                {((analytics.active / analytics.total) * 100).toFixed(0)}% of total
              </p>
            </div>
            <div className="p-4 rounded-lg bg-info/5 border border-info/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-info" />
                <span className="font-medium">Onboarding</span>
              </div>
              <p className="text-2xl font-bold mt-2">{analytics.onboarding}</p>
              <p className="text-sm text-muted-foreground">
                {((analytics.onboarding / analytics.total) * 100).toFixed(0)}% of total
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="font-medium">Exiting</span>
              </div>
              <p className="text-2xl font-bold mt-2">{analytics.exiting}</p>
              <p className="text-sm text-muted-foreground">
                {((analytics.exiting / analytics.total) * 100).toFixed(0)}% of total
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
