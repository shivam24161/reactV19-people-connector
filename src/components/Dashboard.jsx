import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout } from '../features/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API } from '../constants/Api';
import UserList from './UserList';
import PostForm from './PostForm';
import PostFeed from './PostFeed';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(API.get.me, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setUser(res.data));
    } catch {
      toast.error('Session expired');
      dispatch(logout());
      navigate('/login');
    }
  };

  const acceptFriend = async (id) => {
    try {
      await axios.post(`${API.post.acceptFriend}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Friend added!');
      fetchProfile();
    } catch {
      toast.error('Failed to accept request');
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

  const unfriend = async (id) => {
    try {
      await axios.post(`${API.post.unfriend}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Unfriended successfully');
      fetchProfile();
    } catch {
      toast.error('Failed to unfriend');
    }
  };

  useEffect(() => {
    if (!user) fetchProfile();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* <h1 className="text-3xl font-bold">Welcome, {user?.name} ({user?.email})</h1> */}
          <h1 className="text-3xl font-bold">Welcome, {user?.email}</h1>
        </div>
        <button
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
          className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <div className="flex gap-8">
        <div>
          <PostForm onPostCreated={fetchProfile} />
          <PostFeed />
          {/* All Users */}
          <UserList />
        </div>
        <div>
          {/* Friend Requests */}
          <div className="bg-white rounded-md shadow p-5 mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Friend Requests</h2>
            {user?.friendRequests.length === 0 ? (
              <p className="text-gray-500">No incoming friend requests.</p>
            ) : (
              user?.friendRequests.map(req => (
                <div key={req._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span>{req.name} ({req.email})</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => acceptFriend(req._id)}
                      className="cursor-pointer bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => cancelRequest(req._id)}
                      className="cursor-pointer bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Friends List */}
          <div className="bg-white rounded-md shadow p-5 mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Friends</h2>
            {user?.friends.length === 0 ? (
              <p className="text-gray-500">You don’t have any friends yet.</p>
            ) : (
              user?.friends.map(friend => (
                <div key={friend._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <span>{friend.name} ({friend.email})</span>
                  <button
                    onClick={() => unfriend(friend._id)}
                    className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Unfriend
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
