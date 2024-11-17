import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  createBrowserRouter,
  RouterProvider,
  Navigate
} from 'react-router-dom';
import App from './App.jsx';
import Auth from './components/Auth.jsx';
import { supabase } from './utils/supabaseClient';
import './App.css';
import './index.css';

function Main() {
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial session check
    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = 
          await supabase.auth.getSession();
        
        console.log("Initial session check:", initialSession);
        
        if (sessionError) {
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (initialSession) {
          setSession(initialSession);
          await fetchUserData(initialSession.user.id);
        } else {
          setSession(null);
          setUserData(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    // Run initial session check
    checkInitialSession();

    // Setup auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession);

        if (event === 'SIGNED_OUT') {
          // Clear all states
          setSession(null);
          setUserData(null);
          setLoading(false);

          // Force clear any Supabase session data
          await supabase.auth.clearSession();
          
          // Clear localStorage data
          localStorage.clear();
        } else if (currentSession) {
          setSession(currentSession);
          await fetchUserData(currentSession.user.id);
        } else {
          setSession(null);
          setUserData(null);
          setLoading(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    try {
      // Only proceed if we have a userId
      if (!userId) {
        console.error("No userId provided to fetchUserData");
        setError("User ID is required");
        setLoading(false);
        return;
      }

      console.log("Fetching user data for:", userId);
      const { data, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        // If user doesn't exist, create a default user
        if (userError.code === 'PGRST116') {
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: userId,
                email: session?.user?.email,
                created_at: new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (!createError) {
            console.log("Created new user:", newUser);
            setUserData(newUser);
          } else {
            console.error("Error creating user:", createError);
            setError(createError.message);
          }
        } else {
          setError(userError.message);
        }
      } else {
        console.log("Found user data:", data);
        setUserData(data);
      }
    } catch (err) {
      console.error("Unexpected error in fetchUserData:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : !session ? (
        <Auth />
      ) : !userData ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p className="ml-2">Loading user data...</p>
        </div>
      ) : (
        <App 
          session={session} 
          userData={userData} 
          setUserData={setUserData}
        />
      )
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    }
  ]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">Error loading application</p>
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

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(<Main />);