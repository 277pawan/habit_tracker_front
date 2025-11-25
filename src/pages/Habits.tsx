import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Flame } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Habits = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    identity: '',
    difficulty: 'medium',
    reminderTime: '09:00',
    weeklySchedule: [true, true, true, true, true, true, true],
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await api.getHabits();
      setHabits(data);
    } catch (error) {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createHabit(formData);
      toast.success('Habit created! 🎉');
      setDialogOpen(false);
      setFormData({
        name: '',
        identity: '',
        difficulty: 'medium',
        reminderTime: '09:00',
        weeklySchedule: [true, true, true, true, true, true, true],
      });
      loadHabits();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create habit');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this habit?')) return;
    try {
      await api.deleteHabit(id);
      toast.success('Habit deleted');
      loadHabits();
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  const toggleDay = (index: number) => {
    const newSchedule = [...formData.weeklySchedule];
    newSchedule[index] = !newSchedule[index];
    setFormData({ ...formData, weeklySchedule: newSchedule });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Habits</h1>
            <p className="text-muted-foreground mt-2">Build your identity, one habit at a time</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                New Habit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
                <DialogDescription>Define a habit that aligns with your identity</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Habit Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Read for 30 minutes"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identity">Identity</Label>
                  <Input
                    id="identity"
                    placeholder="e.g., Learner, Healthy Person"
                    value={formData.identity}
                    onChange={(e) => setFormData({ ...formData, identity: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Reminder Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.reminderTime}
                      onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Weekly Schedule</Label>
                  <div className="flex gap-2">
                    {DAYS.map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 font-medium transition-all ${
                          formData.weeklySchedule[index]
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Create Habit
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <p className="text-xl text-muted-foreground mb-4">No habits yet</p>
                <p className="text-sm text-muted-foreground mb-6">Create your first habit to start building your identity</p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            habits.map((habit) => (
              <Card key={habit.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <CardDescription className="mt-1">{habit.identity}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(habit.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        habit.difficulty === 'easy'
                          ? 'secondary'
                          : habit.difficulty === 'hard'
                          ? 'destructive'
                          : 'default'
                      }
                    >
                      {habit.difficulty}
                    </Badge>
                    {habit.streak > 0 && (
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Flame className="h-4 w-4 text-primary" />
                        <span>{habit.streak} day streak</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {DAYS.map((day, index) => (
                      <div
                        key={day}
                        className={`flex-1 text-center text-xs py-1 rounded ${
                          habit.weeklySchedule?.[index]
                            ? 'bg-primary/20 text-primary font-medium'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    ⏰ Reminder: {habit.reminderTime}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Habits;
