import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { scenarios, Scenario, categoryInfo } from "@/data/scenarios";
import ScenarioCard from "@/components/ScenarioCard";
import ScenarioPlayer from "@/components/ScenarioPlayer";
import AirportCheckIn from "@/components/AirportCheckIn";
import Onboarding from "@/pages/Onboarding";
import ModeSelect from "@/pages/ModeSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile, clearProfile } from "@/lib/userProfile";
import { LogOut, Plane, MessageSquareText } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";

type CategoryFilter = "all" | "food" | "help" | "shopping" | "social";
type AppView =
  | "onboarding"
  | "mode-select"
  | "home"
  | "scenario"
  | "airport-checkin"
  | "airport-checkin-aac";

const Index = () => {
  const [view, setView] = useState<AppView>("onboarding");
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>("all");

  useEffect(() => {
    const profile = getProfile();
    if (profile) setView("mode-select");
  }, []);

  const handleLogout = () => {
    clearProfile();
    setView("onboarding");
  };

  const filteredScenarios =
    filter === "all" ? scenarios : scenarios.filter((s) => s.category === filter);

  if (view === "onboarding") {
    return <Onboarding onComplete={() => setView("mode-select")} />;
  }

  if (view === "mode-select") {
    return (
      <ModeSelect
        onSelectSingle={() => setView("home")}
        onSelectMulti={() => {}}
        onBack={handleLogout}
      />
    );
  }

  if (view === "airport-checkin") {
    return (
      <div className="min-h-screen bg-background py-6">
        <AirportCheckIn onBack={() => setView("home")} mode="voice" />
      </div>
    );
  }

  if (view === "airport-checkin-aac") {
    return (
      <div className="min-h-screen bg-background py-6">
        <AirportCheckIn onBack={() => setView("home")} mode="aac" />
      </div>
    );
  }

  if (view === "scenario" && activeScenario) {
    return (
      <div className="min-h-screen bg-background py-8">
        <ScenarioPlayer
          scenario={activeScenario}
          onBack={() => {
            setActiveScenario(null);
            setView("home");
          }}
        />
      </div>
    );
  }

  const profile = getProfile();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden bg-primary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> {profile?.name}
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Practice Talking,{" "}
                <span className="text-primary">Build Confidence</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-lg">
                Interactive scenarios to help you practise everyday communication
                skills — at your own pace, in a safe space.
              </p>
              <Button
                size="xl"
                variant="accent"
                onClick={() => setView("airport-checkin")}
              >
                Try Airport Check-in ✈️
              </Button>
            </motion.div>
            <motion.div
              className="flex-shrink-0 w-64 md:w-80"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img
                src={heroIllustration}
                alt="People communicating together using assistive technology"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Featured: Airport Check-in */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Airport Check-in Practice</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className="border-2 border-primary/20 hover:border-primary cursor-pointer transition-colors"
              onClick={() => setView("airport-checkin")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
                  <Plane className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Voice Mode</h3>
                  <p className="text-muted-foreground">
                    Speak to the mascot to complete airport check-in using your voice.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-2 border-accent/30 hover:border-accent cursor-pointer transition-colors"
              onClick={() => setView("airport-checkin-aac")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-3xl flex-shrink-0">
                  <MessageSquareText className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">AAC Mode</h3>
                  <p className="text-muted-foreground">
                    Practice check-in with AAC responses using phrase buttons or typed messages.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Text-based Scenarios */}
      <main id="scenarios" className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Text Scenarios
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Pick a situation you'd like to practise with text-based choices.
          </p>

          <div
            className="flex flex-wrap gap-2 mb-8"
            role="tablist"
            aria-label="Filter scenarios by category"
          >
            <Button
              variant={filter === "all" ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilter("all")}
              role="tab"
              aria-selected={filter === "all"}
            >
              All
            </Button>
            {(Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>).map((key) => (
              <Button
                key={key}
                variant={filter === key ? "default" : "secondary"}
                size="sm"
                onClick={() => setFilter(key)}
                role="tab"
                aria-selected={filter === key}
              >
                {categoryInfo[key].label}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredScenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onClick={() => {
                  setActiveScenario(scenario);
                  setView("scenario");
                }}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border py-8 text-center">
        <p className="text-sm text-muted-foreground">
          CommPractice — Empowering communication through practice.
          <br />
          Serving people with disabilities since 2006.
        </p>
      </footer>
    </div>
  );
};

export default Index;
