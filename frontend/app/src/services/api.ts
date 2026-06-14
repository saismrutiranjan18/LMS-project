import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const api = axios.create({ baseURL: API_BASE_URL });

// Attach JWT from Zustand's persisted storage on every request
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      const token = JSON.parse(raw)?.state?.token as string | undefined;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

// ─── Types matching backend DTOs ─────────────────────────────────────────────

export interface LessonCurriculumDto {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ';
  durationMinutes: number | null;
  orderIndex: number;
  freePreview: boolean;
  accessible: boolean;   // false → show lock, null videoUrl
  videoUrl: string | null; // YouTube/Vimeo embed URL, null when locked
}

export interface ModuleCurriculumDto {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  lessons: LessonCurriculumDto[];
}

export interface CurriculumDto {
  courseTitle: string;
  enrolled: boolean;
  modules: ModuleCurriculumDto[];
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const curriculumApi = {
  get: (courseId: string) =>
    api.get<{ success: boolean; data: CurriculumDto }>(
      `/api/v1/courses/${courseId}/curriculum`
    ),
};

export const enrollmentApi = {
  enroll: (courseId: string) =>
    api.post<{ success: boolean; message: string }>(
      `/api/v1/enrollments/courses/${courseId}`
    ),

  status: (courseId: string) =>
    api.get<{ success: boolean; data: { enrolled: boolean } }>(
      `/api/v1/enrollments/courses/${courseId}/status`
    ),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; data: AuthResponseDto }>('/api/auth/login', {
      email,
      password,
    }),

  register: (name: string, email: string, password: string) =>
    api.post<{ success: boolean; data: AuthResponseDto }>(
      '/api/auth/register/local',
      { name, email, password }
    ),
};

export default api;