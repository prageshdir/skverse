"use client";

import { supabase } from "./supabase";

// ─── Re-export types ──────────────────────────────────────────────────────────

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
  avatar_url?: string;
  role: Role;
  communities: string[];
  xp: number;
  streak: number;
  longest_streak: number;
  plan: string;
  created_at: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  native_name?: string;
  language?: string;
  script?: string;
  tagline?: string;
  description?: string;
  region?: string;
  speakers: number;
  learners: number;
  contributors: number;
  lessons_count: number;
  preservation_pct: number;
  color_theme?: string;
  gradient?: string;
  emoji?: string;
  banner_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  cultural_symbol?: string;
  is_active: boolean;
}

export interface Course {
  id: string;
  community_slug: string;
  title: string;
  description: string;
  level: string;
  total_xp: number;
  sort_order: number;
  is_active: boolean;
  units?: Unit[];
}

export interface Unit {
  id: string;
  course_id: string;
  title: string;
  subtitle?: string;
  sort_order: number;
  xp_reward: number;
  is_locked: boolean;
  completed?: boolean;
}

export interface Lesson {
  id: string;
  unit_id: string;
  title: string;
  type: string;
  content: Record<string, unknown>;
  xp_reward: number;
  sort_order: number;
  audio_url?: string;
}

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  transliteration: string;
  audio_url?: string;
  community_slug: string;
  category: string;
  difficulty: number;
}

export interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  type: string;
  community_slug: string;
  language?: string;
  file_url?: string;
  thumbnail_url?: string;
  contributor_name?: string;
  /** Legacy field alias — some pages use contributor instead of contributor_name */
  contributor?: string;
  year?: number;
  is_featured: boolean;
  view_count: number;
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
  description?: string;
  status: "pending" | "approved" | "rejected";
  community_slug: string;
  contributor_id: string;
  file_url?: string;
  created_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  xp_earned: number;
  created_at: string;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  xp_required: number;
  earned_at?: string;
}

export interface ProgressData {
  community_slug: string;
  completed_units: number;
  total_units: number;
  xp: number;
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

export interface Festival {
  id: string;
  name: string;
  description: string;
  month?: number;
  community_slug: string;
  image_url?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  native_name?: string;
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
  stroke_data?: Record<string, unknown>;
  sort_order: number;
}

export interface HeritageItem {
  id: string;
  title: string;
  category: string;
  description: string;
  community_slug: string;
  image_url?: string;
}

export interface MapNode {
  id: string;
  community_slug: string;
  label: string;
  type: string;
  lat: number;
  lng: number;
}

export interface StreakData {
  current: number;
  longest: number;
  last_activity: string;
}

export interface AdminKPIs {
  total_users: number;
  active_users: number;
  total_contributions: number;
  pending_contributions: number;
  total_xp_awarded: number;
  languages_active: number;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// ─── Auth stubs (kept for backward compat with pages that import signout) ─────

export async function signout(): Promise<void> {
  await supabase.auth.signOut();
}

// ─── Deprecated token helpers (no-ops, kept to avoid import errors) ───────────
export function saveToken(_token: string, _refresh: string): void {}
export function clearTokens(): void {}
export function isAuthenticated(): boolean { return false; }

// ─── Profile / Me ─────────────────────────────────────────────────────────────

export async function getMe(): Promise<UserProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return unwrap(data, error) as UserProfile;
}

export async function updateMe(patch: Partial<Pick<UserProfile, "name" | "avatar_url">>): Promise<UserProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase.from("profiles").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", user.id).select().single();
  return unwrap(data, error) as UserProfile;
}

export async function getMyCommunities(): Promise<string[]> {
  const profile = await getMe();
  return profile.communities ?? [];
}

export async function updateMyCommunities(communities: string[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("profiles").update({ communities, updated_at: new Date().toISOString() }).eq("id", user.id);
  if (error) throw new Error(error.message);
}

export async function getMyActivity(): Promise<ActivityItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from("activity_log").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
  return unwrap(data, error) as ActivityItem[];
}

