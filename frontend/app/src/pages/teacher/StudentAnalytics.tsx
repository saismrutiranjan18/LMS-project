import { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Award, 
  Download, 
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data for charts
const enrollmentData = [
  { month: 'Jan', students: 120 },
  { month: 'Feb', students: 150 },
  { month: 'Mar', students: 180 },
  { month: 'Apr', students: 220 },
  { month: 'May', students: 280 },
  { month: 'Jun', students: 350 },
];

const completionData = [
  { name: 'Completed', value: 68, color: '#28A745' },
  { name: 'In Progress', value: 25, color: '#0056D1' },
  { name: 'Not Started', value: 7, color: '#718096' },
];

const performanceData = [
  { range: '90-100%', count: 45 },
  { range: '80-89%', count: 78 },
  { range: '70-79%', count: 52 },
  { range: '60-69%', count: 28 },
  { range: 'Below 60%', count: 12 },
];

const students = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', progress: 95, score: 92, timeSpent: 45, lastActive: '2 hours ago', avatar: 'https://i.pravatar.cc/150?u=30' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', progress: 78, score: 85, timeSpent: 32, lastActive: '5 hours ago', avatar: 'https://i.pravatar.cc/150?u=31' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', progress: 45, score: 72, timeSpent: 18, lastActive: '1 day ago', avatar: 'https://i.pravatar.cc/150?u=32' },
  { id: '4', name: 'David Brown', email: 'david@example.com', progress: 100, score: 98, timeSpent: 52, lastActive: '30 mins ago', avatar: 'https://i.pravatar.cc/150?u=33' },
  { id: '5', name: 'Emma Davis', email: 'emma@example.com', progress: 62, score: 78, timeSpent: 25, lastActive: '3 hours ago', avatar: 'https://i.pravatar.cc/150?u=34' },
];

export default function StudentAnalytics() {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedCourse, setSelectedCourse] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Student Analytics</h1>
          <p className="text-[#718096]">Track student progress and engagement</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="1">Web Design</SelectItem>
              <SelectItem value="2">Python</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Students', 
            value: '1,234', 
            change: '+12%', 
            trend: 'up',
            icon: Users, 
            color: 'bg-blue-500' 
          },
          { 
            label: 'Avg. Completion', 
            value: '68%', 
            change: '+5%', 
            trend: 'up',
            icon: TrendingUp, 
            color: 'bg-green-500' 
          },
          { 
            label: 'Avg. Time Spent', 
            value: '12.5h', 
            change: '-2%', 
            trend: 'down',
            icon: Clock, 
            color: 'bg-purple-500' 
          },
          { 
            label: 'Certificates', 
            value: '456', 
            change: '+18%', 
            trend: 'up',
            icon: Award, 
            color: 'bg-yellow-500' 
          },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#718096]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#1A202C] mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="text-sm">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start bg-white mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trend */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Enrollment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E6F0FF" />
                      <XAxis dataKey="month" stroke="#718096" />
                      <YAxis stroke="#718096" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="students" 
                        stroke="#0056D1" 
                        strokeWidth={3}
                        dot={{ fill: '#0056D1', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Completion Status */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Completion Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {completionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {completionData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-[#718096]">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student List */}
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Top Performing Students</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E6F0FF]">
                      <th className="text-left py-3 px-4 font-medium text-[#718096]">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-[#718096]">Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-[#718096]">Avg. Score</th>
                      <th className="text-left py-3 px-4 font-medium text-[#718096]">Time Spent</th>
                      <th className="text-left py-3 px-4 font-medium text-[#718096]">Last Active</th>
                      <th className="text-left py-3 px-4 font-medium text-[#718096]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-[#E6F0FF] hover:bg-[#F8FAFC]">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-[#1A202C]">{student.name}</p>
                              <p className="text-sm text-[#718096]">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Progress value={student.progress} className="w-24 h-2" />
                            <span className="text-sm">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-medium ${student.score >= 90 ? 'text-green-500' : student.score >= 70 ? 'text-blue-500' : 'text-yellow-500'}`}>
                            {student.score}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[#718096]">{student.timeSpent}h</td>
                        <td className="py-4 px-4 text-[#718096]">{student.lastActive}</td>
                        <td className="py-4 px-4">
                          <Badge className={student.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}>
                            {student.progress === 100 ? 'Completed' : 'Active'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-0">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Daily Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6F0FF" />
                    <XAxis dataKey="month" stroke="#718096" />
                    <YAxis stroke="#718096" />
                    <Tooltip />
                    <Bar dataKey="students" fill="#0056D1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-0">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6F0FF" />
                    <XAxis type="number" stroke="#718096" />
                    <YAxis dataKey="range" type="category" stroke="#718096" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0056D1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
