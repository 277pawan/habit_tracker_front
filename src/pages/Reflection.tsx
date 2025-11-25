import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { BookOpen, Plus, Smile, Meh, Frown } from "lucide-react";
import { text } from "stream/consumers";

const moods = [
  { value: "great", label: "Great", icon: Smile, color: "text-success" },
  { value: "okay", label: "Okay", icon: Meh, color: "text-warning" },
  {
    value: "struggling",
    label: "Struggling",
    icon: Frown,
    color: "text-destructive",
  },
];

const Reflection = () => {
  const [reflections, setReflections] = useState<any[]>([]);
  const [textSummary, setTextSummary] = useState<string>();
  const [aiSummaryResponse, setaiSummaryResponse] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    mood: "okay",
  });

  useEffect(() => {
    loadReflections();
  }, []);

  const loadReflections = async () => {
    try {
      toast.info("Loading reflection and AI summary 🤖.");
      const data = await api.getReflections();
      setReflections(data);
      let reflectionText = "";
      data.map((data) => {
        reflectionText += data.content;
      });
      summarize(reflectionText);
    } catch (error) {
      toast.error("Failed to load reflections");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createReflection(formData);
      toast.success("Reflection saved 📝");
      setFormData({ content: "", mood: "okay" });
      setShowForm(false);
      loadReflections();
    } catch (error: any) {
      toast.error(error.message || "Failed to save reflection");
    }
  };
  const summarize = async (text: string) => {
    const apiKey = "AIzaSyASrxa8e8HMF1KAlFqdRTmef0a-QyGZQ5w"; // put your key here

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,

      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Summarize this text:\n" + text }],
            },
          ],
        }),
      },
    );

    const data = await res.json();
    console.log(data);
    setaiSummaryResponse(
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No output",
    );

    return;
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
      <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Reflection Journal</h1>
            <p className="text-muted-foreground mt-2">
              Take a moment to reflect on your journey
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-5 h-5" />
            New Entry
          </Button>
        </div>

        {/* New Reflection Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>New Reflection</CardTitle>
              <CardDescription>
                How are you feeling about your progress?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    How are you feeling?
                  </label>
                  <div className="flex gap-3">
                    {moods.map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <button
                          key={mood.value}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, mood: mood.value })
                          }
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            formData.mood === mood.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon
                            className={`w-8 h-8 mx-auto mb-2 ${mood.color}`}
                          />
                          <span className="text-sm font-medium">
                            {mood.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Your Thoughts (10 seconds)
                  </label>
                  <Textarea
                    placeholder="What's on your mind? What went well? What could improve?"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    required
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.content.length}/500
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Save Reflection
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* AI Weekly Summary */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              AI Weekly Summary
            </CardTitle>
            <CardDescription>
              Your personalized progress summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground italic">
                {aiSummaryResponse ??
                  `This week, you've shown remarkable consistency in your morning
                habits. You completed 85% of your learning goals and maintained
                a 7-day streak. Consider focusing more attention on your evening
                routine to maximize progress.`}
              </p>
            </div>
            <Button
              onClick={() => loadReflections()}
              variant="outline"
              className="mt-4"
            >
              Generate New Summary
            </Button>
          </CardContent>
        </Card>

        {/* Past Reflections */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Past Reflections</h2>
          {reflections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground mb-2">
                  No reflections yet
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Start journaling to track your thoughts and progress
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Write First Reflection
                </Button>
              </CardContent>
            </Card>
          ) : (
            reflections.map((reflection) => {
              const mood = moods.find((m) => m.value === reflection.mood);
              const MoodIcon = mood?.icon || Meh;
              return (
                <Card key={reflection.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MoodIcon className={`w-6 h-6 ${mood?.color}`} />
                        <span className="text-sm text-muted-foreground">
                          {new Date(reflection.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <Badge variant="secondary">{mood?.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap">
                      {reflection.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reflection;
