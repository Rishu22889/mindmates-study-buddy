import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, Clock, Users, Target, TrendingUp, Award } from 'lucide-react';

interface AnalyticsProps {
  user: any;
}

const Analytics = ({ user }: AnalyticsProps) => {
  const [stats, setStats] = useState({
    totalHours: 0,
    totalSessions: 0,
    studyStreak: 0,
    averageSessionLength: 0,
    totalMatches: 0,
    completedGoals: 0
  });
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch study sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id);

      if (sessionsError) throw sessionsError;

      // Fetch user matches
      const { data: matches, error: matchesError } = await supabase
        .from('user_matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (matchesError) throw matchesError;

      // Calculate statistics
      const totalHours = sessions?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) / 60 || 0;
      const totalSessions = sessions?.length || 0;
      const averageSessionLength = totalSessions > 0 ? totalHours / totalSessions : 0;
      const totalMatches = matches?.length || 0;

      // Calculate study streak (simplified - consecutive days with sessions)
      const studyStreak = calculateStudyStreak(sessions || []);

      // Generate weekly data for the chart
      const weekly = generateWeeklyData(sessions || []);

      setStats({
        totalHours: Math.round(totalHours * 10) / 10,
        totalSessions,
        studyStreak,
        averageSessionLength: Math.round(averageSessionLength * 10) / 10,
        totalMatches,
        completedGoals: Math.floor(totalHours / 10) // Example: 1 goal per 10 hours
      });

      setWeeklyData(weekly);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStudyStreak = (sessions: any[]) => {
    if (!sessions.length) return 0;

    const sortedSessions = sessions
      .map(s => new Date(s.start_time).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date().toDateString();
    let currentDate = new Date();

    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = currentDate.toDateString();
      if (sortedSessions.includes(sessionDate)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const generateWeeklyData = (sessions: any[]) => {
    const weekData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayHours = sessions
        .filter(s => new Date(s.start_time).toDateString() === dateStr)
        .reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / 60;

      weekData.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        hours: Math.round(dayHours * 10) / 10
      });
    }
    
    return weekData;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const achievements = [
    { title: 'First Session', description: 'Complete your first study session', unlocked: stats.totalSessions > 0 },
    { title: 'Study Buddy', description: 'Match with your first study partner', unlocked: stats.totalMatches > 0 },
    { title: 'Week Warrior', description: 'Study for 7 consecutive days', unlocked: stats.studyStreak >= 7 },
    { title: 'Century Club', description: 'Complete 100 hours of study', unlocked: stats.totalHours >= 100 },
    { title: 'Social Learner', description: 'Match with 5 study partners', unlocked: stats.totalMatches >= 5 },
    { title: 'Dedication Master', description: 'Maintain a 30-day study streak', unlocked: stats.studyStreak >= 30 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Study Analytics</h2>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <CalendarDays className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studyStreak}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <Target className="h-4 w-4 text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSessionLength}</div>
            <p className="text-xs text-muted-foreground">hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Partners</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals Met</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedGoals}</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Study Hours</CardTitle>
          <CardDescription>Your study hours over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-12 text-sm font-medium">{day.day}</div>
                <div className="flex-1">
                  <Progress value={(day.hours / 8) * 100} className="h-2" />
                </div>
                <div className="w-12 text-sm text-muted-foreground text-right">
                  {day.hours}h
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Your study milestones and accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  achievement.unlocked 
                    ? 'border-primary/20 bg-primary/5' 
                    : 'border-gray-200 bg-gray-50/50'
                }`}
              >
                <Award className={`h-6 w-6 ${achievement.unlocked ? 'text-primary' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <h4 className={`font-medium ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <Badge variant="default" className="text-xs">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;