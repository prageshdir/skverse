const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.sikkimverse.com/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sv_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  refresh_token: string;
  user: UserProfile;
}

export function signin(email: string, password: string) {
  return request<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signup(email: string, password: string, name: string, role: string = "learner") {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name, role }),
  });
}

export function signout() {
  return request<void>("/auth/signout", { method: "POST" });
}

export function refreshToken(refresh_token: string) {
  return request<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });
}

// ── Me ───────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "learner" | "contributor" | "community_manager" | "community_admin" | "superadmin";
  avatar_url?: string;
  communities: string[];
  xp: number;
  streak: number;
  badges: Badge[];
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  earned_at: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  xp?: number;
  created_at: string;
}

export interface Streak {
  current: number;
  longest: number;
  last_activity: string;
}

export function getMe() {
  return request<UserProfile>("/me");
}

export function updateMe(data: Partial<UserProfile>) {
  return request<UserProfile>("/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function getMyCommunities() {
  return request<string[]>("/me/communities");
}

export function updateMyCommunities(communities: string[]) {
  return request<void>("/me/communities", {
    method: "PUT",
    body: JSON.stringify({ communities }),
  });
}

export function getMyActivity() {
  return request<Activity[]>("/me/activity");
}

export function getMyBadges() {
  return request<Badge[]>("/me/badges");
}

export function getMyStreak() {
  return request<Streak>("/me/streak");
}

export function getMyProgress() {
  return request<Record<string, unknown>>("/me/progress");
}

export function getMySaved() {
  return request<unknown[]>("/me/saved");
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export function getNotifications() {
  return request<Notification[]>("/me/notifications");
}

export function markAllNotificationsRead() {
  return request<void>("/me/notifications/mark-all-read", { method: "POST" });
}

// ── Communities ───────────────────────────────────────────────────────────────

export interface CommunityAPI {
  slug: string;
  name: string;
  native_name: string;
  language: string;
  script: string;
  tagline: string;
  description: string;
  region: string;
  speakers: number;
  learners: number;
  contributors: number;
  preservation_level: number;
  color_theme: string;
  thumbnail_url?: string;
  banner_url?: string;
  emoji: string;
  tags: string[];
}

export function getCommunities() {
  return request<CommunityAPI[]>("/communities");
}

export function getCommunity(slug: string) {
  return request<CommunityAPI>(`/communities/${slug}`);
}

export function getCommunityFestivals(slug: string) {
  return request<unknown[]>(`/communities/${slug}/festivals`);
}

export function getCommunityFood(slug: string) {
  return request<unknown[]>(`/communities/${slug}/food`);
}

export function getCommunityMusic(slug: string) {
  return request<unknown[]>(`/communities/${slug}/music`);
}

export function getCommunityDialects(slug: string) {
  return request<unknown[]>(`/communities/${slug}/dialects`);
}

export function getCommunityTimeline(slug: string) {
  return request<unknown[]>(`/communities/${slug}/timeline`);
}

export function getCommunityGlyphs(slug: string) {
  return request<unknown[]>(`/communities/${slug}/glyphs`);
}

export function getCommunityHeritage(slug: string) {
  return request<unknown[]>(`/communities/${slug}/heritage`);
}

export function getCommunityOverview(slug: string) {
  return request<unknown>(`/communities/${slug}/overview`);
}

// ── Courses & Learning ────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  description: string;
  community_slug: string;
  level: string;
  units: Unit[];
  total_xp: number;
}

export interface Unit {
  id: string;
  title: string;
  subtitle: string;
  locked: boolean;
  completed: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: "lesson" | "audio" | "writing" | "ai";
  xp: number;
  done: boolean;
  active?: boolean;
}

export function getCommunityCourses(slug: string) {
  return request<Course[]>(`/communities/${slug}/courses`);
}

export function completeUnit(unitId: string) {
  return request<{ xp_earned: number }>(`/units/${unitId}/complete`, { method: "POST" });
}

// ── Phrases & Pronunciation ───────────────────────────────────────────────────

export interface Phrase {
  id: string;
  text: string;
  transliteration: string;
  translation: string;
  audio_url?: string;
  community_slug: string;
}

export function getCommunityPhrases(slug: string) {
  return request<Phrase[]>(`/communities/${slug}/phrases`);
}

export function submitPronunciationAttempt(phraseId: string, audioBlob: Blob) {
  const form = new FormData();
  form.append("phrase_id", phraseId);
  form.append("audio", audioBlob, "attempt.webm");
  const token = getToken();
  return fetch(`${BASE_URL}/pronunciation/attempts`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  }).then((r) => r.json());
}

