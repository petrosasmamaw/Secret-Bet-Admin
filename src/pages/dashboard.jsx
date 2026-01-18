import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../Slices/userSlice';
import { fetchDeposits } from '../Slices/depositSlice';
import { fetchWithdrawals } from '../Slices/withdrawalSlice';
import { fetchBets } from '../Slices/betSlice';
import { fetchBalances } from '../Slices/balanceSlice';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: users } = useSelector(state => state.users);
  const { items: deposits } = useSelector(state => state.deposits);
  const { items: withdrawals } = useSelector(state => state.withdrawals);
  const { items: bets } = useSelector(state => state.bets);
  const { items: balances } = useSelector(state => state.balances);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDeposits());
    dispatch(fetchWithdrawals());
    dispatch(fetchBets());
    dispatch(fetchBalances());
  }, [dispatch]);

  // Calculate summary statistics
  const totalUsers = users.length;
  const totalDeposits = deposits.reduce((sum, dep) => sum + dep.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, wd) => sum + wd.amount, 0);
  const totalBalances = balances.reduce((sum, bal) => sum + bal.balance, 0);
  const totalBets = bets.length;

  // Prepare chart data
  const userRegistrationData = users.reduce((acc, user) => {
    const date = new Date(user.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const userChartData = Object.entries(userRegistrationData).map(([date, count]) => ({
    date,
    users: count
  }));

  const transactionData = deposits.concat(withdrawals).reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    if (!acc[date]) acc[date] = { date, deposits: 0, withdrawals: 0 };
    if (deposits.includes(transaction)) {
      acc[date].deposits += transaction.amount;
    } else {
      acc[date].withdrawals += transaction.amount;
    }
    return acc;
  }, {});

  const transactionChartData = Object.values(transactionData);

  const balanceDistribution = balances.reduce((acc, bal) => {
    const range = bal.balance < 100 ? '0-99' :
                  bal.balance < 500 ? '100-499' :
                  bal.balance < 1000 ? '500-999' : '1000+';
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const balanceChartData = Object.entries(balanceDistribution).map(([range, count]) => ({
    range,
    users: count
  }));

  const statusData = [
    { name: 'Approved', value: deposits.filter(d => d.status === 'approved').length + withdrawals.filter(w => w.status === 'approved').length },
    { name: 'Pending', value: deposits.filter(d => d.status === 'pending').length + withdrawals.filter(w => w.status === 'pending').length },
    { name: 'Rejected', value: deposits.filter(d => d.status === 'rejected').length + withdrawals.filter(w => w.status === 'rejected').length }
  ];

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="dashboard">
      <h1 className="page-header">Admin <span>Dashboard</span></h1>
      <p className="page-description">Overview of all system activities and statistics.</p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Users</h3>
          <p className="metric">{totalUsers}</p>
        </div>
        <div className="card">
          <h3>Total Bets</h3>
          <p className="metric">{totalBets}</p>
        </div>
        <div className="card">
          <h3>Total Deposits</h3>
          <p className="metric">${totalDeposits.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Withdrawals</h3>
          <p className="metric">${totalWithdrawals.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Balances</h3>
          <p className="metric">${totalBalances.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Net Flow</h3>
          <p className={`metric ${totalDeposits - totalWithdrawals >= 0 ? 'positive' : 'negative'}`}>
            ${(totalDeposits - totalWithdrawals).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3>User Registrations Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#007bff" fill="#007bff" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Deposit vs Withdrawal Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="deposits" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="withdrawals" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Balance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Transaction Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
