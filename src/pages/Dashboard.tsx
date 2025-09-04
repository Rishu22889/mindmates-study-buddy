import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Users, Clock, BookOpen, Award, Timer, Volume2, Bell, 
  Zap, Play, Coffee, Music, Headphones, Target, TrendingUp,
  Calendar, CheckCircle, Star, Flame, Brain, Trophy,
  UserCheck, PlayCircle, Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import UserProfile from '@/components/UserProfile';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTimer, setCurrentTimer] = useState(25);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [ambientSound, setAmbientSound] = useState('rain');
  const [volume, setVolume] = useState([50]);
  const [studyStreak, setStudyStreak] = useState(7);
  const [isTimerActive, setIsTimerActive] = useState(false);
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

  const startStudySession = () => {
    setIsTimerActive(true);
    toast({
      title: "Study session started!",
      description: `${currentTimer} minute focus session with ${ambientSound} sounds`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your study space...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <UserProfile user={user} onProfileComplete={handleProfileComplete} />;
  }

  const studyStats = [
    { 
      title: 'Total Study Time', 
      value: '127h', 
      change: '+12h this week',
      icon: BookOpen, 
      color: 'text-study-focus',
      progress: 78,
      bgColor: 'bg-study-focus/10'
    },
    { 
      title: 'Active Sessions', 
      value: '43', 
      change: 'Currently in session',
      icon: Timer, 
      color: 'text-study-timer',
      progress: 85,
      bgColor: 'bg-study-timer/10'
    },
    { 
      title: 'Study Partners', 
      value: '12', 
      change: '3 available now',
      icon: Users, 
      color: 'text-study-calm',
      progress: 60,
      bgColor: 'bg-study-calm/10'
    },
    { 
      title: 'Achievements', 
      value: '8', 
      change: 'Focus Master earned!',
      icon: Trophy, 
      color: 'text-study-energy',
      progress: 100,
      bgColor: 'bg-study-energy/10'
    },
  ];

  const studyRooms = [
    {
      name: "📚 Mathematics Focus",
      participants: 8,
      maxParticipants: 12,
      timer: "23:45",
      mood: "Intense",
      subject: "JEE Maths",
      avatars: ["🧑‍🎓", "👩‍🎓", "🧑‍🎓"]
    },
    {
      name: "🧪 Chemistry Lab",
      participants: 5,
      maxParticipants: 8,
      timer: "45:12",
      mood: "Discussion",
      subject: "Organic Chemistry",
      avatars: ["👨‍🔬", "👩‍🔬"]
    },
    {
      name: "⚡ Physics Power",
      participants: 15,
      maxParticipants: 20,
      timer: "12:33",
      mood: "Silent",
      subject: "Mechanics",
      avatars: ["🧑‍🎓", "👩‍🎓", "👨‍🎓", "👩‍🎓"]
    }
  ];

  const studyPartners = [
    {
      name: "Sarah Kumar",
      subject: "Mathematics",
      compatibility: 94,
      status: "online",
      studyTime: "2h today"
    },
    {
      name: "Alex Chen",
      subject: "Physics",
      compatibility: 89,
      status: "in-session",
      studyTime: "3h today"
    },
    {
      name: "Maya Patel",
      subject: "Chemistry",
      compatibility: 92,
      status: "available",
      studyTime: "1.5h today"
    }
  ];

  const todaysPlan = [
    { time: "09:00", subject: "Mathematics", duration: "2h", progress: 100, status: "completed" },
    { time: "11:30", subject: "Physics", duration: "1.5h", progress: 60, status: "in-progress" },
    { time: "14:00", subject: "Chemistry", duration: "2h", progress: 0, status: "upcoming" },
    { time: "16:30", subject: "English", duration: "1h", progress: 0, status: "upcoming" }
  ];

  const recentActivity = [
    {
      action: "Completed 2-hour Physics session with Sarah",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-study-success"
    },
    {
      action: "Achieved 7-day study streak! 🔥",
      time: "Today",
      icon: Flame,
      color: "text-study-energy"
    },
    {
      action: "Joined Mathematics study group",
      time: "Yesterday",
      icon: Users,
      color: "text-study-calm"
    },
    {
      action: "Earned 'Focus Master' badge",
      time: "2 days ago",
      icon: Star,
      color: "text-study-timer"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Enhanced Header */}
      <header className="header-gradient backdrop-blur-sm sticky top-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-white" />
                <h1 className="text-2xl font-bold text-white">MindMates</h1>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {profile.subscription_tier}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-2">
                  <Flame className="h-5 w-5 text-study-energy" />
                  <span className="font-semibold">{studyStreak} day streak</span>
                </div>
                {isTimerActive && (
                  <div className="flex items-center space-x-2">
                    <Timer className="h-5 w-5 animate-pulse" />
                    <span className="font-mono">23:45</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Timer className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Zap className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Music className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-white/90">
                Welcome, <span className="font-semibold">{profile.full_name}</span>
              </div>
              
              <Button variant="outline" onClick={handleSignOut} className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section - Study Command Center */}
        <section className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to Focus?
            </h2>
            <p className="text-xl text-muted-foreground">
              <Users className="inline h-5 w-5 mr-2" />
              2,847 students studying now
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-study">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <Button 
                  onClick={startStudySession}
                  className="btn-study-focus w-full"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Start Study Session
                </Button>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Pomodoro Timer</label>
                    <Badge variant="outline">{currentTimer} minutes</Badge>
                  </div>
                  <div className="flex space-x-2">
                    {[25, 50, 90].map((time) => (
                      <Button
                        key={time}
                        variant={currentTimer === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentTimer(time)}
                        className="flex-1"
                      >
                        {time}m
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Focus Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your focus subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">📚 Mathematics</SelectItem>
                      <SelectItem value="physics">⚡ Physics</SelectItem>
                      <SelectItem value="chemistry">🧪 Chemistry</SelectItem>
                      <SelectItem value="english">📝 English</SelectItem>
                      <SelectItem value="biology">🧬 Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="timer-display text-center">
                  {isTimerActive ? "23:45" : `${currentTimer}:00`}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Ambient Sounds</label>
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Select value={ambientSound} onValueChange={setAmbientSound}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rain">🌧️ Rain</SelectItem>
                      <SelectItem value="forest">🌲 Forest</SelectItem>
                      <SelectItem value="cafe">☕ Café</SelectItem>
                      <SelectItem value="white-noise">📻 White Noise</SelectItem>
                      <SelectItem value="lofi">🎵 Lofi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Study Stats Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={stat.title} className="study-stat-card group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline space-x-2">
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <TrendingUp className="h-4 w-4 text-study-success" />
                    </div>
                    <div className="space-y-2">
                      <Progress value={stat.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Study Rooms */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Live Study Rooms</h3>
              <Badge variant="secondary" className="animate-pulse">
                <div className="w-2 h-2 bg-study-success rounded-full mr-2"></div>
                Live
              </Badge>
            </div>

            <div className="space-y-4">
              {studyRooms.map((room, index) => (
                <Card key={index} className="study-card hover:shadow-glow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{room.name}</h4>
                        <p className="text-sm text-muted-foreground">{room.subject}</p>
                      </div>
                      <Badge variant="outline" className={
                        room.mood === 'Intense' ? 'border-study-energy text-study-energy' :
                        room.mood === 'Discussion' ? 'border-study-calm text-study-calm' :
                        'border-study-focus text-study-focus'
                      }>
                        {room.mood}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {room.avatars.slice(0, 3).map((avatar, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm border-2 border-background">
                              {avatar}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {room.participants}/{room.maxParticipants} studying
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-study-timer">
                        <Timer className="h-4 w-4" />
                        <span className="font-mono">{room.timer}</span>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Join Room
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Card className="study-card border-dashed border-2 hover:border-primary">
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-semibold mb-2">Create Your Room</h4>
                  <p className="text-sm text-muted-foreground mb-4">Set your own study environment</p>
                  <Button variant="outline" className="w-full">
                    Create Room
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Study Partner Matching & Today's Plan */}
          <section className="space-y-6">
            {/* Study Partners */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Study Partners</h3>
              <div className="space-y-4">
                {studyPartners.map((partner, index) => (
                  <Card key={index} className="study-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold">
                            {partner.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold">{partner.name}</h4>
                            <p className="text-sm text-muted-foreground">{partner.subject} • {partner.studyTime}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {partner.compatibility}% match
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${
                              partner.status === 'online' ? 'bg-study-success' :
                              partner.status === 'in-session' ? 'bg-study-energy' :
                              'bg-study-calm'
                            }`}></div>
                            <span className="text-xs text-muted-foreground">{partner.status}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Today's Study Plan */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Today's Study Plan</h3>
              <Card className="study-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {todaysPlan.map((plan, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="text-sm font-mono text-muted-foreground min-w-[60px]">
                          {plan.time}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{plan.subject}</span>
                            <span className="text-sm text-muted-foreground">{plan.duration}</span>
                          </div>
                          <Progress value={plan.progress} className="h-2" />
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          plan.status === 'completed' ? 'bg-study-success' :
                          plan.status === 'in-progress' ? 'bg-study-energy animate-pulse' :
                          'bg-muted'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Users className="h-6 w-6" />
                <span>Join Random Room</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Target className="h-6 w-6" />
                <span>Solo Focus</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <UserCheck className="h-6 w-6" />
                <span>Find Group</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Coffee className="h-6 w-6" />
                <span>Study Break</span>
              </Button>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
            <Card className="study-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-1">
                          <IconComponent className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;