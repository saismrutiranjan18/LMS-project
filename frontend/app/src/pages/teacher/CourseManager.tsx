import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreHorizontal, 
  Users, 
  Star, 
  Eye,
  BarChart3,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourseStore } from '@/store';
import { toast } from 'sonner';

export default function CourseManager() {
  const { courses } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'published') return matchesSearch && course.enrolledCount > 0;
    if (activeTab === 'draft') return matchesSearch && course.enrolledCount === 0;
    return matchesSearch;
  });

  const handleDelete = (_courseId: string) => {
    toast.success('Course deleted successfully');
  };

  const handleDuplicate = (_courseId: string) => {
    toast.success('Course duplicated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1A202C] mb-2">Course Manager</h1>
          <p className="text-[#718096]">Manage and organize your courses</p>
        </div>
        <Link to="/teacher/courses/new">
          <Button className="bg-[#0056D1] hover:bg-[#002A6C]">
            <Plus className="w-4 h-4 mr-2" />
            Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Courses', value: courses.length, icon: CheckCircle, color: 'bg-blue-500' },
          { label: 'Published', value: courses.filter(c => c.enrolledCount > 0).length, icon: Eye, color: 'bg-green-500' },
          { label: 'Total Students', value: courses.reduce((acc, c) => acc + c.enrolledCount, 0).toLocaleString(), icon: Users, color: 'bg-purple-500' },
          { label: 'Avg. Rating', value: '4.7', icon: Star, color: 'bg-yellow-500' },
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
            placeholder="Search courses..."
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
            <TabsTrigger value="published" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              Published
            </TabsTrigger>
            <TabsTrigger value="draft" className="data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
              Drafts
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Thumbnail */}
                <div className="w-full lg:w-48 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-[#0056D1]">{course.category}</Badge>
                        <Badge variant="secondary" className="capitalize">{course.level}</Badge>
                        {course.enrolledCount > 0 ? (
                          <Badge className="bg-green-500">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#1A202C] mb-1">{course.title}</h3>
                      <p className="text-sm text-[#718096] line-clamp-1">{course.description}</p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/teacher/courses/${course.id}/edit`}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Course
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(course.id)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(course.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#718096]" />
                      <span className="text-sm text-[#718096]">{course.enrolledCount.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-[#718096]">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#718096]" />
                      <span className="text-sm text-[#718096]">{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#1A202C]">${course.price}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#718096]">Course Completion Rate</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <Link to={`/teacher/analytics?course=${course.id}`}>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-[#E6F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#718096]" />
            </div>
            <h3 className="text-xl font-bold text-[#1A202C] mb-2">No courses found</h3>
            <p className="text-[#718096] mb-4">Create your first course to get started</p>
            <Link to="/teacher/courses/new">
              <Button className="bg-[#0056D1]">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
