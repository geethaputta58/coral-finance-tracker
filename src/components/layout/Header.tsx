import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const routes = [
    { name: 'Dashboard', path: '/' },
    { name: 'Income', path: '/income' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Savings', path: '/savings' },
    { name: 'Investments', path: '/investments' },
    { name: 'Debts', path: '/debts' },
    { name: 'Reports', path: '/reports' },
    { name: 'News', path: '/news' },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-primary">
          FinanceTracker
        </Link>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-1">
          {routes.map((route) => (
            <Link 
              key={route.path} 
              to={route.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(route.path) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              {route.name}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-2">
          {/* Theme toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Logout button */}
          {user && (
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto py-2 px-4 space-y-1">
            {routes.map((route) => (
              <Link 
                key={route.path} 
                to={route.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(route.path) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                {route.name}
              </Link>
            ))}
            {user && (
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="w-full justify-start px-3"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="w-full justify-start px-3"
            >
              {theme === 'dark' ? <SunIcon className="h-5 w-5 mr-2" /> : <MoonIcon className="h-5 w-5 mr-2" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
