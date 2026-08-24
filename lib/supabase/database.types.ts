export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type OpportunityType = "scholarship" | "event" | "mentor" | "resource" | "program";
type EducationStage = "middle_school" | "high_school" | "college" | "other";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; display_name: string | null; education_stage: EducationStage | null; city: string | null; state: string | null; bio: string | null; created_at: string; updated_at: string };
        Insert: { id: string; display_name?: string | null; education_stage?: EducationStage | null; city?: string | null; state?: string | null; bio?: string | null };
        Update: { display_name?: string | null; education_stage?: EducationStage | null; city?: string | null; state?: string | null; bio?: string | null };
        Relationships: [];
      };
      organizations: {
        Row: { id: string; slug: string; name: string; description: string; website_url: string | null; logo_url: string | null; featured: boolean; published: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; name: string; description: string; website_url?: string | null; logo_url?: string | null; featured?: boolean; published?: boolean };
        Update: Partial<Database["public"]["Tables"]["organizations"]["Insert"]>;
        Relationships: [];
      };
      career_paths: {
        Row: { id: string; slug: string; title: string; summary: string; icon: string | null; education: string | null; skills: string[]; published: boolean; sort_order: number; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; title: string; summary: string; icon?: string | null; education?: string | null; skills?: string[]; published?: boolean; sort_order?: number };
        Update: Partial<Database["public"]["Tables"]["career_paths"]["Insert"]>;
        Relationships: [];
      };
      opportunities: {
        Row: { id: string; organization_id: string | null; career_path_id: string | null; slug: string; type: OpportunityType; title: string; summary: string; amount_cents: number | null; deadline: string | null; location: string | null; eligibility: string[]; application_url: string | null; featured: boolean; published: boolean; metadata: Json; created_at: string; updated_at: string };
        Insert: { id?: string; organization_id?: string | null; career_path_id?: string | null; slug: string; type: OpportunityType; title: string; summary: string; amount_cents?: number | null; deadline?: string | null; location?: string | null; eligibility?: string[]; application_url?: string | null; featured?: boolean; published?: boolean; metadata?: Json };
        Update: Partial<Database["public"]["Tables"]["opportunities"]["Insert"]>;
        Relationships: [];
      };
      profile_interests: {
        Row: { user_id: string; interest: string; created_at: string };
        Insert: { user_id: string; interest: string };
        Update: { interest?: string };
        Relationships: [];
      };
      favorites: {
        Row: { user_id: string; opportunity_id: string; created_at: string };
        Insert: { user_id: string; opportunity_id: string };
        Update: never;
        Relationships: [];
      };
      quiz_responses: {
        Row: { id: string; user_id: string; interest: string; education_stage: EducationStage; answers: Json; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; interest: string; education_stage: EducationStage; answers?: Json };
        Update: { interest?: string; education_stage?: EducationStage; answers?: Json };
        Relationships: [];
      };
      opportunity_submissions: {
        Row: { id: string; submission_type: string; name: string; official_url: string; description: string; eligible_ages: string | null; location: string | null; deadline_or_availability: string | null; cost_or_award: string | null; submitter_name: string; submitter_email: string; submitter_connection: string; status: string; review_notes: string | null; created_at: string; reviewed_at: string | null; reviewed_by: string | null };
        Insert: { id?: string; submission_type: string; name: string; official_url: string; description: string; eligible_ages?: string | null; location?: string | null; deadline_or_availability?: string | null; cost_or_award?: string | null; submitter_name: string; submitter_email: string; submitter_connection: string; status?: string; review_notes?: string | null; reviewed_at?: string | null };
        Update: { status?: string; review_notes?: string | null; reviewed_at?: string | null; reviewed_by?: string | null };
        Relationships: [];
      };
      mentor_applications: {
        Row: { id: string; first_name: string; last_name: string; email: string; age_range: string; city_state: string; meeting_format: string; interest_areas: string[]; current_role_organization: string; experience_qualifications: string; preferred_mentee_age: string; availability: string; screening_consent: boolean; conduct_consent: boolean; status: string; review_notes: string | null; created_at: string; reviewed_at: string | null; reviewed_by: string | null };
        Insert: { id?: string; first_name: string; last_name: string; email: string; age_range: string; city_state: string; meeting_format: string; interest_areas?: string[]; current_role_organization: string; experience_qualifications: string; preferred_mentee_age: string; availability: string; screening_consent: boolean; conduct_consent: boolean; status?: string; review_notes?: string | null; reviewed_at?: string | null };
        Update: { status?: string; review_notes?: string | null; reviewed_at?: string | null; reviewed_by?: string | null };
        Relationships: [];
      };
      mentee_applications: {
        Row: { id: string; first_name: string; last_name: string; email: string; age_range: string; city_state: string; meeting_format: string; interest_areas: string[]; guidance_requested: string; current_stage: string; availability: string; guardian_email: string | null; guardian_consent_confirmed: boolean; guardian_consent_verified_at: string | null; guardian_consent_verified_by: string | null; guardian_consent_verification_method: string | null; conduct_consent: boolean; status: string; review_notes: string | null; created_at: string; reviewed_at: string | null; reviewed_by: string | null; retention_delete_after: string | null };
        Insert: { id?: string; first_name: string; last_name: string; email: string; age_range: string; city_state: string; meeting_format: string; interest_areas?: string[]; guidance_requested: string; current_stage: string; availability: string; guardian_email?: string | null; guardian_consent_confirmed?: boolean; conduct_consent: boolean; status?: string; review_notes?: string | null; reviewed_at?: string | null };
        Update: { status?: string; review_notes?: string | null; reviewed_at?: string | null; reviewed_by?: string | null; guardian_email?: string | null; guardian_consent_confirmed?: boolean; guardian_consent_verified_at?: string | null; guardian_consent_verified_by?: string | null; guardian_consent_verification_method?: string | null; retention_delete_after?: string | null };
        Relationships: [];
      };
      mentorship_matches: {
        Row: { id: string; mentor_application_id: string; mentee_application_id: string; status: string; goals: string | null; coordinator_notes: string | null; started_at: string | null; ended_at: string | null; created_at: string };
        Insert: { id?: string; mentor_application_id: string; mentee_application_id: string; status?: string; goals?: string | null; coordinator_notes?: string | null; started_at?: string | null; ended_at?: string | null };
        Update: never;
        Relationships: [];
      };
      saved_items: {
        Row: { user_id: string; item_id: string; item_label: string; created_at: string };
        Insert: { user_id: string; item_id: string; item_label: string };
        Update: { item_label?: string };
        Relationships: [];
      };
      explore_profiles: {
        Row: { user_id: string; display_name: string | null; age_range: string; state: string; interests: string[]; current_stage: string; updated_at: string };
        Insert: { user_id: string; display_name?: string | null; age_range: string; state: string; interests: string[]; current_stage: string; updated_at?: string };
        Update: { display_name?: string | null; age_range?: string; state?: string; interests?: string[]; current_stage?: string; updated_at?: string };
        Relationships: [];
      };
      location_directory: {
        Row: { id: string; organization_slug: string; organization_name: string; location_name: string; location_type: string; city: string | null; state: string; postal_code: string | null; latitude: number | null; longitude: number | null; official_url: string; source_url: string; description: string; published: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; organization_slug: string; organization_name: string; location_name: string; location_type: string; city?: string | null; state: string; postal_code?: string | null; latitude?: number | null; longitude?: number | null; official_url: string; source_url: string; description: string; published?: boolean };
        Update: Partial<Database["public"]["Tables"]["location_directory"]["Insert"]>;
        Relationships: [];
      };
      contact_inquiries: {
        Row: { id: string; name: string; email: string; organization: string | null; topic: string; message: string; status: string; created_at: string; review_notes: string | null; reviewed_at: string | null; reviewed_by: string | null };
        Insert: { id?: string; name: string; email: string; organization?: string | null; topic: string; message: string; status?: string };
        Update: { status?: string; review_notes?: string | null; reviewed_at?: string | null; reviewed_by?: string | null };
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; email: string; created_at: string };
        Insert: { user_id: string; email: string; created_at?: string };
        Update: { email?: string };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: { id: string; email: string; first_name: string | null; source: string; status: string; created_at: string; updated_at: string };
        Insert: { id?: string; email: string; first_name?: string | null; source?: string; status?: string; created_at?: string; updated_at?: string };
        Update: { first_name?: string | null; source?: string; status?: string; updated_at?: string };
        Relationships: [];
      };
      parental_consents: {
        Row: { id: string; parent_user_id: string; parent_email: string; parent_name: string; relationship_to_child: string; status: string; privacy_notice_version: string; consent_token_hash: string; revocation_token_hash: string; initial_notice_sent_at: string; parent_affirmed_at: string | null; second_notice_due_at: string | null; second_notice_sent_at: string | null; revoked_at: string | null; expires_at: string; created_at: string; updated_at: string };
        Insert: { id?: string; parent_user_id: string; parent_email: string; parent_name: string; relationship_to_child: string; status?: string; privacy_notice_version: string; consent_token_hash: string; revocation_token_hash: string; initial_notice_sent_at?: string; parent_affirmed_at?: string | null; second_notice_due_at?: string | null; second_notice_sent_at?: string | null; revoked_at?: string | null; expires_at?: string; created_at?: string; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["parental_consents"]["Insert"]>;
        Relationships: [];
      };
      parent_managed_explore_profiles: {
        Row: { id: string; parent_user_id: string; parental_consent_id: string; child_nickname: string | null; age_range: string; state: string; interests: string[]; current_stage: string; created_at: string; updated_at: string };
        Insert: { id?: string; parent_user_id: string; parental_consent_id: string; child_nickname?: string | null; age_range: string; state: string; interests: string[]; current_stage: string; created_at?: string; updated_at?: string };
        Update: { child_nickname?: string | null; age_range?: string; state?: string; interests?: string[]; current_stage?: string; updated_at?: string };
        Relationships: [];
      };
      data_deletion_requests: {
        Row: { id: string; user_id: string | null; requester_name: string; requester_email: string; request_scope: string; details: string | null; status: string; review_notes: string | null; reviewed_at: string | null; reviewed_by: string | null; created_at: string };
        Insert: { id?: string; user_id?: string | null; requester_name: string; requester_email: string; request_scope: string; details?: string | null; status?: string; review_notes?: string | null; reviewed_at?: string | null; reviewed_by?: string | null; created_at?: string };
        Update: { status?: string; review_notes?: string | null; reviewed_at?: string | null; reviewed_by?: string | null };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { opportunity_type: OpportunityType; education_stage: EducationStage };
    CompositeTypes: Record<string, never>;
  };
};
