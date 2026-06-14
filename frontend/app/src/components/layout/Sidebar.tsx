import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Award, 
  Users, 
  BarChart3, 
  Settings, 
  ChevronRight,
  FileText,
  UserPlus,
  FolderOpen
} from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
  children?: NavItem[];
}

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Courses', path: '/courses', icon: BookOpen },
  { label: 'My Learning', path: '/learning/1', icon: GraduationCap },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Achievements', path: '/achievements', icon: Award },
];

const teacherNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { 
    label: 'Course Management', 
    path: '/teacher', 
    icon: FolderOpen,
    children: [
      { label: 'All Courses', path: '/teacher/courses', icon: BookOpen },
      { label: 'Create Course', path: '/teacher/courses/new', icon: FileText },
    ]
  },
  { label: 'Analytics', path: '/teacher/analytics', icon: BarChart3 },
  { label: 'Students', path: '/teacher/users', icon: Users },
];

const adminNavItems: NavItem[] = [
  ...teacherNavItems,
  { label: 'User Management', path: '/teacher/users', icon: UserPlus },
];

export default function Sidebar() {
  const { sidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navItems = user?.role === 'admin' 
    ? adminNavItems 
    : user?.role === 'teacher' 
    ? teacherNavItems 
    : studentNavItems;

  const toggleExpand = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={`fixed left-0 top-20 bottom-0 bg-white border-r border-[#E6F0FF] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-40 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="h-full flex flex-col py-4">
        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <div key={item.path}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group",
                      isActive(item.path) 
                        ? "bg-[#0056D1] text-white" 
                        : "text-[#718096] hover:bg-[#E6F0FF] hover:text-[#0056D1]"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 flex-shrink-0 transition-transform duration-300",
                      isActive(item.path) ? "" : "group-hover:scale-110"
                    )} />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-sm font-medium text-left">
                          {item.label}
                        </span>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          expandedItems.includes(item.path) && "rotate-90"
                        )} />
                      </>
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {sidebarOpen && expandedItems.includes(item.path) && (
                    <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300",
                            isActive(child.path)
                              ? "bg-[#E6F0FF] text-[#0056D1]"
                              : "text-[#718096] hover:bg-[#E6F0FF]/50 hover:text-[#0056D1]"
                          )}
                        >
                          <child.icon className="w-4 h-4" />
                          <span className="text-sm">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative",
                    isActive(item.path) 
                      ? "bg-[#0056D1] text-white shadow-lg shadow-[#0056D1]/25" 
                      : "text-[#718096] hover:bg-[#E6F0FF] hover:text-[#0056D1]"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-transform duration-300",
                    isActive(item.path) ? "" : "group-hover:scale-110"
                  )} />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {item.badge && (
                    <span className={cn(
                      "ml-auto text-xs font-bold px-2 py-0.5 rounded-full",
                      isActive(item.path) 
                        ? "bg-white text-[#0056D1]" 
                        : "bg-[#FF6B35] text-white"
                    )}>
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!sidebarOpen && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-[#1A202C] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
                      {item.label}
                      <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-[#1A202C]" />
                    </div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pt-4 border-t border-[#E6F0FF]">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group",
              isActive('/settings')
                ? "bg-[#0056D1] text-white"
                : "text-[#718096] hover:bg-[#E6F0FF] hover:text-[#0056D1]"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}
