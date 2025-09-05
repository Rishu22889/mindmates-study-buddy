import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Timer, Play, Pause, Users, BookOpen, Trophy, Target, 
  Clock, Music, Bell, Settings, ChevronDown, Flame,
  Brain, Headphones, Video, MessageCircle, Coffee,
  Calendar, CheckCircle, Plus, Star, Zap, Volume2,
  UserPlus, MapPin, TrendingUp, Award, Heart, Sun,
  Moon, Sunrise, Sunset, User, MoreVertical
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import UserProfile from '@/components/UserProfile';
import AudioSystem from '@/components/AudioSystem';
import StudyPartnerSession from '@/components/StudyPartnerSession';
import AIAssistant from '@/components/AIAssistant';
import VideoCallInterface from '@/components/VideoCallInterface';
import StudyZone from '@/components/StudyZone';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studyTimer, setStudyTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('Mathematics');
  const [selectedSound, setSelectedSound] = useState('rain');
  const [volume, setVolume] = useState([30]);
  const [studyStreak, setStudyStreak] = useState(7);
  const [focusMode, setFocusMode] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [activeStudents, setActiveStudents] = useState(2847);
  const [showStudyZone, setShowStudyZone] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const navigate = useNavigate();
  
  // Study stats
  const [studyStats, setStudyStats] = useState({
    totalHours: 127,
    weeklyProgress: 85,
    studyStreak: 7,
    studyPartners: 12,
    availablePartners: 3,
    achievements: 8,
    recentAchievement: 'Focus Master'
  });

  // Friends and partners
  const [onlineFriends, setOnlineFriends] = useState([
    { id: '1', name: 'Sarah', avatar: '/assets/sumi.png', studying: 'Physics', available: true },
    { id: '2', name: 'Mike', avatar: '/assets/rishi.png', studying: 'Math', available: true },
    { id: '3', name: 'Alex', avatar: '/assets/sumi.png', studying: 'Chemistry', available: false },
    { id: '4', name: 'Emma', avatar: '/assets/rishi.png', studying: 'Biology', available: true }
  ]);

  const [suggestedPartner, setSuggestedPartner] = useState({
    name: 'Sarah Chen',
    avatar: '/assets/sumi.png',
    compatibility: 94,
    subjects: ['Physics', 'Mathematics'],
    studyStyle: 'Intensive Focus',
    timezone: 'Same as you'
  });

  // Study plan and tasks
  const [todaysPlan, setTodaysPlan] = useState([
    { time: '09:00', subject: 'Physics', progress: 75, duration: '2h' },
    { time: '11:30', subject: 'Chemistry', progress: 60, duration: '1.5h' },
    { time: '14:00', subject: 'Mathematics', progress: 90, duration: '2h' }
  ]);

  const [tasks, setTasks] = useState([
    { id: '1', title: 'Complete Physics Chapter 5', subject: 'Physics', time: '45min', priority: 'high', completed: false },
    { id: '2', title: 'Review Chemistry formulas', subject: 'Chemistry', time: '30min', priority: 'medium', completed: true },
    { id: '3', title: 'Math problem set 7', subject: 'Mathematics', time: '60min', priority: 'high', completed: false },
    { id: '4', title: 'Prepare Biology notes', subject: 'Biology', time: '40min', priority: 'low', completed: false }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: '1', text: 'Completed 2-hour Physics session with Sarah', time: '2h ago', type: 'session' },
    { id: '2', text: 'Added Chemistry homework to to-do list', time: '3h ago', type: 'task' },
    { id: '3', text: 'Achieved 7-day study streak!', time: 'today', type: 'achievement' },
    { id: '4', text: 'Connected with new study partner: Rahul', time: 'yesterday', type: 'social' }
  ]);

  useEffect(() => {
    checkUser();
    
    // Set time of day for theming
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    // Timer logic
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startStudySession = (partner?: any) => {
    setSelectedPartner(partner);
    setShowStudyZone(true);
    setIsTimerActive(true);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const dailyCompletionPercentage = (completedTasksCount / tasks.length) * 100;

  const getTimeIcon = () => {
    switch(timeOfDay) {
      case 'morning': return <Sunrise className="h-4 w-4" />;
      case 'afternoon': return <Sun className="h-4 w-4" />;
      case 'evening': return <Sunset className="h-4 w-4" />;
      default: return <Sun className="h-4 w-4" />;
    }
  };

  const getThemeClasses = () => {
    if (focusMode) return 'opacity-60 transition-opacity duration-300';
    switch(timeOfDay) {
      case 'morning': return 'bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20';
      case 'afternoon': return 'bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20';
      case 'evening': return 'bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20';
      default: return '';
    }
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

  return (
    <div className={`min-h-screen transition-all duration-300 ${getThemeClasses()}`}>
      {/* Study Zone Overlay */}
      <StudyZone
        isActive={showStudyZone}
        onClose={() => {
          setShowStudyZone(false);
          setIsTimerActive(false);
          setSelectedPartner(null);
        }}
        partner={selectedPartner}
        initialSubject={currentSubject}
      />

      {/* Header */}
      <header className="bg-gradient-to-r from-study-focus to-study-energy text-white p-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 animate-pulse"></div>
        <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-3xl font-bold">MindMates</h1>
              <p className="text-white/80">Your Personalized Study Companion</p>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
              <Flame className="h-5 w-5 text-orange-300 animate-bounce" />
              <span className="font-semibold">{studyStreak} day streak</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur rounded-full px-4 py-2">
              <Timer className="h-5 w-5" />
              <span className="font-mono text-lg">{formatTime(studyTimer)}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setIsTimerActive(!isTimerActive)}
              >
                {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getTimeIcon()}
              <span className="text-sm capitalize">{timeOfDay}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-white hover:bg-white/20 transition-all ${focusMode ? 'ring-2 ring-white/50' : ''}`}
              onClick={() => setFocusMode(!focusMode)}
            >
              <Target className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-white/20"></div>
            
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 relative">
              <Timer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Music className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></div>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarImage src="/assets/sumi.png" />
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
                onClick={handleSignOut}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Primary Action Section */}
        <section className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-foreground">Find Your Perfect Study Partner</h2>
            <p className="text-muted-foreground text-lg flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-study-energy animate-pulse" />
              <span className="font-semibold text-study-energy">{activeStudents.toLocaleString()}</span>
              <span>students studying now</span>
            </p>
          </div>

          {/* Large CTA Card */}
          <Card className="max-w-2xl mx-auto border-2 border-study-focus/20 bg-gradient-to-br from-study-focus/5 to-study-energy/5 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-study-focus to-study-energy rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Connect & Focus Together</h3>
                <p className="text-muted-foreground">AI-powered matching finds your ideal study companion</p>
              </div>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-study-focus to-study-energy hover:scale-105 transform transition-all duration-200 text-white px-8 py-4 text-xl"
                onClick={() => startStudySession()}
              >
                <Zap className="h-6 w-6 mr-2 animate-bounce" />
                Find Study Partner
              </Button>
            </CardContent>
          </Card>

          {/* Friends Hub */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Friends Online</h3>
            <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-2">
              {onlineFriends.map((friend) => (
                <div key={friend.id} className="flex flex-col items-center space-y-2 min-w-0 flex-shrink-0">
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-3 border-white shadow-lg">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${friend.available ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">{friend.studying}</p>
                    {friend.available && (
                      <Button size="sm" variant="outline" className="mt-1 text-xs">
                        Study Together
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Study Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50/50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Study Hours</CardTitle>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{studyStats.totalHours}h</div>
              <p className="text-xs text-muted-foreground mb-3">this week</p>
              <Progress value={studyStats.weeklyProgress} className="h-2" />
              <p className="text-xs text-blue-600 mt-1">{studyStats.weeklyProgress}% of weekly goal</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50/50 to-red-100/50 dark:from-orange-950/20 dark:to-red-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Flame className="h-5 w-5 text-orange-500 animate-bounce" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{studyStats.studyStreak}</div>
              <p className="text-xs text-muted-foreground mb-3">days running</p>
              <div className="w-16 h-16 mx-auto">
                <div className="relative w-full h-full">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${(studyStats.studyStreak / 30) * 100}, 100`}
                      className="text-orange-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Flame className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50/50 to-emerald-100/50 dark:from-green-950/20 dark:to-emerald-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Partners</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{studyStats.studyPartners}</div>
              <p className="text-xs text-muted-foreground mb-2">partners</p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">{studyStats.availablePartners} available now</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50/50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{studyStats.achievements}</div>
              <p className="text-xs text-muted-foreground mb-2">badges earned</p>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-purple-600">Latest: {studyStats.recentAchievement}</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Smart Matching Preview */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Your Perfect Study Match</h3>
          <Card className="max-w-2xl mx-auto border-2 border-study-energy/20 bg-gradient-to-br from-study-energy/5 to-study-focus/5">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-3 border-study-energy">
                    <AvatarImage src={suggestedPartner.avatar} />
                    <AvatarFallback>{suggestedPartner.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 -right-2 bg-study-energy text-white text-xs px-2 py-1 rounded-full">
                    AI Match
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xl font-bold">{suggestedPartner.name}</h4>
                  <p className="text-muted-foreground mb-2">{suggestedPartner.subjects.join(', ')}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-12 h-12 relative">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${suggestedPartner.compatibility}, 100`}
                            className="text-study-energy"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold">{suggestedPartner.compatibility}%</span>
                        </div>
                      </div>
                      <span>Compatibility</span>
                    </div>
                    <div className="text-muted-foreground">
                      <p>Style: {suggestedPartner.studyStyle}</p>
                      <p>{suggestedPartner.timezone}</p>
                    </div>
                  </div>
                </div>
                
                <Button className="bg-gradient-to-r from-study-energy to-study-focus">
                  <Heart className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                ✨ Powered by AI matching algorithm
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Today's Study Plan */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Today's Study Plan</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              {todaysPlan.map((plan, index) => (
                <Card key={index} className="min-w-[200px] flex-shrink-0 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm">{plan.time}</span>
                      <span className="text-xs text-muted-foreground">{plan.duration}</span>
                    </div>
                    <h4 className="font-medium mb-2">{plan.subject}</h4>
                    <Progress value={plan.progress} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">{plan.progress}% complete</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-gradient-to-r from-study-focus/10 to-study-energy/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Next Session</h4>
                    <p className="text-sm text-muted-foreground">Physics session with Sarah in 2h 15m</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Set Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* To-Do List Integration */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Today's Goals</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${dailyCompletionPercentage}, 100`}
                      className="text-study-energy"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold">{Math.round(dailyCompletionPercentage)}%</span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">Daily Progress</span>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className={`transition-all duration-200 ${task.completed ? 'opacity-60 bg-muted/50' : 'hover:shadow-md'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {task.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{task.time}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority === 'high' ? 'bg-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-blue-50/50 to-blue-100/50 hover:from-blue-100/50 hover:to-blue-200/50">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <span className="text-sm font-medium">Find Partner</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-green-50/50 to-green-100/50 hover:from-green-100/50 hover:to-green-200/50">
              <Target className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium">Solo Session</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-purple-50/50 to-purple-100/50 hover:from-purple-100/50 hover:to-purple-200/50">
              <MessageCircle className="h-8 w-8 text-purple-600" />
              <span className="text-sm font-medium">Message Friends</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-orange-50/50 to-orange-100/50 hover:from-orange-100/50 hover:to-orange-200/50">
              <Users className="h-8 w-8 text-orange-600" />
              <span className="text-sm font-medium">Join Study Room</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-teal-50/50 to-teal-100/50 hover:from-teal-100/50 hover:to-teal-200/50">
              <Brain className="h-8 w-8 text-teal-600" />
              <span className="text-sm font-medium">AI Doubt Solver</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-amber-50/50 to-amber-100/50 hover:from-amber-100/50 hover:to-amber-200/50">
              <Coffee className="h-8 w-8 text-amber-600" />
              <span className="text-sm font-medium">Take Study Break</span>
            </Button>
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section>
          <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.type === 'session' ? 'bg-blue-400' :
                      activity.type === 'task' ? 'bg-green-400' :
                      activity.type === 'achievement' ? 'bg-orange-400' : 'bg-purple-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.type === 'achievement' && (
                      <Trophy className="h-4 w-4 text-orange-400 animate-bounce" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* AI Assistant */}
      <AIAssistant
        currentSubject={currentSubject}
        studyContext="Dashboard - Ready to help with your studies"
      />
    </div>
  );
};

export default Dashboard;