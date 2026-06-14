import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/services/api';
import type { 
  User, 
  Course, 
  CourseProgress, 
  Notification, 
  Badge, 
  LeaderboardEntry,
  Activity,
  Deadline,
  DashboardStats,
  QuizAttempt
} from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data: res } = await authApi.login(email, password);
          const dto = res.data;
          set({
            token: dto.token,
            isAuthenticated: true,
            isLoading: false,
            user: {
              id: dto.userId,
              email: dto.email,
              firstName: dto.name.split(' ')[0] ?? dto.name,
              lastName: dto.name.split(' ').slice(1).join(' ') ?? '',
              role: dto.role.toLowerCase() as 'student' | 'teacher' | 'admin',
              avatar: dto.avatarUrl ?? undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const { data: res } = await authApi.register(
            `${data.firstName} ${data.lastName}`,
            data.email,
            data.password
          );
          const dto = res.data;
          set({
            token: dto.token,
            isAuthenticated: true,
            isLoading: false,
            user: {
              id: dto.userId,
              email: dto.email,
              firstName: data.firstName,
              lastName: data.lastName,
              role: dto.role.toLowerCase() as 'student' | 'teacher' | 'admin',
              avatar: dto.avatarUrl ?? undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    { name: 'auth-storage' }
  )
);

// Course Store
interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  enrolledCourses: string[];
  courseProgress: Record<string, CourseProgress>;
  isLoading: boolean;
  fetchCourses: () => Promise<void>;
  fetchCourse: (id: string) => Promise<void>;
  enrollCourse: (courseId: string) => Promise<void>;
  updateProgress: (courseId: string, lessonId: string) => void;
  setCurrentCourse: (course: Course | null) => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      courses: [],
      currentCourse: null,
      enrolledCourses: [],
      courseProgress: {},
      isLoading: false,
      fetchCourses: async () => {
        set({ isLoading: true });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockCourses = generateMockCourses();
        set({ courses: mockCourses, isLoading: false });
      },
      fetchCourse: async (id) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        const course = get().courses.find(c => c.id === id) || generateMockCourses()[0];
        set({ currentCourse: course, isLoading: false });
      },
      enrollCourse: async (courseId) => {
        set((state) => ({
          enrolledCourses: [...state.enrolledCourses, courseId],
        }));
      },
      updateProgress: (courseId, lessonId) => {
        set((state) => {
          const progress = state.courseProgress[courseId] || {
            courseId,
            studentId: '1',
            completedLessons: [],
            completedModules: [],
            progress: 0,
            lastAccessed: new Date(),
            totalTimeSpent: 0,
          };
          if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
          }
          return {
            courseProgress: {
              ...state.courseProgress,
              [courseId]: progress,
            },
          };
        });
      },
      setCurrentCourse: (course) => set({ currentCourse: course }),
    }),
    {
      name: 'course-storage',
    }
  )
);

// UI Store
interface UIState {
  sidebarOpen: boolean;
  notificationsOpen: boolean;
  searchOpen: boolean;
  theme: 'light' | 'dark';
  language: string;
  toggleSidebar: () => void;
  toggleNotifications: () => void;
  toggleSearch: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      notificationsOpen: false,
      searchOpen: false,
      theme: 'light',
      language: 'en',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleNotifications: () => set((state) => ({ notificationsOpen: !state.notificationsOpen })),
      toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'ui-storage',
    }
  )
);

// Notification Store
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      fetchNotifications: async () => {
        const mockNotifications = generateMockNotifications();
        set({ 
          notifications: mockNotifications,
          unreadCount: mockNotifications.filter(n => !n.isRead).length,
        });
      },
      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);

// Dashboard Store
interface DashboardState {
  stats: DashboardStats | null;
  leaderboard: LeaderboardEntry[];
  activities: Activity[];
  deadlines: Deadline[];
  badges: Badge[];
  isLoading: boolean;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  leaderboard: [],
  activities: [],
  deadlines: [],
  badges: [],
  isLoading: false,
  fetchDashboardData: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({
      stats: generateMockStats(),
      leaderboard: generateMockLeaderboard(),
      activities: generateMockActivities(),
      deadlines: generateMockDeadlines(),
      badges: generateMockBadges(),
      isLoading: false,
    });
  },
}));

