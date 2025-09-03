import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Target, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudyMatchesProps {
  user: any;
}

const StudyMatches = ({ user }: StudyMatchesProps) => {
  const [matches, setMatches] = useState<any[]>([]);
  const [existingMatches, setExistingMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExistingMatches();
  }, []);

  const fetchExistingMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('user_matches')
        .select(`
          *,
          user1:users!user_matches_user1_id_fkey(id, full_name, exam_type),
          user2:users!user_matches_user2_id_fkey(id, full_name, exam_type)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExistingMatches(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load matches",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const findMatches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('match-users', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      setMatches(data.matches || []);
      toast({
        title: "Matches found!",
        description: `Found ${data.matches?.length || 0} compatible study partners.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to find matches",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMatchRequest = async (targetUserId: string, compatibilityScore: number) => {
    try {
      const { error } = await supabase
        .from('user_matches')
        .insert({
          user1_id: user.id,
          user2_id: targetUserId,
          status: 'pending',
          compatibility_score: compatibilityScore
        });

      if (error) throw error;

      toast({
        title: "Match request sent!",
        description: "Your study partner request has been sent.",
      });

      fetchExistingMatches();
    } catch (error: any) {
      toast({
        title: "Failed to send request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const respondToMatch = async (matchId: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('user_matches')
        .update({ status })
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: status === 'accepted' ? "Match accepted!" : "Match declined",
        description: status === 'accepted' 
          ? "You can now study together!" 
          : "Match request has been declined.",
      });

      fetchExistingMatches();
    } catch (error: any) {
      toast({
        title: "Failed to respond",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Study Matches</h2>
        <Button onClick={findMatches} disabled={loading}>
          {loading ? "Finding Matches..." : "Find Study Partners"}
        </Button>
      </div>

      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">New Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <Card key={match.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {match.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{match.full_name}</CardTitle>
                      <CardDescription>{match.exam_type}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {match.compatibility_score}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      {match.study_hours_goal} hours/day goal
                    </div>
                    <Button 
                      onClick={() => sendMatchRequest(match.id, match.compatibility_score)}
                      className="w-full"
                    >
                      Send Match Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {existingMatches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingMatches.map((match) => {
              const otherUser = match.user1_id === user.id ? match.user2 : match.user1;
              const isReceiver = match.user2_id === user.id;
              
              return (
                <Card key={match.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {otherUser?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{otherUser?.full_name}</CardTitle>
                        <CardDescription>{otherUser?.exam_type}</CardDescription>
                      </div>
                      <Badge variant={
                        match.status === 'accepted' ? 'default' :
                        match.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {match.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-4 w-4" />
                        {match.compatibility_score}% compatibility
                      </div>
                      {match.status === 'pending' && isReceiver && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => respondToMatch(match.id, 'accepted')}
                            className="flex-1"
                          >
                            Accept
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => respondToMatch(match.id, 'declined')}
                            className="flex-1"
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                      {match.status === 'accepted' && (
                        <Button className="w-full">
                          Start Study Session
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {matches.length === 0 && existingMatches.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">No matches yet</h3>
          <p className="text-muted-foreground mb-4">Find compatible study partners to start your learning journey!</p>
        </div>
      )}
    </div>
  );
};

export default StudyMatches;