import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

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

  const getDayHabits = (date: Date) => {
    const dayOfWeek = date.getDay();
    return habits.filter(h => h.weeklySchedule?.[dayOfWeek]);
  };

  const selectedDayHabits = getDayHabits(selectedDate);

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
        <div>
          <h1 className="text-4xl font-bold">Habit Calendar</h1>
          <p className="text-muted-foreground mt-2">Plan and track your habits across the week</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-lg border"
              />
            </CardContent>
          </Card>

          {/* Selected Day Habits */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedDayHabits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No habits scheduled for this day</p>
                </div>
              ) : (
                selectedDayHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card/50"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{habit.name}</h3>
                      <p className="text-sm text-muted-foreground">{habit.identity}</p>
                      <p className="text-xs text-muted-foreground mt-1">⏰ {habit.reminderTime}</p>
                    </div>
                    <Badge variant={
                      habit.difficulty === 'easy'
                        ? 'secondary'
                        : habit.difficulty === 'hard'
                        ? 'destructive'
                        : 'default'
                    }>
                      {habit.difficulty}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                const dayHabits = habits.filter(h => h.weeklySchedule?.[index]);
                return (
                  <div key={day} className="text-center">
                    <div className="font-medium text-sm mb-2">{day}</div>
                    <div className="space-y-1">
                      {dayHabits.slice(0, 3).map((habit) => (
                        <div
                          key={habit.id}
                          className="text-xs p-2 rounded bg-primary/10 text-primary font-medium truncate"
                          title={habit.name}
                        >
                          {habit.name}
                        </div>
                      ))}
                      {dayHabits.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{dayHabits.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Email Notification Info */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Email Notifications Active</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive email reminders for your scheduled habits at the specified times.
                  Manage notification settings in your profile.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Calendar;
