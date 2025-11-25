import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { BookOpen, Dumbbell, DollarSign, Code, Heart, Sparkles, Users, Brain } from 'lucide-react';

const identityOptions = [
  { id: 'learner', label: 'I am a Learner', icon: BookOpen, color: 'text-blue-500', description: 'Constantly growing and expanding knowledge' },
  { id: 'healthy', label: 'I am Healthy', icon: Dumbbell, color: 'text-green-500', description: 'Taking care of body and mind' },
  { id: 'financially-disciplined', label: 'I am Financially Disciplined', icon: DollarSign, color: 'text-yellow-500', description: 'Building wealth and security' },
  { id: 'developer', label: 'I am a Skilled Developer', icon: Code, color: 'text-purple-500', description: 'Mastering the craft of coding' },
  { id: 'mindful', label: 'I am Mindful', icon: Brain, color: 'text-pink-500', description: 'Present and aware in every moment' },
  { id: 'connected', label: 'I am Connected', icon: Users, color: 'text-indigo-500', description: 'Building meaningful relationships' },
  { id: 'creative', label: 'I am Creative', icon: Sparkles, color: 'text-orange-500', description: 'Expressing unique ideas and vision' },
  { id: 'compassionate', label: 'I am Compassionate', icon: Heart, color: 'text-red-500', description: 'Caring for others and myself' },
];

const Identity = () => {
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadIdentity();
  }, []);

  const loadIdentity = async () => {
    try {
      const data = await api.getUserIdentity();
      if (data) {
        setSelectedPrimary(data.primaryIdentity);
        setSelectedSecondary(data.secondaryIdentity);
      }
    } catch (error) {
      // No identity set yet
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPrimary) {
      toast.error('Please select a primary identity');
      return;
    }

    setSaving(true);
    try {
      await api.selectIdentity({
        primaryIdentity: selectedPrimary,
        secondaryIdentity: selectedSecondary || undefined,
      });
      toast.success('Identity saved! 🎉');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save identity');
    } finally {
      setSaving(false);
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
      <div className="max-w-6xl mx-auto space-y-8 pb-20 md:pb-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Build Your Identity
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose who you're becoming. Habits will follow.
          </p>
        </div>

        {/* Primary Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Identity</CardTitle>
            <CardDescription>This is the core of who you're becoming</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {identityOptions.map((identity) => {
                const Icon = identity.icon;
                const isSelected = selectedPrimary === identity.id;
                return (
                  <button
                    key={identity.id}
                    onClick={() => setSelectedPrimary(identity.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-lg scale-105'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : identity.color}`} />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{identity.label}</h3>
                        <p className="text-xs text-muted-foreground">{identity.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <Badge className="mt-2" variant="default">Primary</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Secondary Identity (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle>Secondary Identity (Optional)</CardTitle>
            <CardDescription>Add another dimension to your growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {identityOptions
                .filter(i => i.id !== selectedPrimary)
                .map((identity) => {
                  const Icon = identity.icon;
                  const isSelected = selectedSecondary === identity.id;
                  return (
                    <button
                      key={identity.id}
                      onClick={() => setSelectedSecondary(isSelected ? null : identity.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-accent bg-accent/10 shadow-lg scale-105'
                          : 'border-border hover:border-accent/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-accent' : identity.color}`} />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{identity.label}</h3>
                          <p className="text-xs text-muted-foreground">{identity.description}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge className="mt-2" variant="secondary">Secondary</Badge>
                      )}
                    </button>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleSave} disabled={saving || !selectedPrimary}>
            {saving ? 'Saving...' : 'Save Identity'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Identity;
