'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import '../globals.css';

export default function UserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/login');
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [user]);

  useEffect(() => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  return (
    <main className="user-container">
      <div className="user-header">
        <h1 className="welcome-title">Welcome, {user?.username}</h1>
        <div className="user-actions">
          <button className="btn-primary" onClick={() => router.push('/profile')}>Profile</button>
          <button className="btn-secondary" onClick={() => router.push('/terms')}>Terms</button>
        </div>
      </div>

      <section className="blog-section">
        <h2 className="section-title">Available Flat Vacancies</h2>

        <input
          type="text"
          placeholder="Search flat by title or content..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredPosts.length === 0 ? (
          <p className="no-posts">No matching flats found.</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post._id} className="post-card">
              <h3
                className="post-title"
                onClick={() => router.push(`/flats/${post._id}`)}
              >
                {post.title}
              </h3>

              {/* ✅ Display image if available */}
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Flat image"
                  className="w-full max-w-md my-2 rounded-md shadow"
                />
              )}

              <p className="post-content">{post.content}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