export function submitHandwritingAttempt(glyphId: string, imageDataUrl: string) {
  return request<{ score: number; feedback: string }>("/handwriting/attempts", {
    method: "POST",
    body: JSON.stringify({ glyph_id: glyphId, image: imageDataUrl }),
  });
}

// ── Archive ───────────────────────────────────────────────────────────────────

export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  type: "story" | "song" | "oral_history" | "cultural_document" | "photograph" | "video";
  community_slug: string;
  language: string;
  media_url?: string;
  thumbnail_url?: string;
  tags: string[];
  year?: number;
  contributor?: string;
  created_at: string;
}

export function getArchive(params?: { community?: string; type?: string; q?: string }) {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  return request<ArchiveItem[]>(`/archive${qs}`);
}

export function getArchiveItem(id: string) {
  return request<ArchiveItem>(`/archive/${id}`);
}

// ── Contributions ─────────────────────────────────────────────────────────────

export interface Contribution {
  id: string;
  title: string;
  type: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  community_slug: string;
  contributor_id: string;
  created_at: string;
  xp_awarded?: number;
}

export function submitContribution(data: FormData) {
  const token = getToken();
  return fetch(`${BASE_URL}/contributions`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: data,
  }).then((r) => r.json() as Promise<Contribution>);
}

export function getMyContributions() {
  return request<Contribution[]>("/contributions");
}

export function approveContribution(id: string) {
  return request<Contribution>(`/contributions/${id}/approve`, { method: "POST" });
}

export function rejectContribution(id: string, reason: string) {
  return request<Contribution>(`/contributions/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

// ── Applications ──────────────────────────────────────────────────────────────

export interface Application {
  id: string;
  applicant_id: string;
  community_slug: string;
  role: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export function submitApplication(community_slug: string, role: string, message: string) {
  return request<Application>("/applications", {
    method: "POST",
    body: JSON.stringify({ community_slug, role, message }),
  });
}

// ── AI Tutor ──────────────────────────────────────────────────────────────────

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

export function createTutorSession(community_slug: string, language: string) {
  return request<TutorSession>("/tutor/sessions", {
    method: "POST",
    body: JSON.stringify({ community_slug, language }),
  });
}

export function sendTutorMessage(sessionId: string, message: string) {
  return request<TutorMessage>(`/tutor/sessions/${sessionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content: message }),
  });
}

export function getTutorSession(sessionId: string) {
  return request<TutorSession>(`/tutor/sessions/${sessionId}`);
}

// ── Map ───────────────────────────────────────────────────────────────────────

export interface MapNode {
  id: string;
  community_slug: string;
  lat: number;
  lng: number;
  label: string;
  type: string;
}

export function getMapNodes() {
  return request<MapNode[]>("/map-nodes");
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export interface KPIs {
  total_learners: number;
  active_today: number;
  total_contributions: number;
  pending_contributions: number;
  total_revenue: number;
  revenue_this_month: number;
  communities_count: number;
  ai_sessions_today: number;
}

export interface LearningSeries {
  date: string;
  learners: number;
  completions: number;
}

export interface CommunityShare {
  community: string;
  percentage: number;
  learners: number;
}

export function getAdminKPIs() {
  return request<KPIs>("/admin/kpis");
}

export function getAdminLearningSeries() {
  return request<LearningSeries[]>("/admin/learning-series");
}

export function getAdminCommunityShare() {
  return request<CommunityShare[]>("/admin/community-share");
}

export function getAdminEarningsDistributions() {
  return request<unknown[]>("/admin/earnings/distributions");
}

export function getAdminSettings() {
  return request<Record<string, unknown>>("/admin/settings");
}

export function updateAdminSettings(data: Record<string, unknown>) {
  return request<Record<string, unknown>>("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

export function saveToken(token: string, refresh_token: string) {
  localStorage.setItem("sv_token", token);
  localStorage.setItem("sv_refresh_token", refresh_token);
}

export function clearTokens() {
  localStorage.removeItem("sv_token");
  localStorage.removeItem("sv_refresh_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
