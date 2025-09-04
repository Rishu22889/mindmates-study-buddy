import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Timer, Play, Pause, Square, Coffee, Brain, Target,
  Maximize2, Minimize2, X, Settings, Users, Volume2,
  Book, MessageCircle, Camera, Mic, RotateCw, Moon,
  Sun, Trees, Sparkles, Monitor
} from 'lucide-react';
import AudioSystem from './AudioSystem';
import VideoCallInterface from './VideoCallInterface';
import AIAssistant from './AIAssistant';

interface StudyZoneProps {
  isActive: boolean;
  onClose: () => void;
  partner?: {
    name: string;
    subject: string;
    avatar?: string;
  };
  initialSubject?: string;
  sessionDuration?: number;
}

const StudyZone: React.FC<StudyZoneProps> = ({
  isActive,
  onClose,
  partner,
  initialSubject = 'Mathematics',
  sessionDuration = 25
}) => {
  const [currentMode, setCurrentMode] = useState<'focus' | 'break' | 'discussion'>('focus');
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60); // in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [backgroundTheme, setBackgroundTheme] = useState('library');
  const [notes, setNotes] = useState('');
  const [studyProgress, setStudyProgress] = useState(25);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [selectedSound, setSelectedSound] = useState('rain');
  const [volume, setVolume] = useState([30]);
  const [sessionStats, setSessionStats] = useState({
    focusTime: 0,
    breakTime: 0,
    concepts: 0,
    aiQueries: 0
  });

  const themes = {
    library: {
      name: '📚 Library',
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
      darkBg: 'from-amber-900/20 via-orange-900/20 to-yellow-900/20',
      description: 'Warm, scholarly environment'
    },
    nature: {
      name: '🌲 Nature',
      bg: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
      darkBg: 'from-green-900/20 via-emerald-900/20 to-teal-900/20',
      description: 'Calm forest vibes'
    },
    space: {
      name: '🌌 Space',
      bg: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50',
      darkBg: 'from-indigo-900/20 via-purple-900/20 to-blue-900/20',
      description: 'Infinite possibilities'
    },
    minimalist: {
      name: '⚪ Minimalist',
      bg: 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50',
      darkBg: 'from-gray-900/20 via-slate-900/20 to-zinc-900/20',
      description: 'Clean and distraction-free'
    }
  };

  const modeConfig = {
    focus: {
      name: 'Deep Focus Mode',
      icon: Target,
      color: 'text-study-focus',
      bgColor: 'bg-study-focus/10',
      description: 'Intensive study session'
    },
    break: {
      name: 'Break Time',
      icon: Coffee,
      color: 'text-study-calm',
      bgColor: 'bg-study-calm/10',
      description: 'Recharge and relax'
    },
    discussion: {
      name: 'Discussion Mode',
      icon: Users,
      color: 'text-study-energy',
      bgColor: 'bg-study-energy/10',
      description: 'Collaborate with partner'
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const handleSessionComplete = () => {
    // Switch to break mode or end session
    if (currentMode === 'focus') {
      setCurrentMode('break');
      setTimeRemaining(5 * 60); // 5 minute break
    } else {
      // Session complete
      setSessionStats(prev => ({
        ...prev,
        focusTime: prev.focusTime + sessionDuration
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  const currentTheme = themes[backgroundTheme as keyof typeof themes];
  const currentModeConfig = modeConfig[currentMode];
  const ModeIcon = currentModeConfig.icon;

  return (
    <div className={`fixed inset-0 z-50 ${currentTheme.bg} dark:bg-gradient-to-br dark:${currentTheme.darkBg}`}>
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${currentModeConfig.bgColor}`}>
                <ModeIcon className={`h-5 w-5 ${currentModeConfig.color}`} />
              </div>
              <div>
                <h1 className="font-bold text-lg">{currentModeConfig.name}</h1>
                <p className="text-sm text-muted-foreground">{currentModeConfig.description}</p>
              </div>
            </div>
            
            {partner && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-full">
                <Users className="h-4 w-4" />
                <span className="text-sm">with {partner.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {partner.subject}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-3xl font-mono font-bold text-study-timer">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round((1 - timeRemaining / (sessionDuration * 60)) * 100)}% complete
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant={isTimerActive ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsTimerActive(!isTimerActive)}
              >
                {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsTimerActive(false);
                  setTimeRemaining(sessionDuration * 60);
                }}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <Progress 
            value={(1 - timeRemaining / (sessionDuration * 60)) * 100} 
            className="h-2"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Notes & Subject */}
        <div className="w-1/3 p-6 space-y-6">
          <Card className="h-full">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="mb-4">
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  <Book className="h-4 w-4" />
                  <span>Study Notes - {initialSubject}</span>
                </h3>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes during your study session..."
                  className="flex-1 resize-none"
                  rows={15}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Study Progress</h4>
                  <Progress value={studyProgress} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Current Understanding</span>
                    <span>{studyProgress}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-semibold">{sessionStats.focusTime}m</div>
                    <div className="text-muted-foreground">Focus Time</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="font-semibold">{sessionStats.aiQueries}</div>
                    <div className="text-muted-foreground">AI Queries</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Video/Partner */}
        <div className="flex-1 p-6">
          {partner && isVideoCall ? (
            <VideoCallInterface
              partnerId="1"
              partnerName={partner.name}
              isInCall={true}
              onEndCall={() => setIsVideoCall(false)}
            />
          ) : (
            <Card className="h-full">
              <CardContent className="p-6 h-full flex flex-col items-center justify-center">
                {partner ? (
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{partner.name}</h3>
                      <p className="text-muted-foreground">Studying {partner.subject}</p>
                    </div>
                    <Button
                      onClick={() => setIsVideoCall(true)}
                      className="btn-study-focus"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Start Video Call
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-8 bg-muted/50 rounded-full">
                      <Target className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Solo Study Mode</h3>
                      <p className="text-muted-foreground">Focus on your studies with AI assistance</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Controls & Settings */}
        <div className="w-1/3 p-6 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* Mode Selector */}
              <div>
                <h4 className="font-medium mb-3">Study Mode</h4>
                <div className="space-y-2">
                  {Object.entries(modeConfig).map(([mode, config]) => {
                    const Icon = config.icon;
                    return (
                      <Button
                        key={mode}
                        variant={currentMode === mode ? "default" : "outline"}
                        onClick={() => setCurrentMode(mode as any)}
                        className="w-full justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {config.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Background Theme */}
              <div>
                <h4 className="font-medium mb-3">Environment</h4>
                <Select value={backgroundTheme} onValueChange={setBackgroundTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(themes).map(([key, theme]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div>{theme.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {theme.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Audio System */}
              <AudioSystem
                selectedSound={selectedSound}
                onSoundChange={setSelectedSound}
                volume={volume}
                onVolumeChange={setVolume}
              />

              {/* Session Stats */}
              <div>
                <h4 className="font-medium mb-3">Session Overview</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Focus Sessions</span>
                    <span className="font-medium">2/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break Time</span>
                    <span className="font-medium">{sessionStats.breakTime}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concepts Learned</span>
                    <span className="font-medium">{sessionStats.concepts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI Assistance Used</span>
                    <span className="font-medium">{sessionStats.aiQueries} times</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Assistant - Positioned for Study Zone */}
      <AIAssistant
        currentSubject={initialSubject}
        studyContext={`Study Zone - ${currentModeConfig.name}`}
      />
    </div>
  );
};

export default StudyZone;