
import { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/lib/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
  });
  
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Mock login - replace with actual authentication
      const user: User = {
        id: '1',
        email: credentials.email,
      };
      setState({ user, loading: false });
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Mock registration - replace with actual registration
      const user: User = {
        id: '1',
        email: credentials.email,
        name: credentials.name,
      };
      setState({ user, loading: false });
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toast({
        title: "Error",
        description: "Registration failed",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    setState({ user: null, loading: false });
    toast({
      title: "Goodbye!",
      description: "You have been logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
