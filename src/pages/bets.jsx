import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBets, updateBet, deleteBet } from '../Slices/betSlice';
import {
  fetchBalancesBySupabaseId,
  updateBalance,
  createBalance,
} from '../Slices/balanceSlice';

export default function Bets({ user }) {
  const dispatch = useDispatch();
  const { items: bets, loading, error } = useSelector(s => s.bets);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({ possibleWin: '', isAccepted: false, status: 'pending' });

  useEffect(() => { dispatch(fetchBets()); }, [dispatch]);

  const handleEdit = (bet) => {
    setEditing(bet._id || bet.id);
    setEditData({
      possibleWin: bet.possibleWin || '',
      isAccepted: bet.isAccepted || false,
      status: bet.status || 'pending'
    });
  };

  const handleSave = async (id) => {
    const bet = bets.find(b => (b._id || b.id) === id);
    if (!bet) return;

    const isAccepting = !bet.isAccepted && editData.isAccepted;

    const payload = {
      ...editData,
      possibleWin: Number(editData.possibleWin) || 0,
    };

    try {
      if (isAccepting && bet.supabaseId) {
        const userId = bet.supabaseId;
        const balances = await dispatch(fetchBalancesBySupabaseId(userId)).unwrap();
        const existingBalance = Array.isArray(balances) && balances.length > 0 ? balances[0] : null;
        const currentBalance = existingBalance?.balance || 0;

        if (currentBalance < bet.amount) {
          alert('Balance is less than bet amount. Cannot accept this bet.');
          return;
        }

        const newBalanceAmount = currentBalance - bet.amount;

        if (existingBalance) {
          await dispatch(
            updateBalance({
              id: existingBalance._id || existingBalance.id,
              data: { ...existingBalance, balance: newBalanceAmount },
            })
          ).unwrap();
        } else {
          await dispatch(
            createBalance({
              supabaseId: userId,
              balance: newBalanceAmount,
            })
          ).unwrap();
        }
      }

      const updatedBet = await dispatch(updateBet({ id, data: payload })).unwrap();

      if (updatedBet.status === 'win' && updatedBet.possibleWin > 0 && updatedBet.supabaseId) {
        const userId = updatedBet.supabaseId;

        const balances = await dispatch(fetchBalancesBySupabaseId(userId)).unwrap();
        const existingBalance = Array.isArray(balances) && balances.length > 0 ? balances[0] : null;
        const currentBalance = existingBalance?.balance || 0;
        const newBalanceAmount = currentBalance + updatedBet.possibleWin;

        if (existingBalance) {
          await dispatch(
            updateBalance({
              id: existingBalance._id || existingBalance.id,
              data: { ...existingBalance, balance: newBalanceAmount },
            })
          ).unwrap();
        } else {
          await dispatch(
            createBalance({
              supabaseId: userId,
              balance: newBalanceAmount,
            })
          ).unwrap();
        }
      }

      setEditing(null);
    } catch (err) {
      console.error('Failed to save bet or update balance', err);
    }
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bet?')) {
      dispatch(deleteBet(id));
    }
  };

  return (
    <div className="page">
      <h1 className="page-header">All <span>Bets</span></h1>
      <p className="page-description">Manage all bets in the system.</p>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{typeof error === 'string' ? error : error.message || 'Error'}</p>}
      <div className="bets-list">
        {[...bets]
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .map(bet => (
          <div key={bet._id || bet.id} className="bet-item">
            <div className="bet-info">
              <p><strong>Prediction:</strong> {bet.prediction}</p>
              <p><strong>Amount:</strong> ${bet.amount}</p>
              <p><strong>Possible Win:</strong> ${bet.possibleWin}</p>
              <p><strong>Accepted:</strong> {bet.isAccepted ? 'Yes' : 'No'}</p>
              <p><strong>Status:</strong> {bet.status}</p>
              <p><strong>User ID:</strong> {bet.supabaseId}</p> 
            </div>
            {editing === (bet._id || bet.id) ? (
              <div className="edit-form">
                <label>
                  Possible Win:
                  <input
                    type="number"
                    value={editData.possibleWin}
                    onChange={(e) => setEditData({ ...editData, possibleWin: e.target.value })}
                  />
                </label>
                <label>
                  Accepted:
                  <input
                    type="checkbox"
                    checked={editData.isAccepted}
                    onChange={(e) => setEditData({ ...editData, isAccepted: e.target.checked })}
                  />
                </label>
                <label>
                  Status:
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                  </select>
                </label>
                <button onClick={() => handleSave(bet._id || bet.id)} className="btn">Save</button>
                <button onClick={handleCancel} className="btn">Cancel</button>
              </div>
            ) : (
              <div className="bet-actions">
                <button onClick={() => handleEdit(bet)} className="btn">Edit</button>
                <button onClick={() => handleDelete(bet._id || bet.id)} className="btn delete-btn">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

