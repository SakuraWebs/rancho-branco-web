import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, User, doc, onSnapshot } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isAdmin: false, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if user is the hardcoded admin or has admin role in Firestore
        const isAdminEmail = currentUser.email === 'enrique.rfm@gmail.com';
        
        if (isAdminEmail) {
          setIsAdmin(true);
          setLoading(false);
        } else {
          // Check Firestore for role
          const userDocRef = doc(db, 'users', currentUser.uid);
          const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().role === 'admin') {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
            setLoading(false);
          }, () => {
            setIsAdmin(false);
            setLoading(false);
          });
          return () => unsubscribeDoc();
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
