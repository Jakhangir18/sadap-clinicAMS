export type Doctor = {
  id: string;
  full_name: string;
  slug: string;
  specialization_title: string;
  short_description?: string | null;
  rating: number;
  experience_years: number;
  education_text?: string | null;
  working_hours_text?: string | null;
  directions: string[];
  disease_tags: string[];
  avatar_url?: string | null;
  certificates: string[];
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};
