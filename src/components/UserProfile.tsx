import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface UserProfileProps {
  user: any;
  onProfileComplete: (profile: any) => void;
}

const UserProfile = ({ user, onProfileComplete }: UserProfileProps) => {
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [examType, setExamType] = useState('');
  const [studyHoursGoal, setStudyHoursGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          exam_type: examType,
          study_hours_goal: parseInt(studyHoursGoal),
          subscription_tier: 'free'
        })
        .select()
        .single();

      if (error) throw error;

      onProfileComplete(data);
    } catch (error: any) {
      toast({
        title: "Profile creation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Complete Your Profile</CardTitle>
          <CardDescription>Tell us about your study goals to get better matches</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type</Label>
              <Select value={examType} onValueChange={setExamType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JEE">JEE (Joint Entrance Examination)</SelectItem>
                  <SelectItem value="NEET">NEET (Medical)</SelectItem>
                  <SelectItem value="UPSC">UPSC (Civil Services)</SelectItem>
                  <SelectItem value="CAT">CAT (Management)</SelectItem>
                  <SelectItem value="GATE">GATE (Engineering)</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="studyHoursGoal">Daily Study Hours Goal</Label>
              <Select value={studyHoursGoal} onValueChange={setStudyHoursGoal} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your daily study goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="8">8 hours</SelectItem>
                  <SelectItem value="10">10+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Profile..." : "Complete Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;