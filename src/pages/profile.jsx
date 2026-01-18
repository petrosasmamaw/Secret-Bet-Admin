import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../Slices/userSlice';
import { fetchBalances } from '../Slices/balanceSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { items: users, loading, error } = useSelector(state => state.users);
  const { items: balances } = useSelector(state => state.balances);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBalances());
  }, [dispatch]);

  const getUserBalance = (supabaseId) => {
    if (!supabaseId) return 0;

    const userBalances = balances.filter(b => b.supabaseId === supabaseId);
    if (userBalances.length === 0) return 0;

    const latest = userBalances.reduce((latestItem, currentItem) => {
      const latestDate = new Date(latestItem.updatedAt || latestItem.createdAt || 0);
      const currentDate = new Date(currentItem.updatedAt || currentItem.createdAt || 0);
      return currentDate > latestDate ? currentItem : latestItem;
    });

    return typeof latest.balance === 'number' ? latest.balance : 0;
  };

  return (
    <div className="page">
      <h1 className="page-header">User <span>Profiles</span></h1>
      <p className="page-description">View all user profiles.</p>
      {error && <p className="error">{typeof error === 'string' ? error : error.message || 'An error occurred'}</p>}
      {loading ? (
        <p>Loading profiles...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="profiles-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Member Since</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>${getUserBalance(user.supabaseId)}</td>
                  <td>
                    <span className={user.isBlocked ? 'blocked' : 'active'}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Profile;
