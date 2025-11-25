import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Zap, Send, Heart, Users } from 'lucide-react';

const identityOptions = [
  { id: 'learner', label: 'Learner 📚', emoji: '📚' },
  { id: 'healthy', label: 'Healthy Person 🏃', emoji: '🏃' },
  { id: 'financially-disciplined', label: 'Financially Disciplined 💰', emoji: '💰' },
  { id: 'developer', label: 'Skilled Developer 👨‍💻', emoji: '👨‍💻' },
  { id: 'mindful', label: 'Mindful Person 🧘', emoji: '🧘' },
  { id: 'connected', label: 'Connected Person 👥', emoji: '👥' },
  { id: 'creative', label: 'Creative Person 🎨', emoji: '🎨' },
  { id: 'compassionate', label: 'Compassionate Person ❤️', emoji: '❤️' },
];

const Boosts = () => {
  const [boosts, setBoosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    loadBoosts();
  }, []);

  const loadBoosts = async () => {
    try {
      const data = await api.getMyBoosts();
      setBoosts(data);
    } catch (error) {
      toast.error('Failed to load boosts');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBoost = async (identityId: string) => {
    setSending(identityId);
    try {
      await api.sendBoost(identityId);
      toast.success('Boost sent! ⚡');
      loadBoosts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send boost');
    } finally {
      setSending(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            Micro Social Boosts
          </h1>
          <p className="text-xl text-muted-foreground">
            Send anonymous motivation to others on the same journey
          </p>
        </div>

        {/* Received Boosts */}
        <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-secondary" />
              Your Energy Meter
            </CardTitle>
            <CardDescription>Boosts you've received this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-secondary mb-4">{boosts.length}</div>
              <p className="text-lg text-muted-foreground">
                {boosts.length === 0
                  ? 'Keep building your identity to receive boosts!'
                  : 'People are cheering you on! 🎉'}
              </p>
              {boosts.length > 0 && (
                <div className="mt-6 space-y-2">
                  {boosts.slice(0, 5).map((boost: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border"
                    >
                      <Zap className="w-5 h-5 text-secondary" />
                      <p className="text-sm">
                        Someone progressing as a <strong>{boost.identity}</strong> sent you energy!
                      </p>
                      <Badge variant="secondary">{boost.timeAgo}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Send Boosts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-6 h-6 text-primary" />
              Send a Boost
            </CardTitle>
            <CardDescription>
              Choose an identity to send anonymous motivation to someone on the same path
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {identityOptions.map((identity) => (
                <button
                  key={identity.id}
                  onClick={() => handleSendBoost(identity.id)}
                  disabled={sending === identity.id}
                  className="group relative p-6 rounded-lg border-2 border-border hover:border-primary/50 bg-card hover:bg-primary/5 transition-all text-left disabled:opacity-50"
                >
                  <div className="text-4xl mb-3">{identity.emoji}</div>
                  <h3 className="font-semibold mb-2">{identity.label}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    <Zap className="w-4 h-4" />
                    <span>{sending === identity.id ? 'Sending...' : 'Send Boost'}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-accent" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Choose Identity</h3>
                <p className="text-sm text-muted-foreground">
                  Select which identity group you want to motivate
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Send Boost</h3>
                <p className="text-sm text-muted-foreground">
                  Your boost is sent anonymously to someone building that identity
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Spread Energy</h3>
                <p className="text-sm text-muted-foreground">
                  They receive motivation and you build community connection
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Boosts;
