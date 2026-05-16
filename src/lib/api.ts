const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.sikkimverse.com/v1";

// ─── Token helpers ────────────────────────────────────────────────────────────

export function saveToken(token: string, refresh: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("sv_token", token);
  localStorage.setItem("sv_refresh", refresh);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("sv_token");
  localStorage.removeItem("sv_refresh");
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("sv_token"));
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sv_token");
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role =
  | "learner"
  | "contributor"
  | "community_manager"
  | "community_admin"
  | "superadmin";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  communities: string[];
  xp: number;
  streak: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: UserProfile;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  speakers: number;
  preservation: number;
  region: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  community_slug: string;
  units: CourseUnit[];
  progress?: number;
}

export interface CourseUnit {
  id: string;
  title: string;
  type: string;
  completed: boolean;
  xp_reward: number;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  transliteration: string;
  audio_url?: string;
  community_slug: string;
  category: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  type: string;
  community_slug: string;
  file_url?: string;
  thumbnail_url?: string;
  contributor?: string;
  created_at: string;
  tags: string[];
}

export interface ArchiveParams {
  community?: string;
  type?: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface ArchiveResponse {
  items: ArchiveItem[];
  total: number;
  page: number;
  limit: number;
}

export interface Contribution {
  id: string;
  type: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  community_slug: string;
  contributor_id: string;
  created_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

export interface TutorSession {
  id: string;
  community_slug: string;
  language: string;
  messages: TutorMessage[];
  created_at: string;
}

export interface TutorMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface MapNode {
  id: string;
  community_slug: string;
  name: string;
  lat: number;
  lng: number;
  speakers: number;
  preservation: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

export interface StreakData {
  current: number;
  longest: number;
  last_activity: string;
}

export interface ProgressData {
  community_slug: string;
  completed_units: number;
  total_units: number;
  xp: number;
  level: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  xp_earned: number;
  created_at: string;
}

export interface AdminKPIs {
  total_users: number;
  active_users: number;
  total_contributions: number;
  pending_contributions: number;
  total_xp_awarded: number;
  languages_active: number;
}

export interface AdminSettings {
  site_name: string;
  maintenance_mode: boolean;
  allow_registrations: boolean;
  default_role: Role;
  max_upload_mb: number;
}

export interface Festival {
  id: string;
  name: string;
  description: string;
  date?: string;
  community_slug: string;
  image_url?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  community_slug: string;
  image_url?: string;
}

export interface MusicItem {
  id: string;
  title: string;
  description: string;
  community_slug: string;
  audio_url?: string;
  instrument?: string;
}

export interface Dialect {
  id: string;
  name: string;
  region: string;
  description: string;
  community_slug: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  community_slug: string;
}

export interface Glyph {
  id: string;
  character: string;
  romanization: string;
  description: string;
  community_slug: string;
  stroke_data?: string;
}

export interface HeritageItem {
  id: string;
  title: string;
  category: string;
  description: string;
  community_slug: string;
  image_url?: string;
}

export interface CommunityOverview {
  community: Community;
  key_facts: Record<string, string | number>;
  recent_activity: ActivityItem[];
}

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as { message?: string }).message ?? `HTTP ${res.status}`;
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

async function apiFetchFormData<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as { message?: string }).message ?? `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signin(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function signout(): Promise<void> {
  await apiFetch<void>("/auth/signout", { method: "POST" });
  clearTokens();
}

export async function refreshToken(refresh_token: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

// ─── Me ───────────────────────────────────────────────────────────────────────

export async function getMe(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/me");
}

export async function updateMe(
  data: Partial<Pick<UserProfile, "name" | "avatar">>
): Promise<UserProfile> {
  return apiFetch<UserProfile>("/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function getMyCommunities(): Promise<string[]> {
  return apiFetch<string[]>("/me/communities");
}

export async function updateMyCommunities(communities: string[]): Promise<string[]> {
  return apiFetch<string[]>("/me/communities", {
    method: "PUT",
    body: JSON.stringify({ communities }),
  });
}

export async function getMyActivity(): Promise<ActivityItem[]> {
  return apiFetch<ActivityItem[]>("/me/activity");
}

export async function getMyBadges(): Promise<Badge[]> {
  return apiFetch<Badge[]>("/me/badges");
}

export async function getMyStreak(): Promise<StreakData> {
  return apiFetch<StreakData>("/me/streak");
}

export async function getMyProgress(): Promise<ProgressData[]> {
  return apiFetch<ProgressData[]>("/me/progress");
}

export async function getMySaved(): Promise<ArchiveItem[]> {
  return apiFetch<ArchiveItem[]>("/me/saved");
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(): Promise<Notification[]> {
  return apiFetch<Notification[]>("/notifications");
}

export async function markAllNotificationsRead(): Promise<void> {
  return apiFetch<void>("/notifications/read-all", { method: "POST" });
}

// ─── Communities ─────────────────────────────────────────────────────────────

export async function getCommunities(): Promise<Community[]> {
  return apiFetch<Community[]>("/communities");
}

export async function getCommunityBySlug(slug: string): Promise<Community> {
  return apiFetch<Community>(`/communities/${slug}`);
}

export async function getCommunityFestivals(slug: string): Promise<Festival[]> {
  return apiFetch<Festival[]>(`/communities/${slug}/festivals`);
}

export async function getCommunityFood(slug: string): Promise<FoodItem[]> {
  return apiFetch<FoodItem[]>(`/communities/${slug}/food`);
}

export async function getCommunityMusic(slug: string): Promise<MusicItem[]> {
  return apiFetch<MusicItem[]>(`/communities/${slug}/music`);
}

export async function getCommunityDialects(slug: string): Promise<Dialect[]> {
  return apiFetch<Dialect[]>(`/communities/${slug}/dialects`);
}

export async function getCommunityTimeline(slug: string): Promise<TimelineEvent[]> {
  return apiFetch<TimelineEvent[]>(`/communities/${slug}/timeline`);
}

export async function getCommunityGlyphs(slug: string): Promise<Glyph[]> {
  return apiFetch<Glyph[]>(`/communities/${slug}/glyphs`);
}

export async function getCommunityHeritage(slug: string): Promise<HeritageItem[]> {
  return apiFetch<HeritageItem[]>(`/communities/${slug}/heritage`);
}

export async function getCommunityOverview(slug: string): Promise<CommunityOverview> {
  return apiFetch<CommunityOverview>(`/communities/${slug}/overview`);
}

// ─── Courses ─────────────────────────────────────────────────────────────────

export async function getCommunityCourses(slug: string): Promise<Course[]> {
  return apiFetch<Course[]>(`/communities/${slug}/courses`);
}

export async function completeUnit(unitId: string): Promise<{ xp_earned: number }> {
  return apiFetch<{ xp_earned: number }>(`/units/${unitId}/complete`, {
    method: "POST",
  });
}

// ─── Phrases ─────────────────────────────────────────────────────────────────

export async function getCommunityPhrases(slug: string): Promise<Phrase[]> {
  return apiFetch<Phrase[]>(`/communities/${slug}/phrases`);
}

export async function submitPronunciationAttempt(
  phraseId: string,
  audioBlob: Blob
): Promise<{ score: number; feedback: string }> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "pronunciation.webm");
  return apiFetchFormData<{ score: number; feedback: string }>(
    `/phrases/${phraseId}/pronunciation`,
    formData
  );
}

export async function submitHandwritingAttempt(
  glyphId: string,
  imageDataUrl: string
): Promise<{ score: number; feedback: string }> {
  return apiFetch<{ score: number; feedback: string }>(
    `/glyphs/${glyphId}/handwriting`,
    {
      method: "POST",
      body: JSON.stringify({ image: imageDataUrl }),
    }
  );
}

// ─── Archive ─────────────────────────────────────────────────────────────────

export async function getArchive(params?: ArchiveParams): Promise<ArchiveResponse> {
  const search = new URLSearchParams();
  if (params?.community) search.set("community", params.community);
  if (params?.type) search.set("type", params.type);
  if (params?.query) search.set("query", params.query);
  if (params?.page != null) search.set("page", String(params.page));
  if (params?.limit != null) search.set("limit", String(params.limit));
  const qs = search.toString();
  return apiFetch<ArchiveResponse>(`/archive${qs ? `?${qs}` : ""}`);
}

export async function getArchiveItem(id: string): Promise<ArchiveItem> {
  return apiFetch<ArchiveItem>(`/archive/${id}`);
}

// ─── Contributions ────────────────────────────────────────────────────────────

export async function submitContribution(
  formData: FormData
): Promise<Contribution> {
  return apiFetchFormData<Contribution>("/contributions", formData);
}

export async function getMyContributions(): Promise<Contribution[]> {
  return apiFetch<Contribution[]>("/contributions/mine");
}

export async function approveContribution(id: string): Promise<Contribution> {
  return apiFetch<Contribution>(`/contributions/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectContribution(
  id: string,
  reason: string
): Promise<Contribution> {
  return apiFetch<Contribution>(`/contributions/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function submitApplication(
  community_slug: string,
  role: Role,
  message: string
): Promise<{ id: string; status: string }> {
  return apiFetch<{ id: string; status: string }>("/applications", {
    method: "POST",
    body: JSON.stringify({ community_slug, role, message }),
  });
}

// ─── Tutor ────────────────────────────────────────────────────────────────────

export async function createTutorSession(
  community_slug: string,
  language: string
): Promise<TutorSession> {
  return apiFetch<TutorSession>("/tutor/sessions", {
    method: "POST",
    body: JSON.stringify({ community_slug, language }),
  });
}

export async function sendTutorMessage(
  sessionId: string,
  message: string
): Promise<TutorMessage> {
  return apiFetch<TutorMessage>(`/tutor/sessions/${sessionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function getTutorSession(sessionId: string): Promise<TutorSession> {
  return apiFetch<TutorSession>(`/tutor/sessions/${sessionId}`);
}

// ─── Map ──────────────────────────────────────────────────────────────────────

export async function getMapNodes(): Promise<MapNode[]> {
  return apiFetch<MapNode[]>("/map/nodes");
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminKPIs(): Promise<AdminKPIs> {
  return apiFetch<AdminKPIs>("/admin/kpis");
}

export async function getAdminLearningSeries(): Promise<
  { date: string; completions: number; learners: number }[]
> {
  return apiFetch("/admin/learning-series");
}

export async function getAdminCommunityShare(): Promise<
  { community: string; share: number; learners: number }[]
> {
  return apiFetch("/admin/community-share");
}

export async function getAdminEarningsDistributions(): Promise<
  { range: string; count: number }[]
> {
  return apiFetch("/admin/earnings-distributions");
}

export async function getAdminSettings(): Promise<AdminSettings> {
  return apiFetch<AdminSettings>("/admin/settings");
}

export async function updateAdminSettings(
  data: Partial<AdminSettings>
): Promise<AdminSettings> {
  return apiFetch<AdminSettings>("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
