import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWithdrawals, updateWithdrawal } from '../Slices/withdrawalSlice';
import { fetchBalancesBySupabaseId, updateBalance } from '../Slices/balanceSlice';

const Withdraw = () => {
  const dispatch = useDispatch();
  const { items: withdrawals, loading, error } = useSelector(state => state.withdrawals);

  useEffect(() => {
    dispatch(fetchWithdrawals());
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const withdrawal = withdrawals.find(w => w._id === id);
      if (!withdrawal) return;

      // If not approving, just update status
      if (newStatus !== 'approved') {
        await dispatch(updateWithdrawal({ id, data: { status: newStatus } })).unwrap();
        return;
      }

      // For approval: check balance first
      const balances = await dispatch(fetchBalancesBySupabaseId(withdrawal.supabaseId)).unwrap();
      const currentBalanceObj = Array.isArray(balances) && balances.length > 0 ? balances[0] : null;
      const currentAmount = currentBalanceObj?.balance || 0;

      if (currentAmount < withdrawal.amount) {
        alert('Balance is less than withdrawal amount. Cannot approve.');
        return; // Do not update withdrawal status
      }

      // Sufficient balance: approve withdrawal and subtract from balance
      await dispatch(updateWithdrawal({ id, data: { status: newStatus } })).unwrap();

      const newBalanceAmount = currentAmount - withdrawal.amount;
      await dispatch(
        updateBalance({ id: currentBalanceObj._id || currentBalanceObj.id, data: { balance: newBalanceAmount } })
      ).unwrap();
    } catch (err) {
      console.error('Error updating withdrawal/balance:', err);
    }
  };

  return (
    <div className="page">
      <h1 className="page-header">Withdrawal <span>Management</span></h1>
      <p className="page-description">Manage all user withdrawals.</p>
      {error && <p className="error">{typeof error === 'string' ? error : error.message || 'An error occurred'}</p>}
      {loading ? (
        <p>Loading withdrawals...</p>
      ) : withdrawals.length === 0 ? (
        <p>No withdrawals found.</p>
      ) : (
        <div className="withdrawals-table">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Phone No</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...withdrawals]
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .map(withdrawal => (
                <tr key={withdrawal._id}>
                  <td>{withdrawal.userName}</td>
                  <td>{withdrawal.phoneNo}</td>
                  <td>{withdrawal.method}</td>
                  <td>${withdrawal.amount}</td>
                  <td>
                    <span className={`status ${withdrawal.status}`}>{withdrawal.status}</span>
                  </td>
                  <td>{new Date(withdrawal.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={withdrawal.status}
                      onChange={(e) => handleStatusChange(withdrawal._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
