import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Auth from './components/Auth.jsx';
import { supabase } from './utils/supabaseClient';
import './index.css';

function Main() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(session);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
  
    // Store the subscription object
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Return a cleanup function that calls unsubscribe
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error loading authentication</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return session ? <App /> : <Auth />;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <Main />
  </StrictMode>,
);