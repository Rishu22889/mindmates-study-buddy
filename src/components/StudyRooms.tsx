import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Volume2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudyRoomsProps {
  user: any;
}

const StudyRooms = ({ user }: StudyRoomsProps) => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newRoom, setNewRoom] = useState({
    room_name: '',
    max_participants: '4',
    pomodaro_duration: '25',
    ambient_sound: 'none'
  });

  useEffect(() => {
    fetchRooms();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('study_rooms_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'study_rooms'
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('study_rooms')
        .select(`
          *,
          study_sessions(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load rooms",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('study_rooms')
        .insert({
          ...newRoom,
          created_by: user.id,
          max_participants: parseInt(newRoom.max_participants),
          pomodaro_duration: parseInt(newRoom.pomodaro_duration)
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Room created successfully!",
        description: `"${newRoom.room_name}" is ready for study sessions.`,
      });

      setNewRoom({
        room_name: '',
        max_participants: '4',
        pomodaro_duration: '25',
        ambient_sound: 'none'
      });
      
      fetchRooms();
    } catch (error: any) {
      toast({
        title: "Failed to create room",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          room_id: roomId,
          user_id: user.id,
          start_time: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Joined room successfully!",
        description: "Your study session has started.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to join room",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Study Rooms</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Study Room</DialogTitle>
              <DialogDescription>Set up a new virtual study space for focused learning.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  value={newRoom.room_name}
                  onChange={(e) => setNewRoom({ ...newRoom, room_name: e.target.value })}
                  placeholder="e.g., JEE Math Study Group"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Select value={newRoom.max_participants} onValueChange={(value) => setNewRoom({ ...newRoom, max_participants: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 people</SelectItem>
                    <SelectItem value="4">4 people</SelectItem>
                    <SelectItem value="6">6 people</SelectItem>
                    <SelectItem value="8">8 people</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pomodoroDuration">Pomodoro Duration (minutes)</Label>
                <Select value={newRoom.pomodaro_duration} onValueChange={(value) => setNewRoom({ ...newRoom, pomodaro_duration: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="25">25 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ambientSound">Ambient Sound</Label>
                <Select value={newRoom.ambient_sound} onValueChange={(value) => setNewRoom({ ...newRoom, ambient_sound: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rain">Rain</SelectItem>
                    <SelectItem value="cafe">Cafe</SelectItem>
                    <SelectItem value="library">Library</SelectItem>
                    <SelectItem value="white-noise">White Noise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={createRoom} className="w-full" disabled={creating}>
                {creating ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{room.room_name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Users className="h-4 w-4" />
                    {room.study_sessions?.[0]?.count || 0}/{room.max_participants} participants
                  </CardDescription>
                </div>
                <Badge variant={room.is_active ? "default" : "secondary"}>
                  {room.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {room.pomodaro_duration} min sessions
                </div>
                {room.ambient_sound !== 'none' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Volume2 className="h-4 w-4" />
                    {room.ambient_sound}
                  </div>
                )}
                <Button 
                  onClick={() => joinRoom(room.id)}
                  className="w-full"
                  disabled={!room.is_active}
                >
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No active rooms</h3>
          <p className="text-muted-foreground mb-4">Create the first study room to get started!</p>
        </div>
      )}
    </div>
  );
};

export default StudyRooms;