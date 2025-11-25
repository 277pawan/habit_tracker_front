import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Flame, Target, TrendingUp, Zap, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [userData, habitsData] = await Promise.all([
        api.getMe(),
        api.getHabits(),
      ]);
      setUser(userData);
      setHabits(habitsData);
    } catch (error: any) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const todayHabits = habits.filter(h => {
    const today = new Date().getDay();
    return h.weeklySchedule?.[today];
  });

  const completedToday = todayHabits.filter(h => h.completedToday).length;
  const completionRate = todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0;

  const handleToggleHabit = async (habitId: string, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        await api.uncompleteHabit(habitId);
      } else {
        await api.completeHabit(habitId);
      }
      loadDashboard();
      toast.success(isCompleted ? 'Habit unchecked' : 'Great job! 🎉');
    } catch (error) {
      toast.error('Failed to update habit');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto pb-20 md:pb-8">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Welcome back, {user?.name}! 👋</h1>
          <p className="text-xl text-muted-foreground">
            {user?.primaryIdentity && `You are becoming a ${user.primaryIdentity}`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{user?.currentStreak || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">days in a row</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Target className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{completedToday}/{todayHabits.length}</div>
              <p className="text-xs text-muted-foreground mt-1">habits completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Health Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{Math.round(completionRate)}</div>
              <p className="text-xs text-muted-foreground mt-1">out of 100</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Boosts</CardTitle>
              <Zap className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{user?.boostsReceived || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">received this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Habits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Habits</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep building your identity
                </p>
              </div>
              <Progress value={completionRate} className="w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayHabits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No habits scheduled for today.</p>
                <p className="text-sm mt-2">Create your first habit to get started!</p>
              </div>
            ) : (
              todayHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleHabit(habit.id, habit.completedToday)}
                    className="shrink-0"
                  >
                    {habit.completedToday ? (
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <h3 className={`font-medium ${habit.completedToday ? 'line-through text-muted-foreground' : ''}`}>
                      {habit.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{habit.identity}</p>
                  </div>
                  <Badge variant="secondary">{habit.difficulty}</Badge>
                  {habit.streak > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Flame className="h-4 w-4 text-primary" />
                      <span className="font-medium">{habit.streak}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">📚 Weekly Reflection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Take 2 minutes to reflect on your progress
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">⚡ Send a Boost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Motivate someone with your identity
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">📊 View Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See your progress and patterns
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
