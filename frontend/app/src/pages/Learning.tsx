import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CheckCircle, Circle, FileText,
  Flag, Menu, X, Play, Lock, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { curriculumApi, enrollmentApi } from '@/services/api';
import type { CurriculumDto, LessonCurriculumDto, ModuleCurriculumDto } from '@/services/api';
import { toast } from 'sonner';

export default function Learning() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [curriculum, setCurriculum] = useState<CurriculumDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeLesson, setActiveLesson] = useState<LessonCurriculumDto | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [note, setNote] = useState('');

  // ── Fetch curriculum ──────────────────────────────────────────────────────

  const fetchCurriculum = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const { data } = await curriculumApi.get(courseId);
      const c = data.data;
      setCurriculum(c);
      // Auto-select first accessible lesson
      const first = c.modules
        .flatMap((m) => m.lessons)
        .find((l) => l.accessible);
      if (first) setActiveLesson(first);
    } catch {
      toast.error('Could not load course content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, [courseId]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const allLessons: LessonCurriculumDto[] =
    curriculum?.modules.flatMap((m) => m.lessons) ?? [];

  const currentIndex = activeLesson
    ? allLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) setActiveLesson(allLessons[currentIndex - 1]);
  };

  const handleNext = () => {
    if (currentIndex < allLessons.length - 1)
      setActiveLesson(allLessons[currentIndex + 1]);
  };

  const handleMarkComplete = () => {
    if (!activeLesson || completedIds.includes(activeLesson.id)) return;
    setCompletedIds((prev) => [...prev, activeLesson.id]);
    toast.success('Lesson marked complete!');
  };

  const handleEnroll = async () => {
    if (!courseId) return;
    setEnrolling(true);
    try {
      await enrollmentApi.enroll(courseId);
      toast.success('Enrolled! All lessons are now unlocked.');
      await fetchCurriculum();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Enrollment failed';
      toast.error(msg);
    } finally {
      setEnrolling(false);
    }
  };

  const overallProgress =
    allLessons.length > 0
      ? Math.round((completedIds.length / allLessons.length) * 100)
      : 0;

  // ── Loading ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#0056D1]" />
      </div>
    );
  }

  if (!curriculum) return null;

  // ── Main area content based on active lesson ──────────────────────────────

  const renderMainArea = () => {
    // Nothing selected yet
    if (!activeLesson) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#F8FAFC]">
          <p className="text-[#718096]">Select a lesson from the sidebar</p>
        </div>
      );
    }

    // Lesson is locked
    if (!activeLesson.accessible) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8FAFC] gap-4 p-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-[#1A202C]">This lesson is locked</h3>
          <p className="text-[#718096] text-center max-w-sm">
            Enroll in the course to access all lessons and track your progress.
          </p>
          <Button
            className="bg-[#0056D1] mt-2"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Enroll Now — Unlock All Lessons'
            )}
          </Button>
        </div>
      );
    }

    // VIDEO lesson with embed URL
    if (activeLesson.type === 'VIDEO' && activeLesson.videoUrl) {
      return (
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            key={activeLesson.id}            /* remount on lesson change */
            className="absolute inset-0 w-full h-full"
            src={activeLesson.videoUrl}
            title={activeLesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // TEXT lesson
    if (activeLesson.type === 'TEXT') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
          <FileText className="w-16 h-16 text-green-500" />
          <h3 className="text-xl font-bold text-[#1A202C]">Text Lesson</h3>
          <p className="text-[#718096]">Content loaded below in the overview tab</p>
        </div>
      );
    }

    // QUIZ lesson
    if (activeLesson.type === 'QUIZ') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
          <div className="w-20 h-20 bg-[#0056D1] rounded-full flex items-center justify-center">
            <Flag className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#1A202C]">Quiz Time!</h3>
          <Button
            className="bg-[#0056D1]"
            onClick={() => navigate(`/quiz/${activeLesson.id}`)}
          >
            Start Quiz
          </Button>
        </div>
      );
    }

    return null;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-5rem)] -m-6 flex">
      {/* Main area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? 'mr-80' : ''}`}>

        {/* Video / content area */}
        <div className="relative bg-black min-h-[56.25vw] lg:min-h-0 lg:aspect-video">
          {renderMainArea()}

          {/* Sidebar toggle */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute top-3 right-3 w-9 h-9 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 z-10"
          >
            {showSidebar ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Lesson info + navigation */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-[#1A202C] mb-1">
                  {activeLesson?.title ?? curriculum.courseTitle}
                </h1>
                <p className="text-[#718096]">{curriculum.courseTitle}</p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <Button variant="outline" onClick={handlePrev} disabled={currentIndex <= 0}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                <Button
                  className="bg-[#0056D1]"
                  onClick={handleMarkComplete}
                  disabled={
                    !activeLesson?.accessible ||
                    (activeLesson ? completedIds.includes(activeLesson.id) : true)
                  }
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {activeLesson && completedIds.includes(activeLesson.id)
                    ? 'Completed'
                    : 'Mark Complete'}
                </Button>
                <Button variant="outline" onClick={handleNext} disabled={currentIndex >= allLessons.length - 1}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <p className="text-[#718096]">
                  {activeLesson?.accessible
                    ? 'Watch the video above and mark the lesson complete when you are done.'
                    : 'Enroll in the course to access lesson content.'}
                </p>
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <Textarea
                      placeholder="Take notes while learning..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="min-h-[160px] resize-none"
                    />
                    <div className="flex justify-end mt-3">
                      <Button className="bg-[#0056D1]" onClick={() => toast.success('Notes saved!')}>
                        Save Notes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <div
        className={`fixed right-0 top-20 bottom-0 w-80 bg-white border-l border-[#E6F0FF] overflow-auto z-40 transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Progress header */}
        <div className="p-4 border-b border-[#E6F0FF]">
          <p className="font-bold text-[#1A202C] mb-2">Course Content</p>
          <div className="flex items-center gap-2">
            <Progress value={overallProgress} className="flex-1 h-2" />
            <span className="text-sm text-[#718096]">{overallProgress}%</span>
          </div>
          <p className="text-xs text-[#718096] mt-1">
            {completedIds.length} / {allLessons.length} lessons completed
          </p>
          {!curriculum.enrolled && (
            <Button
              className="w-full mt-3 bg-[#0056D1] text-sm h-9"
              onClick={handleEnroll}
              disabled={enrolling}
            >
              {enrolling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                '🔓 Enroll to unlock all lessons'
              )}
            </Button>
          )}
        </div>

        {/* Module tree */}
        <div className="divide-y divide-[#E6F0FF]">
          {curriculum.modules.map((module: ModuleCurriculumDto) => (
            <div key={module.id}>
              {/* Module title row */}
              <div className="px-4 py-3 bg-[#F8FAFC]">
                <p className="font-semibold text-sm text-[#1A202C]">{module.title}</p>
                <p className="text-xs text-[#718096]">{module.lessons.length} lessons</p>
              </div>

              {/* Lessons */}
              {module.lessons.map((lesson) => {
                const isActive = activeLesson?.id === lesson.id;
                const isDone = completedIds.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                      isActive ? 'bg-[#E6F0FF]' : 'hover:bg-[#F8FAFC]'
                    } ${!lesson.accessible ? 'opacity-50' : ''}`}
                  >
                    {/* Status icon */}
                    {isDone ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : lesson.accessible ? (
                      isActive ? (
                        <Play className="w-5 h-5 text-[#0056D1] shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#718096] shrink-0" />
                      )
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400 shrink-0" />
                    )}

                    {/* Lesson info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm truncate ${
                          isActive
                            ? 'font-medium text-[#0056D1]'
                            : 'text-[#1A202C]'
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-xs text-[#718096] mt-0.5">
                        {lesson.type.toLowerCase()}
                        {lesson.freePreview && (
                          <span className="ml-2 text-orange-500">• preview</span>
                        )}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}