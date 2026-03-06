import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scenario, categoryInfo, difficultyInfo } from "@/data/scenarios";

interface ScenarioCardProps {
  scenario: Scenario;
  onClick: () => void;
  index: number;
}

const ScenarioCard = ({ scenario, onClick, index }: ScenarioCardProps) => {
  const category = categoryInfo[scenario.category];
  const difficulty = difficultyInfo[scenario.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card
        className={`cursor-pointer border-2 ${category.borderClass} ${category.bgClass} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`Start scenario: ${scenario.title}`}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl" role="img" aria-label={scenario.title}>
              {scenario.icon}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl font-bold text-foreground mb-1">
                {scenario.title}
              </h3>
              <p className="text-muted-foreground text-base mb-3">
                {scenario.description}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-sm">
                  {category.label}
                </Badge>
                <Badge variant="outline" className={`text-sm ${difficulty.color}`}>
                  {difficulty.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {scenario.steps.length} steps
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScenarioCard;
