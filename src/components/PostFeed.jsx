import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getRelativeTime } from '../utils/date';

const PostFeed = () => {
    const [posts, setPosts] = useState([]);
    const [tab, setTab] = useState('all'); // 'all' or 'mine'
    const token = useSelector(state => state.auth.token);

    const fetchPosts = async () => {
        const url =
            tab === 'all'
                ? 'http://localhost:5000/api/posts/feed'
                : 'http://localhost:5000/api/posts/my-posts';

        try {
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(res.data);
        } catch {
            toast.error('Failed to load posts');
        }
    };

    const likePost = async (postId) => {
        try {
            await axios.post(`http://localhost:5000/api/posts/${postId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts();
        } catch {
            toast.error('Failed to like post');
        }
    };

    const commentPost = async (postId, text) => {
        if (!text.trim()) return;
        try {
            await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, { text }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPosts();
        } catch {
            toast.error('Failed to comment');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [tab]);

    return (
        <div className="mb-6 bg-white p-4 rounded shadow">
            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setTab('all')}
                    className={`px-4 py-2 rounded ${tab === 'all' ? 'bg-blue-400 text-white' : 'bg-gray-200'
                        }`}
                >
                    All Posts
                </button>
                <button
                    onClick={() => setTab('mine')}
                    className={`px-4 py-2 rounded ${tab === 'mine' ? 'bg-blue-400 text-white' : 'bg-gray-200'
                        }`}
                >
                    My Posts
                </button>
            </div>
            <div className='border-b'></div>
            {/* Post List */}
            <div className="space-y-4 p-2">
                {posts.length === 0 && <p className="text-gray-500">No posts found.</p>}

                {posts.map(post => (
                    <div key={post._id}>
                        <div className="mb-2">
                            <strong>{post.author.name}</strong>
                            <p className="text-xs text-gray-400">
                                {getRelativeTime(post.createdAt)}
                            </p>
                            <p className="text-gray-700">{post.content}</p>
                            {post.image && (
                                <img
                                    src={`http://localhost:5000${post.image}`}
                                    alt="Post"
                                    className="mt-2 max-h-64 rounded"
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => likePost(post._id)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                ❤️ {post.likes.length} Like
                            </button>
                        </div>
                        <ul className="text-sm text-gray-600 mb-2">
                            {post.comments.map(c => (
                                <li key={c._id}>
                                    <strong>{c.user.name}</strong>: {c.text}
                                </li>
                            ))}
                        </ul>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                const text = e.target.elements.comment.value;
                                commentPost(post._id, text);
                                e.target.reset();
                            }}
                        >
                            <input
                                name="comment"
                                placeholder="Write a comment..."
                                className="w-full border p-1 rounded"
                            />
                        </form>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostFeed;