// Quiz Store
interface QuizState {
  currentQuiz: any | null;
  quizAttempt: QuizAttempt | null;
  timeRemaining: number;
  isQuizActive: boolean;
  startQuiz: (quiz: any) => void;
  submitAnswer: (questionId: string, options: string[]) => void;
  submitQuiz: () => void;
  tickTimer: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  quizAttempt: null,
  timeRemaining: 0,
  isQuizActive: false,
  startQuiz: (quiz) => {
    set({
      currentQuiz: quiz,
      timeRemaining: quiz.timeLimit * 60,
      isQuizActive: true,
      quizAttempt: {
        id: Date.now().toString(),
        quizId: quiz.id,
        studentId: '1',
        score: 0,
        maxScore: quiz.questions.reduce((acc: number, q: any) => acc + q.points, 0),
        answers: [],
        startedAt: new Date(),
        completedAt: new Date(),
        timeSpent: 0,
      },
    });
  },
  submitAnswer: (questionId, options) => {
    set((state) => {
      if (!state.quizAttempt) return state;
      const existingAnswerIndex = state.quizAttempt.answers.findIndex(
        a => a.questionId === questionId
      );
      const newAnswers = [...state.quizAttempt.answers];
      const answer = {
        questionId,
        selectedOptions: options,
        isCorrect: false, // Would be validated server-side
      };
      if (existingAnswerIndex >= 0) {
        newAnswers[existingAnswerIndex] = answer;
      } else {
        newAnswers.push(answer);
      }
      return {
        quizAttempt: {
          ...state.quizAttempt,
          answers: newAnswers,
        },
      };
    });
  },
  submitQuiz: () => {
    set({ isQuizActive: false, currentQuiz: null });
  },
  tickTimer: () => {
    set((state) => {
      if (state.timeRemaining <= 0) {
        return { isQuizActive: false };
      }
      return { timeRemaining: state.timeRemaining - 1 };
    });
  },
}));

// Mock Data Generators
function generateMockCourses(): Course[] {
  return [
    {
      id: '1',
      title: 'Complete Web Design Bootcamp',
      description: 'Master modern web design with HTML, CSS, JavaScript, and responsive design principles.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
      instructor: {
        id: '1',
        name: 'Sarah Chen',
        avatar: 'https://i.pravatar.cc/150?u=10',
        bio: 'Senior UX Designer with 10+ years experience',
      },
      category: 'Design',
      tags: ['HTML', 'CSS', 'JavaScript', 'UI/UX'],
      modules: [],
      duration: 2400,
      level: 'beginner',
      price: 99,
      rating: 4.8,
      enrolledCount: 1250,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Python for Data Science',
      description: 'Learn Python programming and data analysis with pandas, numpy, and matplotlib.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop',
      instructor: {
        id: '2',
        name: 'Dr. Michael Ross',
        avatar: 'https://i.pravatar.cc/150?u=11',
        bio: 'Data Scientist and PhD in Computer Science',
      },
      category: 'Development',
      tags: ['Python', 'Data Science', 'Machine Learning'],
      modules: [],
      duration: 1800,
      level: 'intermediate',
      price: 129,
      rating: 4.9,
      enrolledCount: 980,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Digital Marketing Mastery',
      description: 'Master SEO, social media marketing, and digital advertising strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      instructor: {
        id: '3',
        name: 'Emma Wilson',
        avatar: 'https://i.pravatar.cc/150?u=12',
        bio: 'Marketing Director at Fortune 500 company',
      },
      category: 'Business',
      tags: ['Marketing', 'SEO', 'Social Media'],
      modules: [],
      duration: 1200,
      level: 'beginner',
      price: 79,
      rating: 4.6,
      enrolledCount: 750,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      title: 'React Native Mobile Development',
      description: 'Build cross-platform mobile apps with React Native and Expo.',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      instructor: {
        id: '4',
        name: 'James Park',
        avatar: 'https://i.pravatar.cc/150?u=13',
        bio: 'Mobile Developer and Open Source Contributor',
      },
      category: 'Development',
      tags: ['React Native', 'Mobile', 'iOS', 'Android'],
      modules: [],
      duration: 2000,
      level: 'advanced',
      price: 149,
      rating: 4.7,
      enrolledCount: 620,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn user interface and user experience design from scratch.',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      instructor: {
        id: '5',
        name: 'Lisa Anderson',
        avatar: 'https://i.pravatar.cc/150?u=14',
        bio: 'Product Designer at leading tech startup',
      },
      category: 'Design',
      tags: ['UI', 'UX', 'Figma', 'Prototyping'],
      modules: [],
      duration: 1500,
      level: 'beginner',
      price: 89,
      rating: 4.8,
      enrolledCount: 890,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      title: 'Business Analytics with Excel',
      description: 'Master Excel for business analysis, dashboards, and data visualization.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      instructor: {
        id: '6',
        name: 'Robert Taylor',
        avatar: 'https://i.pravatar.cc/150?u=15',
        bio: 'Business Analyst and Excel Expert',
      },
      category: 'Business',
      tags: ['Excel', 'Analytics', 'Data Visualization'],
      modules: [],
      duration: 900,
      level: 'beginner',
      price: 69,
      rating: 4.5,
      enrolledCount: 1100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

function generateMockNotifications(): Notification[] {
  return [
    {
      id: '1',
      userId: '1',
      type: 'course',
      title: 'New lesson available',
      message: 'A new lesson has been added to "Complete Web Design Bootcamp"',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      link: '/courses/1',
    },
    {
      id: '2',
      userId: '1',
      type: 'quiz',
      title: 'Quiz reminder',
      message: 'You have a quiz due tomorrow in "Python for Data Science"',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      link: '/courses/2/quiz',
    },
    {
      id: '3',
      userId: '1',
      type: 'achievement',
      title: 'New badge earned!',
      message: 'Congratulations! You earned the "Fast Learner" badge.',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
      id: '4',
      userId: '1',
      type: 'deadline',
      title: 'Assignment due soon',
      message: 'Your "Web Design Project" assignment is due in 2 days.',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      link: '/assignments/1',
    },
  ];
}

