import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, BookOpen, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import UserProfile from '@/components/UserProfile';
import StudyRooms from '@/components/StudyRooms';
import StudyMatches from '@/components/StudyMatches';
import TutoringRequests from '@/components/TutoringRequests';
import Analytics from '@/components/Analytics';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    setUser(session.user);
    
    // Check if user profile exists
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    } else if (userProfile) {
      setProfile(userProfile);
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleProfileComplete = (newProfile: any) => {
    setProfile(newProfile);
    toast({
      title: "Profile completed!",
      description: "You can now access all features.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <UserProfile user={user} onProfileComplete={handleProfileComplete} />;
  }

  const stats = [
    { title: 'Total Study Hours', value: '127', icon: Clock, color: 'text-primary' },
    { title: 'Study Sessions', value: '43', icon: BookOpen, color: 'text-accent' },
    { title: 'Study Partners', value: '12', icon: Users, color: 'text-secondary' },
    { title: 'Achievements', value: '8', icon: Award, color: 'text-tertiary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">MindMates</h1>
            <Badge variant="secondary">{profile.subscription_tier}</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {profile.full_name}</span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {['overview', 'rooms', 'matches', 'tutoring', 'analytics'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest study sessions and matches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Completed 2-hour study session</p>
                        <p className="text-xs text-muted-foreground">Mathematics • 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New study partner matched</p>
                        <p className="text-xs text-muted-foreground">JEE Preparation • 5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Jump into your study routine</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => setActiveTab('rooms')}>
                    Join Study Room
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('matches')}>
                    Find Study Partner
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('tutoring')}>
                    Request Tutoring
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && <StudyRooms user={user} />}
        {activeTab === 'matches' && <StudyMatches user={user} />}
        {activeTab === 'tutoring' && <TutoringRequests user={user} />}
        {activeTab === 'analytics' && <Analytics user={user} />}
      </div>
    </div>
  );
};

export default Dashboard;