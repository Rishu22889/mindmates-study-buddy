-- Create users table for user profiles
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  exam_type TEXT,
  study_hours_goal SMALLINT,
  subscription_tier TEXT DEFAULT 'free',
  create_at TIMESTAMPTZ DEFAULT now()
);

-- Create study_rooms table
CREATE TABLE public.study_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_name TEXT,
  created_by UUID,
  max_participants SMALLINT,
  is_active BOOLEAN DEFAULT true,
  ambient_sound TEXT,
  pomodaro_duration SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_matches table
CREATE TABLE public.user_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID,
  user2_id UUID,
  compatibility_score NUMERIC,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create study_sessions table
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL,
  user_id UUID,
  partner_id UUID,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_minutes SMALLINT
);

-- Create tutoring_requests table
CREATE TABLE public.tutoring_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  subject TEXT,
  question TEXT,
  status TEXT,
  tutor_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutoring_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Enable read access for all users" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Policy with table joins" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for study_rooms table
CREATE POLICY "Enable read access for all users" ON public.study_rooms
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.study_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Policy with table joins" ON public.study_rooms
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Enable delete for users based on user created the room" ON public.study_rooms
  FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for user_matches table
CREATE POLICY "Enable read access for all users" ON public.user_matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_matches
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Policy with table joins" ON public.user_matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Enable delete for users based on user_id" ON public.user_matches
  FOR DELETE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create RLS policies for study_sessions table
CREATE POLICY "Enable read access for all users" ON public.study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Policy with table joins" ON public.study_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON public.study_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for tutoring_requests table
CREATE POLICY "Enable read access for all users" ON public.tutoring_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for authenticated users only" ON public.tutoring_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Policy with table joins" ON public.tutoring_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON public.tutoring_requests
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', false);

-- Create storage policies for avatars
CREATE POLICY "Users can view their own avatar" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);