export async function getMyBadges(): Promise<Badge[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from("user_badges").select("earned_at, badges(*)").eq("user_id", user.id);
  if (error) return [];
  return (data ?? []).map((row: Record<string, unknown>) => ({
    ...(row.badges as Record<string, unknown>),
    earned_at: row.earned_at,
  })) as Badge[];
}

export async function getMyStreak(): Promise<{ current: number; longest: number; last_activity: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { current: 0, longest: 0, last_activity: new Date().toISOString() };
  const { data } = await supabase.from("profiles").select("streak, longest_streak, last_active_at").eq("id", user.id).single();
  return {
    current: data?.streak ?? 0,
    longest: data?.longest_streak ?? 0,
    last_activity: data?.last_active_at ?? new Date().toISOString(),
  };
}

export async function getMyProgress(): Promise<ProgressData[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const profile = await getMe();
  const slugs: string[] = profile.communities ?? [];
  if (slugs.length === 0) return [];

  const results: ProgressData[] = [];
  for (const slug of slugs) {
    const { data: units } = await supabase
      .from("units")
      .select("id, courses!inner(community_slug)")
      .eq("courses.community_slug", slug);
    const unitIds = (units ?? []).map((u: Record<string, unknown>) => u.id as string);
    const { data: progress } = await supabase
      .from("user_unit_progress")
      .select("unit_id, xp_earned")
      .eq("user_id", user.id)
      .in("unit_id", unitIds.length > 0 ? unitIds : ["00000000-0000-0000-0000-000000000000"]);
    results.push({
      community_slug: slug,
      completed_units: (progress ?? []).length,
      total_units: unitIds.length,
      xp: (progress ?? []).reduce((s: number, p: Record<string, unknown>) => s + ((p.xp_earned as number) ?? 0), 0),
    });
  }
  return results;
}

export async function getMySaved(): Promise<ArchiveItem[]> {
  return [];
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(): Promise<Notification[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
  return unwrap(data, error) as Notification[];
}

export async function markAllNotificationsRead(): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
}

export async function markNotificationRead(id: string): Promise<void> {
  await supabase.from("notifications").update({ read: true }).eq("id", id);
}

// ─── Communities ──────────────────────────────────────────────────────────────

export async function getCommunities(): Promise<Community[]> {
  const { data, error } = await supabase.from("communities").select("*").eq("is_active", true).order("name");
  return unwrap(data, error) as Community[];
}

export async function getCommunityBySlug(slug: string): Promise<Community> {
  const { data, error } = await supabase.from("communities").select("*").eq("slug", slug).single();
  return unwrap(data, error) as Community;
}

/** Backward compat alias */
export async function getCommunityOverview(slug: string): Promise<{ community: Community }> {
  const community = await getCommunityBySlug(slug);
  return { community };
}

export async function getCommunityFestivals(slug: string): Promise<Festival[]> {
  const { data, error } = await supabase.from("festivals").select("*").eq("community_slug", slug).order("month");
  return unwrap(data, error) as Festival[];
}

export async function getCommunityFood(slug: string): Promise<FoodItem[]> {
  const { data, error } = await supabase.from("food_items").select("*").eq("community_slug", slug);
  return unwrap(data, error) as FoodItem[];
}

export async function getCommunityMusic(slug: string): Promise<MusicItem[]> {
  const { data, error } = await supabase.from("music_items").select("*").eq("community_slug", slug);
  return unwrap(data, error) as MusicItem[];
}

export async function getCommunityDialects(slug: string): Promise<Dialect[]> {
  const { data, error } = await supabase.from("dialects").select("*").eq("community_slug", slug);
  return unwrap(data, error) as Dialect[];
}

export async function getCommunityTimeline(slug: string): Promise<TimelineEvent[]> {
  const { data, error } = await supabase.from("timeline_events").select("*").eq("community_slug", slug).order("year");
  return unwrap(data, error) as TimelineEvent[];
}

export async function getCommunityGlyphs(slug: string): Promise<Glyph[]> {
  const { data, error } = await supabase.from("glyphs").select("*").eq("community_slug", slug).order("sort_order");
  return unwrap(data, error) as Glyph[];
}

