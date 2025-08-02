'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FlatDetailPage({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) throw new Error('Flat not found');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError('Unable to load flat.');
        console.error(err);
      }
    };

    fetchPost();
  }, [params.id]);

  if (error) {
    return (
      <main className="blog-post-detail">
        <button onClick={() => router.back()} className="back-btn">← Back</button>
        <p className="error-msg">{error}</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="blog-post-detail">
        <p className="text-center p-10">Loading...</p>
      </main>
    );
  }

  return (
    <main className="blog-post-detail">
      <button onClick={() => router.back()} className="back-btn">← Back</button>
      <h1 className="post-title">{post.title}</h1>
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Flat Image"
          className="w-full max-w-2xl rounded-md my-4 shadow-lg"
        />
      )}
      <p className="post-content">{post.content}</p>
    </main>
  );
}
