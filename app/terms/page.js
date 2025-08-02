'use client';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="terms-page">
      <div className="terms-header">
        <button className="btn-secondary back-btn" onClick={() => router.back()}>
          ← Back
        </button>
        <h1 className="terms-title">Terms and Conditions</h1>
      </div>
      <p className="terms-text">
        This blog app allows the admin to log in via GitHub, while users log in using local storage. Blog data is securely stored in MongoDB Atlas.
      </p>
    </main>
  );
}