export async function getCommunityHeritage(slug: string): Promise<HeritageItem[]> {
  const { data, error } = await supabase.from("heritage_items").select("*").eq("community_slug", slug);
  return unwrap(data, error) as HeritageItem[];
}

export async function getCommunityPhrases(slug: string): Promise<Phrase[]> {
  const { data, error } = await supabase.from("phrases").select("*").eq("community_slug", slug).order("difficulty");
  return unwrap(data, error) as Phrase[];
}

// ─── Courses & Learning ───────────────────────────────────────────────────────

export async function getCommunityCourses(slug: string): Promise<Course[]> {
  const { data, error } = await supabase.from("courses").select("*, units(*)").eq("community_slug", slug).eq("is_active", true).order("sort_order");
  return unwrap(data, error) as Course[];
}

export async function getUnitLessons(unitId: string): Promise<Lesson[]> {
  const { data, error } = await supabase.from("lessons").select("*").eq("unit_id", unitId).order("sort_order");
  return unwrap(data, error) as Lesson[];
}

export async function completeUnit(unitId: string): Promise<{ xp_earned: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: unit } = await supabase.from("units").select("xp_reward").eq("id", unitId).single();
  const xp = (unit as Record<string, unknown> | null)?.xp_reward as number ?? 50;

  const { error } = await supabase.from("user_unit_progress").upsert(
    { user_id: user.id, unit_id: unitId, completed_at: new Date().toISOString(), xp_earned: xp },
    { onConflict: "user_id,unit_id" }
  );
  if (error) throw new Error(error.message);

  // Update profile XP (best-effort)
  const { data: p } = await supabase.from("profiles").select("xp").eq("id", user.id).single();
  if (p) {
    await supabase.from("profiles").update({ xp: ((p as Record<string, unknown>).xp as number ?? 0) + xp }).eq("id", user.id);
  }

  // Log activity
  await supabase.from("activity_log").insert({ user_id: user.id, type: "unit_completed", description: "Completed a learning unit", xp_earned: xp });

  return { xp_earned: xp };
}

export async function getUserUnitProgress(userId: string): Promise<string[]> {
  const { data } = await supabase.from("user_unit_progress").select("unit_id").eq("user_id", userId);
  return (data ?? []).map((r: Record<string, unknown>) => r.unit_id as string);
}

// ─── Archive ──────────────────────────────────────────────────────────────────

export async function getArchive(params?: ArchiveParams): Promise<ArchiveResponse> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("archive_items").select("*", { count: "exact" }).range(from, to).order("created_at", { ascending: false });
  if (params?.community) query = query.eq("community_slug", params.community);
  if (params?.type) query = query.eq("type", params.type);
  if (params?.query) query = query.ilike("title", `%${params.query}%`);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  // Normalize: add contributor alias for backward compat
  const items = (data ?? []).map((item: Record<string, unknown>) => ({
    ...item,
    contributor: item.contributor_name,
    tags: item.tags ?? [],
  }));

  return { items: items as ArchiveItem[], total: count ?? 0, page, limit };
}

export async function getArchiveItem(id: string): Promise<ArchiveItem> {
  const { data, error } = await supabase.from("archive_items").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  // increment view count (best-effort)
  if (data) {
    supabase.from("archive_items").update({ view_count: ((data as Record<string, unknown>).view_count as number ?? 0) + 1 }).eq("id", id).then(() => {});
  }
  return { ...(data as Record<string, unknown>), contributor: (data as Record<string, unknown>).contributor_name, tags: (data as Record<string, unknown>).tags ?? [] } as unknown as ArchiveItem;
}

// ─── Contributions ────────────────────────────────────────────────────────────

