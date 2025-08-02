'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import '../globals.css';
import { FaUserCircle } from 'react-icons/fa';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <main className="profile-page enhanced-profile">
      <div className="profile-header">
        <FaUserCircle size={80} color="#555" />
        <h1 className="profile-title">Your Profile</h1>
      </div>

      <div className="toolbar-buttons top-toolbar">
        <button className="nav-btn" onClick={() => router.back()}>← Back</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {user ? (
        <div className="profile-details">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Password:</strong> {user.password}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p className="no-user">No user is logged in.</p>
      )}
    </main>
  );
}
