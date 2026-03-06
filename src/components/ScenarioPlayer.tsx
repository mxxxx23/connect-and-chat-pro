import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Scenario, CommunicationOption } from "@/data/scenarios";
import { ArrowLeft, ArrowRight, RotateCcw, Star, MessageCircle } from "lucide-react";

interface ScenarioPlayerProps {
  scenario: Scenario;
  onBack: () => void;
}

const ScenarioPlayer = ({ scenario, onBack }: ScenarioPlayerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<CommunicationOption | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const step = scenario.steps[currentStep];
  const progress = ((completedSteps.length) / scenario.steps.length) * 100;

  const handleSelect = (option: CommunicationOption) => {
    setSelectedOption(option);
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }
  };

  const handleNext = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setCompletedSteps([]);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">
          Amazing Work!
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          You completed <strong>"{scenario.title}"</strong>! Every practice session helps you build confidence for real-life conversations.
        </p>
        <div className="flex items-center justify-center gap-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
            >
              <Star className="w-8 h-8 fill-accent text-accent" />
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="accent" size="lg" onClick={handleRestart}>
            <RotateCcw className="w-5 h-5" />
            Try Again
          </Button>
          <Button variant="outline" size="lg" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
            More Scenarios
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} aria-label="Go back">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-foreground">
            {scenario.icon} {scenario.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {scenario.steps.length}
          </p>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="mb-8 h-3" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {/* Context */}
          <p className="text-muted-foreground text-base mb-4 italic">
            {step.context}
          </p>

          {/* Speaker bubble */}
          <Card className="border-2 border-primary/20 bg-primary/5 mb-8">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  {step.speakerName && (
                    <p className="text-sm font-semibold text-primary mb-1">
                      {step.speakerName} ({step.speakerRole})
                    </p>
                  )}
                  <p className="text-lg font-medium text-foreground">
                    "{step.prompt}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              How would you respond?
            </p>
            {step.options.map((option) => {
              const isSelected = selectedOption?.id === option.id;
              return (
                <motion.div key={option.id} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="aac"
                    className={`w-full justify-start text-left ${
                      isSelected
                        ? option.isCorrect
                          ? "border-success bg-success/10 ring-2 ring-success"
                          : "border-accent bg-accent/10 ring-2 ring-accent"
                        : ""
                    }`}
                    onClick={() => handleSelect(option)}
                    disabled={!!selectedOption}
                  >
                    <span className="text-2xl mr-3 flex-shrink-0">{option.icon}</span>
                    <span className="flex-1">{option.label}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card
                  className={`border-2 mb-6 ${
                    selectedOption.isCorrect
                      ? "border-success/30 bg-success/5"
                      : "border-accent/30 bg-accent/5"
                  }`}
                >
                  <CardContent className="p-5">
                    <p className="text-base font-medium text-foreground">
                      {selectedOption.isCorrect ? "✅ " : "💡 "}
                      {selectedOption.feedback}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button size="lg" onClick={handleNext}>
                    {currentStep < scenario.steps.length - 1
                      ? "Next Step"
                      : "Finish! 🎉"}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ScenarioPlayer;
