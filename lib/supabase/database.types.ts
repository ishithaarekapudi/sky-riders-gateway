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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { opportunity_type: OpportunityType; education_stage: EducationStage };
    CompositeTypes: Record<string, never>;
  };
};

