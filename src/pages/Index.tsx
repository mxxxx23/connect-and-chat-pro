import { useState } from "react";
import { motion } from "framer-motion";
import { scenarios, Scenario, categoryInfo } from "@/data/scenarios";
import ScenarioCard from "@/components/ScenarioCard";
import ScenarioPlayer from "@/components/ScenarioPlayer";
import { Button } from "@/components/ui/button";
import heroIllustration from "@/assets/hero-illustration.png";

type CategoryFilter = "all" | "food" | "help" | "shopping" | "social";

const Index = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const filteredScenarios =
    filter === "all"
      ? scenarios
      : scenarios.filter((s) => s.category === filter);

  if (activeScenario) {
    return (
      <div className="min-h-screen bg-background py-8">
        <ScenarioPlayer
          scenario={activeScenario}
          onBack={() => setActiveScenario(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden bg-primary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
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
                onClick={() => {
                  document
                    .getElementById("scenarios")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start Practising 🚀
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

      {/* Scenarios */}
      <main id="scenarios" className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Choose a Scenario
          </h2>
          <p className="text-muted-foreground text-lg mb-6">
            Pick a situation you'd like to practise. Each scenario guides you
            step-by-step.
          </p>

          {/* Category Filter */}
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
            {(Object.keys(categoryInfo) as Array<keyof typeof categoryInfo>).map(
              (key) => (
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
              )
            )}
          </div>

          {/* Scenario Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredScenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onClick={() => setActiveScenario(scenario)}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
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
