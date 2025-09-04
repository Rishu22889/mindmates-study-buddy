import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, Timer, Video, Mic, MicOff, Camera, CameraOff,
  UserCheck, Clock, Brain, Target, Plus, Zap
} from 'lucide-react';

interface StudyPartner {
  id: string;
  name: string;
  subject: string;
  compatibility: number;
  status: 'online' | 'in-session' | 'available' | 'offline';
  studyTime: string;
  avatar?: string;
  studyStreak: number;
  preferredStyle: string;
}

interface ActiveSession {
  partnerId: string;
  partnerName: string;
  subject: string;
  startTime: string;
  timer: string;
  status: 'waiting' | 'active' | 'break';
  hasVideo: boolean;
  hasAudio: boolean;
}

interface StudyPartnerSessionProps {
  onStartSession: (partnerId: string) => void;
  onJoinVideoCall: (sessionId: string) => void;
}

const StudyPartnerSession: React.FC<StudyPartnerSessionProps> = ({
  onStartSession,
  onJoinVideoCall
}) => {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const studyPartners: StudyPartner[] = [
    {
      id: '1',
      name: 'Sarah Kumar',
      subject: 'Mathematics',
      compatibility: 94,
      status: 'online',
      studyTime: '2h today',
      studyStreak: 12,
      preferredStyle: 'Intensive'
    },
    {
      id: '2',
      name: 'Alex Chen', 
      subject: 'Physics',
      compatibility: 89,
      status: 'available',
      studyTime: '3h today',
      studyStreak: 8,
      preferredStyle: 'Discussion'
    },
    {
      id: '3',
      name: 'Maya Patel',
      subject: 'Chemistry',
      compatibility: 92,
      status: 'in-session',
      studyTime: '1.5h today',
      studyStreak: 15,
      preferredStyle: 'Silent Focus'
    }
  ];

  const mockActiveSession: ActiveSession = {
    partnerId: '1',
    partnerName: 'Sarah Kumar',
    subject: 'Mathematics',
    startTime: '14:30',
    timer: '23:45',
    status: 'active',
    hasVideo: videoEnabled,
    hasAudio: audioEnabled
  };

  const handleStartSession = (partnerId: string) => {
    const partner = studyPartners.find(p => p.id === partnerId);
    if (partner) {
      setActiveSession({
        partnerId,
        partnerName: partner.name,
        subject: partner.subject,
        startTime: new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        timer: '25:00',
        status: 'waiting',
        hasVideo: false,
        hasAudio: true
      });
      onStartSession(partnerId);
    }
  };

  const handleEndSession = () => {
    setActiveSession(null);
    setVideoEnabled(false);
    setAudioEnabled(true);
  };

  const handleVideoToggle = () => {
    setVideoEnabled(!videoEnabled);
    if (activeSession) {
      setActiveSession({
        ...activeSession,
        hasVideo: !videoEnabled
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-study-success';
      case 'available': return 'bg-study-calm';
      case 'in-session': return 'bg-study-timer';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online Now';
      case 'available': return 'Available';
      case 'in-session': return 'In Session';
      default: return 'Offline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Session Display */}
      {activeSession && (
        <Card className="border-study-success bg-study-success/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-study-success" />
                <span>Study Session with {activeSession.partnerName}</span>
              </CardTitle>
              <Badge variant="secondary" className="animate-pulse">
                <div className="w-2 h-2 bg-study-success rounded-full mr-2"></div>
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-mono text-study-timer">
                    {activeSession.timer}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Started {activeSession.startTime}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {activeSession.subject}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Focus Subject
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={videoEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={handleVideoToggle}
                >
                  {videoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant={audioEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onJoinVideoCall(activeSession.partnerId)}
                  disabled={!videoEnabled}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEndSession}
                >
                  End Session
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Session Progress</span>
                <span className="font-medium">65% Complete</span>
              </div>
              <div className="mt-2 bg-background rounded-full h-2">
                <div 
                  className="bg-study-success rounded-full h-2 transition-all duration-500"
                  style={{ width: '65%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Study Partners */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Find Your Study Partner</h3>
          <Badge variant="outline">
            {studyPartners.filter(p => p.status !== 'offline').length} Available
          </Badge>
        </div>

        <div className="grid gap-4">
          {studyPartners.map((partner) => (
            <Card key={partner.id} className="study-card hover:shadow-glow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={partner.avatar} />
                        <AvatarFallback>
                          {partner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(partner.status)}`} />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{partner.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {partner.compatibility}% match
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Brain className="h-3 w-3" />
                          <span>{partner.subject}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Timer className="h-3 w-3" />
                          <span>{partner.studyTime}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Zap className="h-3 w-3" />
                          <span>{partner.studyStreak} day streak</span>
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Prefers: {partner.preferredStyle} • {getStatusText(partner.status)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {partner.status === 'online' || partner.status === 'available' ? (
                      <Button
                        onClick={() => handleStartSession(partner.id)}
                        disabled={!!activeSession}
                        className="btn-study-focus"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    ) : (
                      <Badge variant="secondary" className="px-3 py-1">
                        {getStatusText(partner.status)}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Match Option */}
        <Card className="border-dashed border-2 hover:border-primary study-card">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h4 className="font-semibold mb-2">Quick Match</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Let our AI find your perfect study partner instantly
            </p>
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Find Study Partner
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyPartnerSession;