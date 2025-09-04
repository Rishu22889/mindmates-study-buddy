import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  Monitor, Settings, Users, Camera, Volume2, VolumeX,
  Maximize2, Minimize2, RotateCcw, Wifi, WifiOff
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VideoCallInterfaceProps {
  partnerId?: string;
  partnerName?: string;
  isInCall?: boolean;
  onStartCall?: () => void;
  onEndCall?: () => void;
}

const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  partnerId,
  partnerName = 'Study Partner',
  isInCall = false,
  onStartCall,
  onEndCall
}) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [callDuration, setCallDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isInCall) {
      setConnectionStatus('connecting');
      // Simulate connection process
      setTimeout(() => {
        setConnectionStatus('connected');
        startCallTimer();
      }, 2000);
    } else {
      setConnectionStatus('disconnected');
      stopCallTimer();
    }
  }, [isInCall]);

  const startCallTimer = () => {
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      setHasPermissions(true);
      toast({
        title: "Permissions granted",
        description: "Camera and microphone access enabled",
      });
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast({
        title: "Permission denied",
        description: "Please allow camera and microphone access",
        variant: "destructive",
      });
    }
  };

  const handleStartCall = async () => {
    if (!hasPermissions) {
      await requestPermissions();
    }
    onStartCall?.();
  };

  const handleEndCall = () => {
    onEndCall?.();
    // Stop all media streams
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        // In a real implementation, you'd replace the video track
        setIsScreenSharing(true);
      } else {
        setIsScreenSharing(false);
        // Restore camera stream
        await requestPermissions();
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
    }
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isInCall && !partnerId) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Video Call Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with a study partner to start video calling
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Camera & Microphone</h4>
            <Button
              variant="outline"
              onClick={requestPermissions}
              className="w-full"
              disabled={hasPermissions}
            >
              {hasPermissions ? (
                <>
                  <Badge variant="secondary" className="mr-2">✓</Badge>
                  Permissions Granted
                </>
              ) : (
                'Grant Permissions'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'max-w-4xl mx-auto'}`}>
      <Card className={`h-full ${isFullscreen ? 'border-0 rounded-none' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Study Session with {partnerName}</span>
              </CardTitle>
              <Badge 
                variant={connectionStatus === 'connected' ? 'secondary' : 'outline'}
                className={connectionStatus === 'connected' ? 'bg-study-success text-white' : ''}
              >
                <div className="flex items-center space-x-1">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="h-3 w-3" />
                  ) : (
                    <WifiOff className="h-3 w-3" />
                  )}
                  <span className="capitalize">{connectionStatus}</span>
                </div>
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {isInCall && connectionStatus === 'connected' && (
                <Badge variant="outline" className="font-mono">
                  {formatCallDuration(callDuration)}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Video Display Area */}
          <div className={`grid gap-4 ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-96'}`}>
            {/* Remote Video (Partner) */}
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                {connectionStatus === 'connected' ? (
                  <div className="text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-2">
                      <AvatarFallback className="text-lg">
                        {partnerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-white font-medium">{partnerName}</p>
                    <p className="text-white/70 text-sm">Camera off</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2" />
                    <p className="text-white">Connecting...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Local Video (You) */}
            <div className="relative">
              <div className="absolute top-4 right-4 w-32 h-24 bg-muted rounded-lg overflow-hidden border-2 border-white shadow-lg z-10">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <VideoOff className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-muted/50 rounded-lg">
            <Button
              variant={isAudioEnabled ? "secondary" : "destructive"}
              size="lg"
              onClick={toggleAudio}
              className="rounded-full"
            >
              {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              variant={isVideoEnabled ? "secondary" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full"
            >
              {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              onClick={toggleScreenShare}
              className="rounded-full"
            >
              <Monitor className="h-5 w-5" />
            </Button>

            {!isInCall ? (
              <Button
                onClick={handleStartCall}
                className="btn-study-success rounded-full px-8"
                size="lg"
              >
                <Phone className="h-5 w-5 mr-2" />
                Start Call
              </Button>
            ) : (
              <Button
                onClick={handleEndCall}
                variant="destructive"
                className="rounded-full px-8"
                size="lg"
              >
                <PhoneOff className="h-5 w-5 mr-2" />
                End Call
              </Button>
            )}

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Connection Status */}
          {connectionStatus !== 'connected' && isInCall && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 bg-muted px-4 py-2 rounded-full">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                <span className="text-sm">Establishing connection...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoCallInterface;