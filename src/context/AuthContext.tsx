import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../lib/firebase';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User as FirebaseUser
} from 'firebase/auth';
import api from '../api/axios';

interface AuthContextType {
    user: FirebaseUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                // Sync user to backend/firestore
                try {
                    // Check if token works
                    const token = await currentUser.getIdToken();
                    // We can optionally sync basic info here
                    await api.post('/users/sync', {
                        email: currentUser.email,
                        name: currentUser.displayName || 'Member' // Note: displayName might be null initially
                    });
                } catch (e) {
                    console.error("Sync failed", e);
                }
            }
        });
        return unsubscribe;
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (name: string, email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update display name? 
        // await updateProfile(userCredential.user, { displayName: name });
        // Trigger sync
        await api.post('/users/sync', {
            email: userCredential.user.email,
            name: name
        });
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
