'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import '../globals.css';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = { title, content, imageUrl };
    try {
      const res = await fetch(
        editing ? `/api/posts/${editing._id}` : '/api/posts',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        }
      );
      if (!res.ok) throw new Error('Failed to save post');
      setTitle('');
      setContent('');
      setImageUrl('');
      setEditing(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="admin-container">
      <div className="admin-header">
        <h1 className="heading">Admin Dashboard</h1>
        <div className="button-group">
          <button onClick={() => router.push('/profile')} className="btn-primary">Profile</button>
          <button onClick={() => router.push('/terms')} className="btn-secondary">Terms</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Flat Name and address"
          className="input-field"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter other details on flat"
          className="textarea-field"
          required
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Paste Flat Image URL"
          className="input-field"
          required
        />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Flat preview"
            className="w-full max-w-xs mb-4 rounded-md shadow"
          />
        )}

        <div className="form-actions">
          <button type="submit" className="btn-green">
            {editing ? 'Update Post' : 'Add Post'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setTitle('');
                setContent('');
                setImageUrl('');
              }}
              className="btn-red"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <section>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 mb-4 border border-gray-300 rounded-md"
        />

        <h2 className="section-title">All Posts</h2>

        {filteredPosts.length === 0 ? (
          <p className="text-muted">No posts found.</p>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className={`post-card ${editing?._id === post._id ? 'highlight' : ''}`}
            >
              <h3
                className="post-title"
                onClick={() => router.push(`/flats/${post._id}`)}
              >
                {post.title}
              </h3>
              <p className="post-content">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Flat image"
                  className="w-full max-w-sm my-2 rounded-md shadow"
                />
              )}
              <div className="post-actions">
                <button
                  onClick={() => {
                    setEditing(post);
                    setTitle(post.title);
                    setContent(post.content);
                    setImageUrl(post.imageUrl || '');
                  }}
                  className="btn-yellow"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="btn-red"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
