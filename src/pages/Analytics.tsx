import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { TrendingUp, Calendar, Flame, Target, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Analytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await api.getHabitAnalytics();
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
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

  const weeklyCompletion = analytics?.weeklyCompletion || 0;
  const bestDay = analytics?.bestDay || 'Monday';
  const worstDay = analytics?.worstDay || 'Friday';
  const currentStreak = analytics?.currentStreak || 0;
  const longestStreak = analytics?.longestStreak || 0;
  const totalCompleted = analytics?.totalCompleted || 0;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-8">
        <div>
          <h1 className="text-4xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">Track your progress and patterns</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{currentStreak}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Best: {longestStreak} days
              </p>
              <Progress value={(currentStreak / longestStreak) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weekly Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{weeklyCompletion}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                This week's performance
              </p>
              <Progress value={weeklyCompletion} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
              <Target className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{totalCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All time completions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Best & Worst Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-success" />
                Best Day
              </CardTitle>
              <CardDescription>Your most consistent day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-success mb-2">{bestDay}</div>
              <p className="text-sm text-muted-foreground">
                You complete the most habits on this day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-warning" />
                Needs Attention
              </CardTitle>
              <CardDescription>Room for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-warning mb-2">{worstDay}</div>
              <p className="text-sm text-muted-foreground">
                Focus on building consistency on this day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Completion Heatmap Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Completion History</CardTitle>
            <CardDescription>Your habit completion pattern over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = Math.random();
                return (
                  <div
                    key={i}
                    className="aspect-square rounded"
                    style={{
                      backgroundColor: `hsl(280 85% ${100 - intensity * 40}%)`,
                    }}
                    title={`${Math.round(intensity * 100)}% completion`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[100, 90, 70, 50, 30].map((lightness) => (
                  <div
                    key={lightness}
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: `hsl(280 85% ${lightness}%)` }}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>

        {/* Time of Day Success */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Success by Time of Day
            </CardTitle>
            <CardDescription>When are you most likely to complete habits?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { period: 'Morning (6 AM - 12 PM)', rate: 85, color: 'bg-success' },
                { period: 'Afternoon (12 PM - 6 PM)', rate: 72, color: 'bg-primary' },
                { period: 'Evening (6 PM - 12 AM)', rate: 58, color: 'bg-warning' },
                { period: 'Night (12 AM - 6 AM)', rate: 25, color: 'bg-muted' },
              ].map((time) => (
                <div key={time.period}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{time.period}</span>
                    <span className="text-sm text-muted-foreground">{time.rate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`${time.color} h-2 rounded-full transition-all`}
                      style={{ width: `${time.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
