import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PostForm = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [visibility, setVisibility] = useState('friends');
    const token = useSelector(state => state.auth.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        const formData = new FormData();
        formData.append('content', content);
        formData.append('visibility', visibility);
        if (image) formData.append('image', image);

        try {
            await axios.post('http://localhost:5000/api/posts', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Post created!');
            setContent('');
            setImage(null);
            setVisibility('friends');
            onPostCreated();
        } catch {
            toast.error('Failed to create post');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow space-y-3">
            <textarea
                className="w-full border border-gray-300 rounded p-3 text-sm"
                placeholder="What's on your mind?"
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
                className="w-full text-sm"
            />

            <select
                value={visibility}
                onChange={e => setVisibility(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 text-sm"
            >
                <option value="public">🌍 Public</option>
                <option value="friends">👥 Friends Only</option>
                <option value="private">🔒 Private</option>
            </select>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm" type="submit">
                Share Post
            </button>
        </form>
    );
};

export default PostForm;