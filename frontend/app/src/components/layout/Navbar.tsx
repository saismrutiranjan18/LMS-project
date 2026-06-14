import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  User, 
  Settings,
  GraduationCap,
  Moon,
  Sun
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore, useAuthStore, useNotificationStore } from '@/store';

export default function Navbar() {
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar, theme, setTheme } = useUIStore();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className={`mx-4 mt-3 transition-all duration-500 ${
        isScrolled ? 'rounded-2xl' : 'rounded-none'
      }`}>
        <div className="flex items-center justify-between h-16 px-6">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hover:bg-[#E6F0FF] transition-colors"
            >
              {sidebarOpen ? (
                <Menu className="w-5 h-5 text-[#1A202C]" />
              ) : (
                <Menu className="w-5 h-5 text-[#1A202C]" />
              )}
            </Button>
            
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0056D1] to-[#002A6C] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1A202C] hidden sm:block">
                EduFlow
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Courses', path: '/courses' },
              { label: 'My Learning', path: '/learning/1' },
              { label: 'Community', path: '/leaderboard' },
              { label: 'Help', path: '/settings' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-sm font-medium text-[#718096] hover:text-[#0056D1] transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#0056D1] group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={`relative transition-all duration-500 ${
              searchOpen ? 'w-64' : 'w-10'
            }`}>
              {searchOpen ? (
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 pl-4 h-10 bg-[#E6F0FF] border-none rounded-full focus:ring-2 focus:ring-[#0056D1]"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#1A202C]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  className="hover:bg-[#E6F0FF] transition-colors"
                >
                  <Search className="w-5 h-5 text-[#718096]" />
                </Button>
              )}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="hover:bg-[#E6F0FF] transition-colors hidden sm:flex"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-[#718096]" />
              ) : (
                <Sun className="w-5 h-5 text-[#718096]" />
              )}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-[#E6F0FF] transition-colors"
                >
                  <Bell className="w-5 h-5 text-[#718096]" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-[#FF6B35] text-white text-xs animate-pulse"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="font-semibold">Notifications</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </Button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[#718096]">
                      No notifications
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={`p-3 cursor-pointer ${!notification.isRead ? 'bg-[#E6F0FF]/50' : ''}`}
                        onClick={() => notification.link && navigate(notification.link)}
                      >
                        <div className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            !notification.isRead ? 'bg-[#0056D1]' : 'bg-transparent'
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-[#718096]">{notification.message}</p>
                            <p className="text-xs text-[#718096] mt-1">
                              {new Date(notification.createdAt).toRelativeTimeString()}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/notifications')}>
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-[#E6F0FF] transition-colors">
                  <Avatar className="w-8 h-8 border-2 border-[#0056D1]">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-[#0056D1] text-white text-sm">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium text-[#1A202C]">
                    {user?.firstName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#718096] hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-[#718096]">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
