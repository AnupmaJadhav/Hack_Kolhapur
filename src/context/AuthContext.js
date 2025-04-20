import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../firebase/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data including role from Realtime Database
  const fetchUserData = async (uid) => {
    try {
      const userRef = ref(database, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setUserRole(userData.role);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setIsAuthenticated(true);
          
          // Fetch additional user data from Realtime Database
          const userData = await fetchUserData(currentUser.uid);
          
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            ...(userData || {})
          });
          
          setShowAuthModal(false);
        } else {
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase register function with role
  const register = async (email, password, userData) => {
    try {
      setError(null);
      // Create the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store additional user data in Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        name: userData.name,
        email: user.email,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
      });
      
      // Update local state
      setUserRole(userData.role || 'user');
      
      return user;
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Firebase login function
  const login = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user data including role
      await fetchUserData(user.uid);
      
      return user;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Firebase logout function
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    showAuthModal,
    setShowAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};