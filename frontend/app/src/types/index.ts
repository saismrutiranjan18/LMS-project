// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfile extends User {
  role: 'student';
  enrolledCourses: string[];
  completedCourses: string[];
  totalLearningTime: number;
  streak: number;
  points: number;
  badges: string[];
  certificates: string[];
}

export interface TeacherProfile extends User {
  role: 'teacher';
  createdCourses: string[];
  totalStudents: number;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: Instructor;
  category: string;
  tags: string[];
  modules: Module[];
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  rating: number;
  enrolledCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  content: VideoContent | DocumentContent | QuizContent | AssignmentContent;
  duration: number;
  order: number;
  resources: Resource[];
  isCompleted: boolean;
}

export interface VideoContent {
  videoUrl: string;
  thumbnail: string;
}

export interface DocumentContent {
  documentUrl: string;
  fileType: string;
}

export interface QuizContent {
  questions: Question[];
  timeLimit: number;
  maxAttempts: number;
  passingScore: number;
}

export interface AssignmentContent {
  instructions: string;
  dueDate: Date;
  maxPoints: number;
  attachments: Resource[];
}

export interface Question {
  id: string;
  type: 'single' | 'multiple';
  question: string;
  options: Option[];
  explanation: string;
  points: number;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Resource {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

// Progress Types
export interface CourseProgress {
  courseId: string;
  studentId: string;
  completedLessons: string[];
  completedModules: string[];
  progress: number;
  lastAccessed: Date;
  totalTimeSpent: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  maxScore: number;
  answers: Answer[];
  startedAt: Date;
  completedAt: Date;
  timeSpent: number;
}

export interface Answer {
  questionId: string;
  selectedOptions: string[];
  isCorrect: boolean;
}

// Achievement Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export interface Certificate {
  id: string;
  courseId: string;
  studentId: string;
  issueDate: Date;
  template: string;
  url: string;
}

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number;
  user: User;
  points: number;
  coursesCompleted: number;
  streak: number;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'course' | 'quiz' | 'achievement' | 'system' | 'deadline';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  link?: string;
}

// Activity Types
export interface Activity {
  id: string;
  user: User;
  type: 'enrollment' | 'completion' | 'comment' | 'quiz_pass' | 'achievement';
  description: string;
  course?: Course;
  timestamp: Date;
}

// Deadline Types
export interface Deadline {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: Date;
  type: 'assignment' | 'quiz' | 'project';
  priority: 'high' | 'medium' | 'low';
}

// Dashboard Stats
export interface DashboardStats {
  streak: number;
  coursesInProgress: number;
  completedCourses: number;
  averageScore: number;
  totalLearningTime: number;
  certificatesEarned: number;
  nextLesson?: {
    courseTitle: string;
    lessonTitle: string;
    thumbnail: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
