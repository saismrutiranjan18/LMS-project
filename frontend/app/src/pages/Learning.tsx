import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Circle,
  FileText,
  Download,
  MessageSquare,
  Flag,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

import { useCourseStore } from '@/store';
import { toast } from 'sonner';

export default function Learning() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, fetchCourse, currentCourse, updateProgress } = useCourseStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(600);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeLesson, setActiveLesson] = useState('1');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const course = currentCourse || courses.find(c => c.id === courseId);

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId, fetchCourse]);

  // Mock lessons data
  const modules = [
    {
      id: '1',
      title: 'Introduction',
      lessons: [
        { id: '1', title: 'Welcome to the Course', duration: 300, type: 'video' },
        { id: '2', title: 'Course Overview', duration: 420, type: 'video' },
        { id: '3', title: 'Getting Started Guide', duration: 600, type: 'document' },
      ]
    },
    {
      id: '2',
      title: 'Fundamentals',
      lessons: [
        { id: '4', title: 'Core Concepts', duration: 900, type: 'video' },
        { id: '5', title: 'Basic Principles', duration: 720, type: 'video' },
        { id: '6', title: 'Practice Quiz', duration: 0, type: 'quiz' },
      ]
    },
    {
      id: '3',
      title: 'Advanced Topics',
      lessons: [
        { id: '7', title: 'Deep Dive', duration: 1200, type: 'video' },
        { id: '8', title: 'Real-world Examples', duration: 1500, type: 'video' },
        { id: '9', title: 'Final Project', duration: 0, type: 'assignment' },
      ]
    },
  ];

  const currentLesson = modules.flatMap(m => m.lessons).find(l => l.id === activeLesson);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLessonComplete = () => {
    if (!completedLessons.includes(activeLesson)) {
      setCompletedLessons([...completedLessons, activeLesson]);
      updateProgress(courseId || '', activeLesson);
      toast.success('Lesson completed!');
    }
  };

  const handleNextLesson = () => {
    const allLessons = modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson);
    if (currentIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[currentIndex + 1].id);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handlePrevLesson = () => {
    const allLessons = modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson);
    if (currentIndex > 0) {
      setActiveLesson(allLessons[currentIndex - 1].id);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const overallProgress = Math.round((completedLessons.length / modules.flatMap(m => m.lessons).length) * 100);

  if (!course) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-[calc(100vh-5rem)] -m-6 flex">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? 'mr-80' : ''}`}>
        {/* Video Player */}
        <div className="relative bg-black aspect-video">
          {currentLesson?.type === 'video' ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full"
                poster={course.thumbnail}
                onTimeUpdate={(e) => {
                  setCurrentTime(e.currentTarget.currentTime);
                  setProgress((e.currentTarget.currentTime / duration) * 100);
                }}
              >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>

              {/* Custom Controls */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-[#1A202C]" />
                  ) : (
                    <Play className="w-8 h-8 text-[#1A202C] ml-1" />
                  )}
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <Progress value={progress} className="h-1 mb-4 cursor-pointer" />
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)}>
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <span className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button>
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : currentLesson?.type === 'document' ? (
            <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC]">
              <div className="text-center">
                <FileText className="w-20 h-20 text-[#0056D1] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A202C] mb-2">Document Lesson</h3>
                <p className="text-[#718096] mb-4">Read the materials below</p>
                <Button className="bg-[#0056D1]">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          ) : currentLesson?.type === 'quiz' ? (
            <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC]">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#0056D1] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1A202C] mb-2">Quiz Time!</h3>
                <p className="text-[#718096] mb-4">Test your knowledge</p>
                <Button 
                  className="bg-[#0056D1]"
                  onClick={() => navigate(`/quiz/${activeLesson}`)}
                >
                  Start Quiz
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC]">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1A202C] mb-2">Assignment</h3>
                <p className="text-[#718096] mb-4">Submit your work</p>
                <Button className="bg-[#FF6B35]">
                  View Assignment
                </Button>
              </div>
            </div>
          )}

          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Lesson Info */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1A202C] mb-2">{currentLesson?.title}</h1>
                <p className="text-[#718096]">{course.title}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrevLesson}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button 
                  className="bg-[#0056D1]"
                  onClick={handleLessonComplete}
                  disabled={completedLessons.includes(activeLesson)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {completedLessons.includes(activeLesson) ? 'Completed' : 'Mark Complete'}
                </Button>
                <Button variant="outline" onClick={handleNextLesson}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-[#1A202C] mb-3">About this lesson</h3>
                  <p className="text-[#718096]">
                    In this lesson, we will explore the fundamental concepts that form the foundation of this course. 
                    You'll learn key principles and best practices that will help you master the subject matter.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-[#1A202C] mt-6 mb-3">What you'll learn</h3>
                  <ul className="space-y-2">
                    {[
                      'Understand core concepts and principles',
                      'Apply theoretical knowledge to practical scenarios',
                      'Develop problem-solving skills',
                      'Build a strong foundation for advanced topics'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#718096]">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardContent className="p-4">
                    <Textarea
                      placeholder="Take notes while learning..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    <div className="flex justify-end mt-4">
                      <Button className="bg-[#0056D1]">
                        Save Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussions" className="mt-6">
                <div className="space-y-4">
                  {[
                    { user: 'Sarah M.', comment: 'Great explanation! Really helped me understand the concept.', time: '2 hours ago' },
                    { user: 'John D.', comment: 'Could you provide more examples in the next lesson?', time: '5 hours ago' },
                  ].map((discussion, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{discussion.user[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-[#1A202C]">{discussion.user}</span>
                              <span className="text-xs text-[#718096]">{discussion.time}</span>
                            </div>
                            <p className="text-sm text-[#718096]">{discussion.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="https://i.pravatar.cc/150?u=1" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea placeholder="Add a comment..." className="min-h-[80px]" />
                      <div className="flex justify-end mt-2">
                        <Button className="bg-[#0056D1]">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <div className="space-y-3">
                  {[
                    { name: 'Lesson Slides.pdf', size: '2.5 MB' },
                    { name: 'Exercise Files.zip', size: '15 MB' },
                    { name: 'Reference Guide.pdf', size: '1.2 MB' },
                  ].map((resource, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-4 border border-[#E6F0FF] rounded-xl hover:bg-[#E6F0FF]/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#0056D1]" />
                        <div>
                          <p className="font-medium text-[#1A202C]">{resource.name}</p>
                          <p className="text-sm text-[#718096]">{resource.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="w-5 h-5 text-[#718096]" />
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Sidebar - Course Content */}
      <div 
        className={`fixed right-0 top-20 bottom-0 w-80 bg-white border-l border-[#E6F0FF] overflow-auto transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-[#E6F0FF]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[#1A202C]">Course Content</h3>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={overallProgress} className="flex-1 h-2" />
            <span className="text-sm text-[#718096]">{overallProgress}%</span>
          </div>
          <p className="text-xs text-[#718096] mt-1">
            {completedLessons.length} of {modules.flatMap(m => m.lessons).length} completed
          </p>
        </div>

        <div className="divide-y divide-[#E6F0FF]">
          {modules.map((module) => (
            <div key={module.id}>
              <div className="p-4 bg-[#F8FAFC]">
                <h4 className="font-semibold text-sm text-[#1A202C]">{module.title}</h4>
                <p className="text-xs text-[#718096]">
                  {module.lessons.length} lessons • {Math.floor(module.lessons.reduce((acc, l) => acc + l.duration, 0) / 60)} min
                </p>
              </div>
              {module.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson.id);
                    setIsPlaying(false);
                    setCurrentTime(0);
                  }}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-[#E6F0FF]/50 transition-colors ${
                    activeLesson === lesson.id ? 'bg-[#E6F0FF]' : ''
                  }`}
                >
                  {completedLessons.includes(lesson.id) ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : activeLesson === lesson.id ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#0056D1] bg-[#0056D1] flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#718096] flex-shrink-0" />
                  )}
                  <div className="flex-1 text-left">
                    <p className={`text-sm ${activeLesson === lesson.id ? 'font-medium text-[#0056D1]' : 'text-[#1A202C]'}`}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#718096]">
                      {lesson.type === 'video' && <Play className="w-3 h-3" />}
                      {lesson.type === 'document' && <FileText className="w-3 h-3" />}
                      {lesson.duration > 0 && formatTime(lesson.duration)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
