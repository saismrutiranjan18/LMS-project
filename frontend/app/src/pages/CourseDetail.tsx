import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Award, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Download,
  Share2,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useCourseStore } from '@/store';
import { toast } from 'sonner';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { courses, fetchCourse, currentCourse, isLoading, enrollCourse } = useCourseStore();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    }
  }, [id, fetchCourse]);

  const course = currentCourse || courses.find(c => c.id === id);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(m => m !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleEnroll = async () => {
    if (course) {
      try {
        await enrollCourse(course.id);
        toast.success('Successfully enrolled!');
      } catch (error) {
        toast.error('Failed to enroll');
      }
    }
  };

  if (isLoading || !course) {
    return (
      <div className="space-y-6">
        <div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-80 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#002A6C] to-[#0056D1] rounded-3xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="detailGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#detailGrid)" />
          </svg>
        </div>

        <div className="relative z-10 p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Course Info */}
            <div className="flex-1 text-white">
              <div className="flex gap-2 mb-4">
                <Badge className="bg-white/20 text-white">{course.category}</Badge>
                <Badge className="bg-white/20 text-white capitalize">{course.level}</Badge>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              
              <p className="text-white/80 text-lg mb-6 max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-white/60">({course.enrolledCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrolledCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span>Certificate of completion</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <Avatar className="w-12 h-12 border-2 border-white">
                  <AvatarImage src={course.instructor.avatar} />
                  <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-white/60">{course.instructor.bio}</p>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <Card className="w-full lg:w-80 flex-shrink-0">
              <CardContent className="p-6">
                <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-[#0056D1] ml-1" />
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-[#1A202C]">${course.price}</span>
                  <span className="text-lg text-[#718096] line-through">${course.price * 1.5}</span>
                  <Badge className="bg-green-500">33% OFF</Badge>
                </div>

                <Button 
                  className="w-full h-12 bg-[#0056D1] hover:bg-[#002A6C] text-white font-semibold rounded-xl mb-3"
                  onClick={handleEnroll}
                >
                  Enroll Now
                </Button>

                <p className="text-center text-sm text-[#718096] mb-4">
                  30-day money-back guarantee
                </p>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    Wishlist
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Duration</span>
                    <span className="font-medium">{Math.floor(course.duration / 60)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Lectures</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Skill Level</span>
                    <span className="font-medium capitalize">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#718096]">Language</span>
                    <span className="font-medium">English</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="w-full justify-start bg-white p-1 rounded-xl mb-6">
              <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
                Course Content
              </TabsTrigger>
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="instructor" className="rounded-lg data-[state=active]:bg-[#0056D1] data-[state=active]:text-white">
                Instructor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#1A202C]">Course Content</h3>
                      <p className="text-sm text-[#718096]">12 modules • 42 lessons • {Math.floor(course.duration / 60)} hours</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#718096]">Your progress</span>
                      <Progress value={0} className="w-32 h-2" />
                      <span className="text-sm font-medium">0%</span>
                    </div>
                  </div>

                  {/* Mock Modules */}
                  <div className="space-y-3">
                    {[
                      { id: '1', title: 'Introduction to the Course', lessons: 3, duration: 15, completed: true },
                      { id: '2', title: 'Setting Up Your Environment', lessons: 5, duration: 45, completed: false },
                      { id: '3', title: 'Core Concepts', lessons: 8, duration: 120, completed: false },
                      { id: '4', title: 'Advanced Techniques', lessons: 6, duration: 90, completed: false },
                      { id: '5', title: 'Real-World Projects', lessons: 4, duration: 180, completed: false },
                    ].map((module) => (
                      <div key={module.id} className="border border-[#E6F0FF] rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-[#E6F0FF]/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {module.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-[#718096]" />
                            )}
                            <span className="font-medium text-[#1A202C]">{module.title}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-[#718096]">{module.lessons} lessons • {module.duration} min</span>
                            {expandedModules.includes(module.id) ? (
                              <ChevronUp className="w-5 h-5 text-[#718096]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-[#718096]" />
                            )}
                          </div>
                        </button>
                        
                        {expandedModules.includes(module.id) && (
                          <div className="border-t border-[#E6F0FF] bg-[#F8FAFC]">
                            {Array.from({ length: module.lessons }).map((_, i) => (
                              <div 
                                key={i} 
                                className="flex items-center justify-between p-4 hover:bg-white transition-colors cursor-pointer"
                              >
                                <div className="flex items-center gap-3">
                                  <Play className="w-4 h-4 text-[#718096]" />
                                  <span className="text-sm text-[#1A202C]">Lesson {i + 1}: Topic Name</span>
                                </div>
                                <span className="text-sm text-[#718096]">10:00</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview" className="mt-0">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A202C] mb-3">What you'll learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        'Master the fundamentals and advanced concepts',
                        'Build real-world projects from scratch',
                        'Understand best practices and industry standards',
                        'Learn to debug and solve common problems',
                        'Get certified and boost your career',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#1A202C]">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold text-[#1A202C] mb-3">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-[#1A202C]">
                      <li>Basic computer skills</li>
                      <li>A computer with internet access</li>
                      <li>Willingness to learn and practice</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold text-[#1A202C] mb-3">Description</h3>
                    <p className="text-sm text-[#718096] leading-relaxed">
                      {course.description} This comprehensive course is designed to take you from beginner to advanced level. 
                      You'll learn through hands-on projects, quizzes, and real-world examples. By the end of this course, 
                      you'll have the skills and confidence to tackle any challenge in this field.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-8 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-[#1A202C]">{course.rating}</div>
                      <div className="flex justify-center gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-5 h-5 ${star <= Math.floor(course.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-[#718096]">Course Rating</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm w-3">{rating}</span>
                          <Star className="w-4 h-4 text-yellow-400" />
                          <Progress value={rating === 5 ? 70 : rating === 4 ? 20 : 10} className="flex-1 h-2" />
                          <span className="text-sm text-[#718096] w-12 text-right">
                            {rating === 5 ? '70%' : rating === 4 ? '20%' : '10%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    {[
                      { name: 'John D.', rating: 5, date: '2 days ago', comment: 'Excellent course! The instructor explains everything clearly.' },
                      { name: 'Sarah M.', rating: 5, date: '1 week ago', comment: 'Best investment I made for my career. Highly recommended!' },
                      { name: 'Mike R.', rating: 4, date: '2 weeks ago', comment: 'Great content, but could use more practical examples.' },
                    ].map((review, i) => (
                      <div key={i} className="border-b border-[#E6F0FF] pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{review.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{review.name}</span>
                          </div>
                          <span className="text-xs text-[#718096]">{review.date}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm text-[#718096]">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructor" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={course.instructor.avatar} />
                      <AvatarFallback className="text-2xl">{course.instructor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-[#1A202C]">{course.instructor.name}</h3>
                      <p className="text-[#718096]">{course.instructor.bio}</p>
                      <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm">4.8 Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">15,000 Students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Play className="w-4 h-4" />
                          <span className="text-sm">12 Courses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-[#1A202C] mb-4">This course includes:</h3>
              <ul className="space-y-3">
                {[
                  { icon: Play, text: `${Math.floor(course.duration / 60)} hours on-demand video` },
                  { icon: FileText, text: '42 downloadable resources' },
                  { icon: MessageSquare, text: 'Access on mobile and TV' },
                  { icon: Award, text: 'Certificate of completion' },
                  { icon: Download, text: 'Lifetime access' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#718096]">
                    <item.icon className="w-5 h-5 text-[#0056D1]" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-[#1A202C] mb-4">Related Courses</h3>
              <div className="space-y-4">
                {courses.filter(c => c.id !== course.id).slice(0, 3).map((relatedCourse) => (
                  <Link 
                    key={relatedCourse.id} 
                    to={`/courses/${relatedCourse.id}`}
                    className="flex gap-3 group"
                  >
                    <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={relatedCourse.thumbnail} 
                        alt={relatedCourse.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-[#1A202C] group-hover:text-[#0056D1] transition-colors line-clamp-2">
                        {relatedCourse.title}
                      </h4>
                      <p className="text-xs text-[#718096]">${relatedCourse.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
