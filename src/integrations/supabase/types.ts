// Tipos para o sistema de dados local

export interface Database {
  public: {
    Tables: {
      collaborators: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          position?: string;
          department?: string;
          status?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          position?: string;
          department?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          position?: string;
          department?: string;
          status?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          email?: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string;
          updated_at?: string;
        };
      };
      user_credits: {
        Row: {
          id: string;
          user_id: string;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          credits: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          credits?: number;
          updated_at?: string;
        };
      };
      trainings: {
        Row: {
          id: string;
          title: string;
          description?: string;
          content?: string;
          duration?: number;
          status?: string;
          created_by?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          content?: string;
          duration?: number;
          status?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          content?: string;
          duration?: number;
          status?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Tipos auxiliares
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Tipos específicos
export type Collaborator = Tables<'collaborators'>;
export type Profile = Tables<'profiles'>;
export type UserCredits = Tables<'user_credits'>;
export type Training = Tables<'trainings'>;

// Tipos de autenticação local
export interface LocalUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface LocalSession {
  user: LocalUser;
  access_token: string;
  expires_at: number;
}

// Tipos de resposta da API local
export interface LocalApiResponse<T = any> {
  data: T | null;
  error: Error | null;
}

export interface LocalAuthResponse {
  data: {
    user?: LocalUser;
    session?: LocalSession;
  };
  error: Error | null;
}