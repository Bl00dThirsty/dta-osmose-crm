"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useParams } from "next/navigation"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Types
interface User {
  id: string;
  email: string;
  role: string;
  userType: "user" | "customer";
}

interface RegisterValues {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  email: string;
  phone?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  gender?: string;
  birthday?: string;
  CnpsId?: string;
  joinDate?: string;
  employeeId?: string;
  bloodGroup?: string;
  salary?: number;
  role: string;
  departmentId?: number;
  designationId?: number;
  emergencyPhone1?: string;
  emergencyname1?: string;
  emergencylink1?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  //register: (email: string, password: string) => Promise<void>;
  register: (values: RegisterValues) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { institution } = useParams() as { institution: string }
  // Configuration axios
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: true
  });

  // Intercepteur pour les requêtes
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Intercepteur pour les réponses
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Si l'erreur est 401 et que ce n'est pas une requête de refresh token
      if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
        originalRequest._retry = true;
        
        try {
          // Tenter de rafraîchir le token
          //
          const { data } = await api.post('/auth/refresh-token');
          localStorage.setItem('accessToken', data.accessToken);
          
          // Mettre à jour le header et renvoyer la requête
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Si le refresh échoue, déconnecter l'utilisateur
          setUser(null);
          localStorage.removeItem('accessToken');
          router.push('/');
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

//Si tu ne fais pas encore de refresh token, remplace tout le bloc try/catch par :
// Pas de refresh token => déconnecte immédiatement
// setUser(null);
// localStorage.removeItem('accessToken');
// router.push('/');
// return Promise.reject(error);


  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (token) {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        }
      } catch (err) {
        // Si l'erreur est gérée par l'intercepteur, on ne fait rien ici
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
  
      const response = await api.post('/auth/login', { email, password });
  
      const { accessToken, ...userData } = response.data;
  
      // Stockage du token et du nom d'utilisateur
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', userData.userName);
      localStorage.setItem('id', userData.id);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('userType', userData.userType);

  
      // Mise à jour du contexte utilisateur
      setUser(userData);
  
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  

  // Fonction d'inscription
  const register = async (values: RegisterValues) => {
    try {
      setLoading(true);
      setError(null);
                                                    //{ ...values,}
      const { data } = await api.post('/auth/register', values);
      
      setUser(data.user);
      localStorage.setItem('accessToken', data.accessToken);
     
      
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      router.push("/");
    }
  };

  // Effacer l'erreur
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
  // return (
  //   <AuthContext.Provider value={{ user, loading, error, login: async () => {}, register, logout: async () => {}, clearError: () => setError(null) }}>
  //     {children}
  //   </AuthContext.Provider>
  // );
};
