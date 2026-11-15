import type {
  PublicBootstrapData,
  UserAccount,
  SiteProfile,
  NewsItem,
  PublicationItem,
  CourseItem,
  ResearchProjectItem,
  OpportunityItem,
  MediaAsset,
  RedirectRule,
  ContactInquiry,
} from '../types/cms';

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && typeof body.error === 'string') {
        message = body.error;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export interface AdminWorkspaceData {
  profile: SiteProfile;
  news: NewsItem[];
  publications: PublicationItem[];
  courses: CourseItem[];
  projects: ResearchProjectItem[];
  opportunities: OpportunityItem[];
  media: MediaAsset[];
  redirects: RedirectRule[];
  inquiries: ContactInquiry[];
  users: UserAccount[];
}

export const api = {
  // Public
  getPublicBootstrap: () => requestJson<PublicBootstrapData>('/api/public/bootstrap'),
  submitContact: (payload: {
    name: string;
    email: string;
    subject: string;
    inquiry_type: string;
    message: string;
  }) => requestJson<{ id: number; created_at: string }>('/api/public/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Auth
  getMe: () => requestJson<{ user: UserAccount | null }>('/api/auth/me'),
  login: (email: string, password: string) =>
    requestJson<{ user: UserAccount }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () => requestJson<{ ok: boolean }>('/api/auth/logout', { method: 'POST' }),
  changePassword: (currentPassword: string, newPassword: string) =>
    requestJson<{ ok: boolean }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // Admin Workspace
  getWorkspace: () => requestJson<AdminWorkspaceData>('/api/admin/workspace'),

  // News
  createNews: (data: Partial<NewsItem>) =>
    requestJson<NewsItem>('/api/admin/news', { method: 'POST', body: JSON.stringify(data) }),
  updateNews: (id: number, data: Partial<NewsItem>) =>
    requestJson<NewsItem>(`/api/admin/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNews: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/news/${id}`, { method: 'DELETE' }),

  // Publications
  createPublication: (data: Partial<PublicationItem>) =>
    requestJson<PublicationItem>('/api/admin/publications', { method: 'POST', body: JSON.stringify(data) }),
  updatePublication: (id: number, data: Partial<PublicationItem>) =>
    requestJson<PublicationItem>(`/api/admin/publications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePublication: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/publications/${id}`, { method: 'DELETE' }),

  // Courses
  createCourse: (data: Partial<CourseItem>) =>
    requestJson<CourseItem>('/api/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
  updateCourse: (id: number, data: Partial<CourseItem>) =>
    requestJson<CourseItem>(`/api/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCourse: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/courses/${id}`, { method: 'DELETE' }),

  // Projects
  createProject: (data: Partial<ResearchProjectItem>) =>
    requestJson<ResearchProjectItem>('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: Partial<ResearchProjectItem>) =>
    requestJson<ResearchProjectItem>(`/api/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  // Opportunities
  createOpportunity: (data: Partial<OpportunityItem>) =>
    requestJson<OpportunityItem>('/api/admin/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  updateOpportunity: (id: number, data: Partial<OpportunityItem>) =>
    requestJson<OpportunityItem>(`/api/admin/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOpportunity: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/opportunities/${id}`, { method: 'DELETE' }),

  // Media
  uploadMedia: (payload: { filename: string; mimeType: string; dataBase64: string }) =>
    requestJson<MediaAsset>('/api/admin/media', { method: 'POST', body: JSON.stringify(payload) }),
  deleteMedia: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/media/${id}`, { method: 'DELETE' }),

  // Profile
  updateProfile: (profile: SiteProfile) =>
    requestJson<SiteProfile>('/api/admin/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // Inquiries
  updateInquiryStatus: (id: number, status: 'unread' | 'read' | 'archived') =>
    requestJson<{ ok: boolean }>(`/api/admin/inquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  deleteInquiry: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/inquiries/${id}`, { method: 'DELETE' }),

  // Users
  createUser: (payload: { email: string; name: string; role: 'admin' | 'editor'; password: string }) =>
    requestJson<UserAccount>('/api/admin/users', { method: 'POST', body: JSON.stringify(payload) }),
  deleteUser: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/users/${id}`, { method: 'DELETE' }),

  // Redirects
  createRedirect: (payload: { from_path: string; to_path: string; note: string }) =>
    requestJson<RedirectRule>('/api/admin/redirects', { method: 'POST', body: JSON.stringify(payload) }),
  deleteRedirect: (id: number) =>
    requestJson<{ ok: boolean }>(`/api/admin/redirects/${id}`, { method: 'DELETE' }),

  // Backup restore
  restoreBackup: (snapshot: unknown) =>
    requestJson<{ ok: boolean }>('/api/admin/backup/restore', {
      method: 'POST',
      body: JSON.stringify(snapshot),
    }),
};