function generateMockStats(): DashboardStats {
  return {
    streak: 12,
    coursesInProgress: 3,
    completedCourses: 5,
    averageScore: 87,
    totalLearningTime: 1240,
    certificatesEarned: 3,
    nextLesson: {
      courseTitle: 'Complete Web Design Bootcamp',
      lessonTitle: 'CSS Grid Layout',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    },
  };
}

function generateMockLeaderboard(): LeaderboardEntry[] {
  return [
    {
      rank: 1,
      user: {
        id: '2',
        email: 'sarah@example.com',
        firstName: 'Sarah',
        lastName: 'Chen',
        avatar: 'https://i.pravatar.cc/150?u=20',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      points: 12500,
      coursesCompleted: 12,
      streak: 45,
    },
    {
      rank: 2,
      user: {
        id: '3',
        email: 'mike@example.com',
        firstName: 'Mike',
        lastName: 'Ross',
        avatar: 'https://i.pravatar.cc/150?u=21',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      points: 11200,
      coursesCompleted: 10,
      streak: 32,
    },
    {
      rank: 3,
      user: {
        id: '4',
        email: 'emma@example.com',
        firstName: 'Emma',
        lastName: 'Wilson',
        avatar: 'https://i.pravatar.cc/150?u=22',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      points: 10800,
      coursesCompleted: 9,
      streak: 28,
    },
    {
      rank: 4,
      user: {
        id: '5',
        email: 'alex@example.com',
        firstName: 'Alex',
        lastName: 'Johnson',
        avatar: 'https://i.pravatar.cc/150?u=1',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      points: 9500,
      coursesCompleted: 8,
      streak: 12,
    },
    {
      rank: 5,
      user: {
        id: '6',
        email: 'james@example.com',
        firstName: 'James',
        lastName: 'Park',
        avatar: 'https://i.pravatar.cc/150?u=23',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      points: 8900,
      coursesCompleted: 7,
      streak: 18,
    },
  ];
}

function generateMockActivities(): Activity[] {
  return [
    {
      id: '1',
      user: {
        id: '2',
        email: 'sarah@example.com',
        firstName: 'Sarah',
        lastName: 'Chen',
        avatar: 'https://i.pravatar.cc/150?u=20',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      type: 'completion',
      description: 'completed "Python Basics" course',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: '2',
      user: {
        id: '3',
        email: 'mike@example.com',
        firstName: 'Mike',
        lastName: 'Ross',
        avatar: 'https://i.pravatar.cc/150?u=21',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      type: 'comment',
      description: 'commented on "Web Design Bootcamp"',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: '3',
      user: {
        id: '4',
        email: 'emma@example.com',
        firstName: 'Emma',
        lastName: 'Wilson',
        avatar: 'https://i.pravatar.cc/150?u=22',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      type: 'enrollment',
      description: 'enrolled in "Data Science Fundamentals"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: '4',
      user: {
        id: '5',
        email: 'alex@example.com',
        firstName: 'Alex',
        lastName: 'Johnson',
        avatar: 'https://i.pravatar.cc/150?u=1',
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      type: 'quiz_pass',
      description: 'scored 95% on "JavaScript Quiz"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    },
  ];
}

function generateMockDeadlines(): Deadline[] {
  return [
    {
      id: '1',
      title: 'Web Design Assignment',
      courseId: '1',
      courseName: 'Complete Web Design Bootcamp',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      type: 'assignment',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Python Quiz',
      courseId: '2',
      courseName: 'Python for Data Science',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      type: 'quiz',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Group Project',
      courseId: '3',
      courseName: 'Digital Marketing Mastery',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      type: 'project',
      priority: 'high',
    },
  ];
}

function generateMockBadges(): Badge[] {
  return [
    {
      id: '1',
      name: 'Fast Learner',
      description: 'Complete 5 lessons in a single day',
      icon: 'Zap',
      criteria: 'Complete 5 lessons in 24 hours',
      points: 100,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
      id: '2',
      name: 'Quiz Master',
      description: 'Score 100% on 3 consecutive quizzes',
      icon: 'Target',
      criteria: 'Perfect score on 3 quizzes in a row',
      points: 200,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    },
    {
      id: '3',
      name: 'Consistent',
      description: 'Maintain a 7-day learning streak',
      icon: 'Flame',
      criteria: '7-day streak',
      points: 150,
      isUnlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      id: '4',
      name: 'Helpful',
      description: 'Answer 10 questions in the community',
      icon: 'Heart',
      criteria: '10 helpful answers',
      points: 100,
      isUnlocked: false,
    },
    {
      id: '5',
      name: 'Top Performer',
      description: 'Reach top 10 on the leaderboard',
      icon: 'Trophy',
      criteria: 'Top 10 ranking',
      points: 500,
      isUnlocked: false,
    },
  ];
}