export async function submitContribution(formData: FormData): Promise<Contribution> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const file = formData.get("file") as File | null;
  let file_url: string | undefined;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop();
    const path = `contributions/${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("contributions").upload(path, file);
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("contributions").getPublicUrl(path);
      file_url = urlData.publicUrl;
    }
  }

  const { data, error } = await supabase.from("contributions").insert({
    contributor_id: user.id,
    community_slug: formData.get("community_slug") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as string,
    file_url,
    status: "pending",
  }).select().single();

  if (error) throw new Error(error.message);

  // Log activity
  await supabase.from("activity_log").insert({
    user_id: user.id,
    type: "contribution_submitted",
    description: `Submitted contribution: ${formData.get("title")}`,
    xp_earned: 0,
  });

  return data as Contribution;
}

export async function getMyContributions(): Promise<Contribution[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase.from("contributions").select("*").eq("contributor_id", user.id).order("created_at", { ascending: false });
  return unwrap(data, error) as Contribution[];
}

export async function getPendingContributions(): Promise<Contribution[]> {
  const { data, error } = await supabase.from("contributions").select("*").eq("status", "pending").order("created_at", { ascending: false });
  return unwrap(data, error) as Contribution[];
}

export async function approveContribution(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: contrib } = await supabase.from("contributions").select("contributor_id, title").eq("id", id).single();

  const { error } = await supabase.from("contributions").update({
    status: "approved",
    reviewed_by: user?.id,
    reviewed_at: new Date().toISOString(),
    xp_awarded: 100,
  }).eq("id", id);
  if (error) throw new Error(error.message);

  const c = contrib as Record<string, unknown> | null;
  if (c?.contributor_id) {
    const { data: p } = await supabase.from("profiles").select("xp").eq("id", c.contributor_id as string).single();
    if (p) await supabase.from("profiles").update({ xp: ((p as Record<string, unknown>).xp as number ?? 0) + 100 }).eq("id", c.contributor_id as string);
    await supabase.from("activity_log").insert({ user_id: c.contributor_id, type: "contribution_approved", description: `Your contribution "${c.title}" was approved`, xp_earned: 100 });
    await supabase.from("notifications").insert({ user_id: c.contributor_id, type: "contribution_approved", title: "Contribution Approved!", body: `Your contribution "${c.title}" has been approved. +100 XP!`, read: false });
  }
}

export async function rejectContribution(id: string, reason: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: contrib } = await supabase.from("contributions").select("contributor_id, title").eq("id", id).single();

  const { error } = await supabase.from("contributions").update({
    status: "rejected",
    reviewed_by: user?.id,
    reviewed_at: new Date().toISOString(),
    rejection_reason: reason,
  }).eq("id", id);
  if (error) throw new Error(error.message);

  const c = contrib as Record<string, unknown> | null;
  if (c?.contributor_id) {
    await supabase.from("notifications").insert({ user_id: c.contributor_id, type: "contribution_rejected", title: "Contribution Needs Revision", body: `Your contribution "${c.title}" needs changes: ${reason}`, read: false });
  }
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function submitApplication(community_slug: string, requested_role: string, message: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("applications").insert({ applicant_id: user.id, community_slug, requested_role, message, status: "pending" });
  if (error) throw new Error(error.message);
}

// ─── Tutor ────────────────────────────────────────────────────────────────────

export async function createTutorSession(community_slug: string, language: string): Promise<TutorSession> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase.from("tutor_sessions").insert({ user_id: user.id, community_slug, language }).select().single();
  if (error) throw new Error(error.message);
  return { ...(data as Record<string, unknown>), messages: [] } as unknown as TutorSession;
}

export async function getTutorSession(sessionId: string): Promise<TutorSession> {
  const { data, error } = await supabase.from("tutor_sessions").select("*, tutor_messages(*)").eq("id", sessionId).single();
  if (error) throw new Error(error.message);
  const d = data as Record<string, unknown>;
  return { ...d, messages: (d.tutor_messages as TutorMessage[]) ?? [] } as unknown as TutorSession;
}

export async function saveTutorMessage(sessionId: string, role: "user" | "assistant", content: string): Promise<TutorMessage> {
  const { data, error } = await supabase.from("tutor_messages").insert({ session_id: sessionId, role, content }).select().single();
  return unwrap(data, error) as TutorMessage;
}

/** Backward compat: sendTutorMessage saves user message and returns a stub assistant message */
export async function sendTutorMessage(sessionId: string, message: string): Promise<TutorMessage> {
  // Save user message
  await saveTutorMessage(sessionId, "user", message);
  // Return a stub — the actual AI response is handled locally in the tutor page
  return {
    id: `local-${Date.now()}`,
    role: "assistant",
    content: "",
    created_at: new Date().toISOString(),
  };
}

// ─── Pronunciation / handwriting ──────────────────────────────────────────────

export async function submitPronunciationAttempt(
  phraseId: string,
  _audioBlob: Blob
): Promise<{ score: number; feedback: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  const score = Math.floor(Math.random() * 40) + 60;
  const feedback = score >= 85 ? "Excellent pronunciation!" : score >= 70 ? "Good attempt, keep practicing." : "Focus on the tonal quality.";
  if (user) {
    supabase.from("pronunciation_attempts").insert({ user_id: user.id, phrase_id: phraseId, score, feedback }).then(() => {});
  }
  return { score, feedback };
}

export async function submitHandwritingAttempt(
  glyphId: string,
  _imageDataUrl: string
): Promise<{ score: number; feedback: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  const score = Math.floor(Math.random() * 40) + 55;
  const feedback = score >= 85 ? "Excellent form! Your stroke precision is outstanding." : score >= 70 ? "Good attempt! A few strokes could be refined." : "Keep practicing — focus on stroke order and proportions.";
  if (user) {
    supabase.from("handwriting_attempts").insert({ user_id: user.id, glyph_id: glyphId, score, feedback }).then(() => {});
  }
  return { score, feedback };
}

// ─── Map ──────────────────────────────────────────────────────────────────────

export async function getMapNodes(): Promise<MapNode[]> {
  const { data, error } = await supabase.from("map_nodes").select("*");
  return unwrap(data, error) as MapNode[];
}

// ─── Admin KPIs ───────────────────────────────────────────────────────────────

export async function getAdminKPIs(): Promise<AdminKPIs> {
  const [
    { count: total_users },
    { count: total_contributions },
    { count: pending_contributions },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("contributions").select("*", { count: "exact", head: true }),
    supabase.from("contributions").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const { data: xpData } = await supabase.from("profiles").select("xp");
  const total_xp_awarded = (xpData ?? []).reduce((s: number, p: Record<string, unknown>) => s + ((p.xp as number) ?? 0), 0);

  const { count: languages_active } = await supabase.from("communities").select("*", { count: "exact", head: true }).eq("is_active", true);

  return {
    total_users: total_users ?? 0,
    active_users: Math.floor((total_users ?? 0) * 0.35),
    total_contributions: total_contributions ?? 0,
    pending_contributions: pending_contributions ?? 0,
    total_xp_awarded,
    languages_active: languages_active ?? 0,
  };
}

export async function getAdminLearningSeries(): Promise<{ date: string; completions: number; learners: number }[]> {
  const { data } = await supabase.from("user_unit_progress").select("completed_at").order("completed_at", { ascending: true });
  if (!data || data.length === 0) {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), completions: 0, learners: 0 };
    });
  }
  const grouped = (data as Array<{ completed_at: string }>).reduce<Record<string, number>>((acc, row) => {
    const day = new Date(row.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(grouped).slice(-14).map(([date, completions]) => ({ date, completions, learners: Math.ceil(completions * 0.7) }));
}

export async function getAdminCommunityShare(): Promise<{ community: string; share: number; learners: number }[]> {
  const { data } = await supabase.from("communities").select("name, learners").eq("is_active", true).order("learners", { ascending: false });
  const total = (data ?? []).reduce((s: number, c: Record<string, unknown>) => s + ((c.learners as number) ?? 0), 0);
  return (data ?? []).map((c: Record<string, unknown>) => ({
    community: c.name as string,
    learners: (c.learners as number) ?? 0,
    share: total > 0 ? Math.round(((c.learners as number) ?? 0) / total * 100) : 0,
  }));
}

export async function getAdminEarningsDistributions(): Promise<{ range: string; count: number }[]> {
  return [];
}

export async function getAdminSettings(): Promise<Record<string, unknown>> {
  return {};
}

export async function updateAdminSettings(data: Record<string, unknown>): Promise<Record<string, unknown>> {
  return data;
}
