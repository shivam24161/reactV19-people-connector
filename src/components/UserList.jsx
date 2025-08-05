import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { API } from '../constants/Api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(API.get.users, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const fetchProfile = async () => {
    const res = await axios.get(API.get.me, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUser(res.data));
  };

  const sendFriendRequest = async (id) => {
    try {
      await axios.post(`${API.post.friendRequest}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Friend request sent!');
      fetchProfile();
    } catch {
      toast.error('Failed to send request');
    }
  };

  const cancelRequest = async (id) => {
    try {
      await axios.post(`${API.post.cancelRequest}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Friend request canceled');
      fetchProfile();
    } catch {
      toast.error('Failed to cancel request');
    }
  };

  const blockUser = async (id) => {
    try {
      await axios.post(`${API.post.blockUser}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('User blocked!');
    } catch {
      toast.error('Failed to block');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      {users.map(u => {
        const isFriend = user?.friends?.some(f => f._id === u._id);
        const isBlocked = user?.blockedUsers?.includes(u._id);
        const youRequested = u.friendRequests?.includes(user._id);

        return (
          <div key={u._id} className="flex justify-between mb-2 border-b pb-2">
            <div>
              <p>{u.name} ({u.email})</p>
              {isFriend && <span className="text-sm text-green-600">Friend</span>}
              {user?.friendRequests?.some(r => r._id === u._id) && (
                <span className="text-sm text-blue-500 ml-2">Requested You</span>
              )}
              {isBlocked && <span className="text-sm text-red-500 ml-2">Blocked</span>}
              {youRequested && <span className="text-sm text-yellow-500 ml-2">Request Sent</span>}
            </div>

            <div className="space-x-2">
              {!isFriend && !isBlocked && (
                <>
                  {!youRequested && (
                    <button
                      onClick={() => sendFriendRequest(u._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Add
                    </button>
                  )}
                  {youRequested && (
                    <button
                      onClick={() => cancelRequest(u._id)}
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => blockUser(u._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Block
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
