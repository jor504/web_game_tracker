export type GameStatus = {
  id: string;
  name: string;
  created_at: string;
};

export type GameFormat = {
  id: string;
  name: string;
  created_at: string;
};

export type Platform = {
  id: string;
  name: string;
  created_at: string;
};

export type Game = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  completed_date: string | null;
  status_id: string;
  format_id: string;
  platform_id: string;
  cover_url: string | null;
  rating: number | null;
  user_id: string;
  // Propiedades unidas mediante JOINs de Supabase
  status?: GameStatus;
  game_format?: GameFormat;
  platform?: Platform;
};