import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Play, 
  Award,
  ChevronRight,
  Zap,
  Target,
  MessageCircle,
  Calendar,
  AlertCircle,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDashboardStore, useAuthStore, useCourseStore } from '@/store';
import { gsap } from 'gsap';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { stats, leaderboard, activities, deadlines, badges, isLoading, fetchDashboardData } = useDashboardStore();
  const { courses } = useCourseStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    // GSAP Animations
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll('.hero-title'),
        { y: 50, opacity: 0, rotateX: 90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1, ease: 'expo.out', stagger: 0.1 }
      );
    }

    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.querySelectorAll('.stat-card'),
        { z: -500, opacity: 0 },
        { z: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.3 }
      );
    }
  }, []);

  const statCards = [
    { 
      title: 'Current Streak', 
      value: stats?.streak || 0, 
      unit: 'days', 
      icon: Flame, 
      color: 'from-orange-400 to-red-500',
      glow: true 
    },
    { 
      title: 'In Progress', 
      value: stats?.coursesInProgress || 0, 
      unit: 'courses', 
      icon: BookOpen, 
      color: 'from-blue-400 to-blue-600' 
    },
    { 
      title: 'Avg. Score', 
      value: stats?.averageScore || 0, 
      unit: '%', 
      icon: TrendingUp, 
      color: 'from-green-400 to-green-600' 
    },
    { 
      title: 'Learning Time', 
      value: Math.floor((stats?.totalLearningTime || 0) / 60), 
      unit: 'hours', 
      icon: Clock, 
      color: 'from-purple-400 to-purple-600' 
    },
    { 
      title: 'Certificates', 
      value: stats?.certificatesEarned || 0, 
      unit: 'earned', 
      icon: Award, 
      color: 'from-yellow-400 to-yellow-600' 
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-64 bg-gray-200 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E6F0FF] via-white to-[#E6F0FF] p-8 lg:p-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="heroGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#0056D1" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#heroGrid)" />
          </svg>
        </div>
        
        {/* Floating Shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#0056D1]/10 rounded-full blur-3xl floating" />
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-[#FF6B35]/10 rounded-full blur-2xl floating" style={{ animationDelay: '1s' }} />

        <div className="relative z-10">
          <div className="max-w-2xl">
            <h1 className="hero-title text-4xl lg:text-5xl font-bold text-[#1A202C] mb-4">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="hero-title text-lg text-[#718096] mb-6">
              Continue your journey to mastering new skills. You're making great progress!
            </p>
            
            {stats?.nextLesson && (
              <div className="hero-title flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                <div className="w-16 h-16 rounded-xl overflow-hidden">
                  <img 
                    src={stats.nextLesson.thumbnail} 
                    alt={stats.nextLesson.courseTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#718096]">Continue where you left off</p>
                  <p className="font-semibold text-[#1A202C]">{stats.nextLesson.lessonTitle}</p>
                  <p className="text-xs text-[#0056D1]">{stats.nextLesson.courseTitle}</p>
                </div>
                <Link to="/learning/1">
                  <Button className="bg-[#0056D1] hover:bg-[#002A6C] rounded-xl">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="stat-card group relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#718096] mb-1">{stat.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[#1A202C]">{stat.value}</span>
                    <span className="text-sm text-[#718096]">{stat.unit}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center ${stat.glow ? 'pulse-glow' : ''}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold text-[#1A202C]">
                Continue Learning
              </CardTitle>
              <Link to="/courses">
                <Button variant="ghost" size="sm" className="text-[#0056D1]">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {courses.slice(0, 3).map((course, index) => (
                <div 
                  key={course.id} 
                  className="flex gap-4 p-4 rounded-xl hover:bg-[#E6F0FF]/50 transition-colors group cursor-pointer"
                >
                  <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[#1A202C] truncate group-hover:text-[#0056D1] transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-sm text-[#718096]">{course.instructor.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={[75, 30, 50][index] || 0} className="h-2 flex-1" />
                      <span className="text-xs text-[#718096]">{[75, 30, 50][index] || 0}%</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 text-[#0056D1]" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold text-[#1A202C]">
                Recommended for You
              </CardTitle>
              <div className="flex gap-2">
                {['All', 'Design', 'Development'].map((tab) => (
                  <Button 
                    key={tab} 
                    variant={tab === 'All' ? 'default' : 'ghost'} 
                    size="sm"
                    className={tab === 'All' ? 'bg-[#0056D1]' : 'text-[#718096]'}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.slice(3, 5).map((course) => (
                  <div 
                    key={course.id} 
                    className="group cursor-pointer rounded-xl overflow-hidden border border-[#E6F0FF] hover:border-[#0056D1] transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Badge className="absolute top-2 left-2 bg-[#0056D1]">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-[#1A202C] group-hover:text-[#0056D1] transition-colors line-clamp-1">
                        {course.title}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={course.instructor.avatar} />
                            <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-[#718096]">{course.instructor.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Top Learners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <div 
                  key={entry.user.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'hover:bg-[#E6F0FF]/50'
                  } transition-colors`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400 text-white' :
                    index === 1 ? 'bg-gray-300 text-white' :
                    index === 2 ? 'bg-orange-400 text-white' :
                    'bg-[#E6F0FF] text-[#718096]'
                  }`}>
                    {entry.rank}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={entry.user.avatar} />
                    <AvatarFallback>{entry.user.firstName[0]}{entry.user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#1A202C] truncate">
                      {entry.user.firstName} {entry.user.lastName}
                    </p>
                    <p className="text-xs text-[#718096]">{entry.points.toLocaleString()} pts</p>
                  </div>
                  {index === 0 && <span className="text-2xl">👑</span>}
                </div>
              ))}
              <Link to="/leaderboard">
                <Button variant="ghost" className="w-full text-[#0056D1]">
                  View Full Leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0056D1]" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 justify-center">
                {badges.slice(0, 4).map((badge) => (
                  <div 
                    key={badge.id}
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      badge.isUnlocked 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg' 
                        : 'bg-gray-200'
                    } transition-transform hover:scale-110 cursor-pointer`}
                    title={badge.name}
                  >
                    {badge.isUnlocked ? (
                      <Zap className="w-6 h-6 text-white" />
                    ) : (
                      <Target className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-[#718096] mt-3">
                {badges.filter(b => b.isUnlocked).length} of {badges.length} unlocked
              </p>
              <Link to="/achievements">
                <Button variant="ghost" className="w-full text-[#0056D1] mt-2">
                  View All Badges
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-500" />
                Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deadlines.map((deadline) => (
                <div 
                  key={deadline.id}
                  className={`p-3 rounded-xl border-l-4 ${
                    deadline.priority === 'high' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-yellow-500 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className={`w-4 h-4 mt-0.5 ${
                      deadline.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-[#1A202C]">{deadline.title}</p>
                      <p className="text-xs text-[#718096]">{deadline.courseName}</p>
                      <p className={`text-xs mt-1 ${
                        deadline.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        Due {new Date(deadline.dueDate).toRelativeTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Activity */}
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#1A202C] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-[#E6F0FF]/50 rounded-lg transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={activity.user.avatar} />
                    <AvatarFallback>{activity.user.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium text-[#1A202C]">{activity.user.firstName}</span>{' '}
                      <span className="text-[#718096]">{activity.description}</span>
                    </p>
                    <p className="text-xs text-[#718096]">
                      {new Date(activity.timestamp).toRelativeTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
