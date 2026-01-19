import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeposits, updateDeposit } from '../Slices/depositSlice';
import { fetchBalancesBySupabaseId, createBalance, updateBalance } from '../Slices/balanceSlice';

const Deposit = () => {
  const dispatch = useDispatch();
  const { items: deposits, loading, error } = useSelector(state => state.deposits);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(fetchDeposits());
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const deposit = deposits.find(d => d._id === id);
      if (!deposit) return;

      // Update deposit status first
      await dispatch(updateDeposit({ id, data: { status: newStatus } })).unwrap();

      // When status changes to approved, update/create balance for this supabaseId
      if (newStatus === 'approved' && deposit.status !== 'approved') {
        const balances = await dispatch(fetchBalancesBySupabaseId(deposit.supabaseId)).unwrap();

        if (Array.isArray(balances) && balances.length > 0) {
          const currentBalance = balances[0];
          const newBalanceAmount = (currentBalance.balance || 0) + deposit.amount;

          await dispatch(
            updateBalance({ id: currentBalance._id || currentBalance.id, data: { balance: newBalanceAmount } })
          ).unwrap();
        } else {
          await dispatch(
            createBalance({ supabaseId: deposit.supabaseId, balance: deposit.amount })
          ).unwrap();
        }
      }
    } catch (err) {
      console.error('Error updating deposit/balance:', err);
    }
  };

  return (
    <div className="page">
      <h1 className="page-header">Deposit <span>Management</span></h1>
      <p className="page-description">Manage all user deposits.</p>
      {error && <p className="error">{typeof error === 'string' ? error : error.message || 'An error occurred'}</p>}
      {loading ? (
        <p>Loading deposits...</p>
      ) : deposits.length === 0 ? (
        <p>No deposits found.</p>
      ) : (
        <div className="deposits-table">
          <table>
            <thead>
              <tr>
                <th>Phone No</th>
                <th>Image</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...deposits]
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .map(deposit => (
                <tr key={deposit._id}>
                  <td>{deposit.phoneNo}</td>
                  <td>
                    {deposit.image && (
                      <img
                        src={deposit.image}
                        alt="Deposit"
                        className="deposit-thumb"
                        onClick={() => setSelectedImage(deposit.image)}
                      />
                    )}
                  </td>
                  <td>${deposit.amount}</td>
                  <td>{deposit.method}</td>
                  <td>
                    <span className={`status ${deposit.status}`}>{deposit.status}</span>
                  </td>
                  <td>{new Date(deposit.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={deposit.status}
                      onChange={(e) => handleStatusChange(deposit._id, e.target.value)}
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

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="image-modal-close"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img src={selectedImage} alt="Deposit" className="image-modal-img" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposit;