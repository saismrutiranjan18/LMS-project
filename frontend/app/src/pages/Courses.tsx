import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  ChevronDown,
  BookOpen,
  TrendingUp,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCourseStore } from '@/store';
import { toast } from 'sonner';

const categories = ['All', 'Design', 'Development', 'Business', 'Marketing', 'Data Science'];
const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const sortOptions = ['Most Popular', 'Highest Rated', 'Newest', 'Price: Low to High'];

export default function Courses() {
  const [searchParams] = useSearchParams();
  const { courses, fetchCourses, isLoading, enrollCourse } = useCourseStore();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSort, setSelectedSort] = useState('Most Popular');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel.toLowerCase();
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollCourse(courseId);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      toast.error('Failed to enroll');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1A202C] mb-4">
          Explore Our Courses
        </h1>
        <p className="text-[#718096]">
          Discover thousands of courses taught by industry experts and start learning today
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 border-[#E6F0FF] focus:border-[#0056D1] rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-[#E6F0FF]">
                <Filter className="w-4 h-4" />
                {selectedCategory}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {categories.map((cat) => (
                <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Level Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-[#E6F0FF]">
                <TrendingUp className="w-4 h-4" />
                {selectedLevel}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {levels.map((level) => (
                <DropdownMenuItem key={level} onClick={() => setSelectedLevel(level)}>
                  {level}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-[#E6F0FF]">
                <Award className="w-4 h-4" />
                {selectedSort}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option} onClick={() => setSelectedSort(option)}>
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#0056D1] text-white'
                : 'bg-white text-[#718096] hover:bg-[#E6F0FF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-[#718096]">
          Showing <span className="font-semibold text-[#1A202C]">{filteredCourses.length}</span> courses
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <Card 
            key={course.id} 
            className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className="bg-[#0056D1]">{course.category}</Badge>
                <Badge variant="secondary" className="capitalize">
                  {course.level}
                </Badge>
              </div>

              {/* Price */}
              <div className="absolute bottom-3 right-3">
                <span className="text-2xl font-bold text-white">${course.price}</span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-[#0056D1]" />
                </div>
              </div>
            </div>

            <CardContent className="p-5">
              {/* Title */}
              <Link to={`/courses/${course.id}`}>
                <h3 className="font-bold text-lg text-[#1A202C] group-hover:text-[#0056D1] transition-colors line-clamp-2 mb-2">
                  {course.title}
                </h3>
              </Link>

              <p className="text-sm text-[#718096] line-clamp-2 mb-4">
                {course.description}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-2 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-[#718096]">{course.instructor.name}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-[#718096] mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-[#1A202C]">{course.rating}</span>
                  <span>({course.enrolledCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.enrolledCount}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link to={`/courses/${course.id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-[#0056D1] text-[#0056D1] hover:bg-[#0056D1] hover:text-white">
                    Preview
                  </Button>
                </Link>
                <Button 
                  className="flex-1 bg-[#0056D1] hover:bg-[#002A6C]"
                  onClick={() => handleEnroll(course.id)}
                >
                  Enroll Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-[#E6F0FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-[#718096]" />
          </div>
          <h3 className="text-xl font-bold text-[#1A202C] mb-2">No courses found</h3>
          <p className="text-[#718096]">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
