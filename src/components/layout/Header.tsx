import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from '@/components/auth/UserMenu';
import { Brain, Home, Trophy, Settings, TestTube, User } from 'lucide-react';
import { useAuth, useLocation } from '@/hooks';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { href: '/', label: 'Assessment', icon: Home },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  // Add admin-only nav items
  if (isAdmin) {
    navItems.push(
      { href: '/admin', label: 'Admin', icon: Settings },
      { href: '/admin/system-test', label: 'System Tests', icon: TestTube }
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">AI Fluency</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu user={user} onSignOut={handleSignOut} isAdmin={isAdmin} />
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
