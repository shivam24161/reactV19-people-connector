import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../constants/Api';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API.post.signup, form, { withCredentials: true });
      toast.success('Signup successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className="w-full max-w-sm p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" onChange={handleChange}
            className="w-full px-3 py-2 border rounded" required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange}
            className="w-full px-3 py-2 border rounded" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange}
            className="w-full px-3 py-2 border rounded" required />
          <button type="submit" className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Signup
          </button>
        </form>
        {/* login Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
