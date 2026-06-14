import { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  GraduationCap,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive';
  enrolledCourses: number;
  lastActive: string;
  avatar?: string;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'student', status: 'active', enrolledCourses: 5, lastActive: '2 hours ago', avatar: 'https://i.pravatar.cc/150?u=40' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'student', status: 'active', enrolledCourses: 3, lastActive: '5 hours ago', avatar: 'https://i.pravatar.cc/150?u=41' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'teacher', status: 'active', enrolledCourses: 0, lastActive: '1 day ago', avatar: 'https://i.pravatar.cc/150?u=42' },
    { id: '4', name: 'David Brown', email: 'david@example.com', role: 'admin', status: 'active', enrolledCourses: 0, lastActive: '30 mins ago', avatar: 'https://i.pravatar.cc/150?u=43' },
    { id: '5', name: 'Emma Davis', email: 'emma@example.com', role: 'student', status: 'inactive', enrolledCourses: 2, lastActive: '1 week ago', avatar: 'https://i.pravatar.cc/150?u=44' },
    { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'teacher', status: 'active', enrolledCourses: 0, lastActive: '3 hours ago', avatar: 'https://i.pravatar.cc/150?u=45' },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'students') return matchesSearch && user.role === 'student';
    if (activeTab === 'teachers') return matchesSearch && user.role === 'teacher';
    if (activeTab === 'admins') return matchesSearch && user.role === 'admin';
    return matchesSearch;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('User added successfully!');
    setIsAddUserOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('User deleted successfully');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
    toast.success('Status updated');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'teacher': return <GraduationCap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-600';
      case 'teacher': return 'bg-blue-100 text-blue-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">User Management</h1>
          <p className="text-[#718096]">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0056D1]">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account. They will receive an email with login instructions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Enter full name" required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="Enter email" required />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#0056D1]">
                    Create User
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500' },
          { label: 'Students', value: users.filter(u => u.role === 'student').length, icon: GraduationCap, color: 'bg-green-500' },
          { label: 'Teachers', value: users.filter(u => u.role === 'teacher').length, icon: Shield, color: 'bg-purple-500' },
          { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'bg-red-500' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A202C]">{stat.value}</p>
                <p className="text-sm text-[#718096]">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 border-[#E6F0FF] focus:border-[#0056D1] rounded-xl"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-[#F8FAFC]">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              All
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              Students
            </TabsTrigger>
            <TabsTrigger value="teachers" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              Teachers
            </TabsTrigger>
            <TabsTrigger value="admins" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              Admins
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* User List */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E6F0FF] bg-[#F8FAFC]">
                  <th className="text-left py-4 px-6 font-medium text-[#718096]">User</th>
                  <th className="text-left py-4 px-6 font-medium text-[#718096]">Role</th>
                  <th className="text-left py-4 px-6 font-medium text-[#718096]">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-[#718096]">Courses</th>
                  <th className="text-left py-4 px-6 font-medium text-[#718096]">Last Active</th>
                  <th className="text-left py-4 px-6 font-medium text-[#718096]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#E6F0FF] hover:bg-[#F8FAFC]">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#1A202C]">{user.name}</p>
                          <p className="text-sm text-[#718096]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={`${getRoleColor(user.role)} capitalize flex items-center gap-1 w-fit`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {user.status === 'active' ? (
                          <><CheckCircle className="w-4 h-4" /> Active</>
                        ) : (
                          <><XCircle className="w-4 h-4" /> Inactive</>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-[#718096]">
                      {user.role === 'student' ? user.enrolledCourses : '-'}
                    </td>
                    <td className="py-4 px-6 text-[#718096]">{user.lastActive}</td>
                    <td className="py-4 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#718096]">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
