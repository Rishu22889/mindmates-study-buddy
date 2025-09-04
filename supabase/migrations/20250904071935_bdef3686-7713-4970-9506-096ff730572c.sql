-- Fix the study_rooms SELECT policy to allow users to discover active rooms
-- The current policy compares auth.uid() with room id instead of user id, which never matches

-- Drop the incorrect SELECT policy
DROP POLICY IF EXISTS "Enable read access for all users" ON public.study_rooms;

-- Create a new SELECT policy that allows authenticated users to see active study rooms
CREATE POLICY "Users can view active study rooms" 
ON public.study_rooms 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND is_active = true
);

-- Also allow users to see their own rooms regardless of active status
CREATE POLICY "Users can view their own study rooms" 
ON public.study_rooms 
FOR SELECT 
USING (auth.uid() = created_by);