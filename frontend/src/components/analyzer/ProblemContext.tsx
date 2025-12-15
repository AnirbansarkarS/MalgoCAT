import { motion } from "framer-motion";
import { Target, Zap, Eye, Trophy, Battery, BatteryMedium, BatteryFull } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDatasetStore } from "@/store/datasetStore";
import { cn } from "@/lib/utils";

const goals = [
  { id: "accuracy", label: "Accuracy", icon: Target, description: "Maximum predictive performance" },
  { id: "speed", label: "Speed", icon: Zap, description: "Fast training and inference" },
  { id: "interpretability", label: "Interpretability", icon: Eye, description: "Explainable predictions" },
  { id: "competition", label: "Competition", icon: Trophy, description: "Kaggle-optimized" },
] as const;

const budgets = [
  { id: "low", label: "Low", icon: Battery, description: "Quick experiments" },
  { id: "medium", label: "Medium", icon: BatteryMedium, description: "Standard training" },
  { id: "high", label: "High", icon: BatteryFull, description: "Full optimization" },
] as const;

export function ProblemContext() {
  const { config, setConfig, setCurrentStep, dataset } = useDatasetStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Define Your Goal</h2>
        <p className="text-muted-foreground">
          Tell us what matters most for your project
        </p>
      </div>

      {/* Goal Selection */}
      <div className="mb-8">
        <label className="text-sm font-medium mb-3 block">Primary Goal</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {goals.map((goal) => (
            <motion.button
              key={goal.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig({ goal: goal.id })}
              className={cn(
                "floating-card text-left transition-all",
                config.goal === goal.id
                  ? "border-primary bg-primary/10"
                  : "hover:border-muted-foreground/30"
              )}
            >
              <goal.icon
                className={cn(
                  "w-5 h-5 mb-2",
                  config.goal === goal.id ? "text-primary" : "text-muted-foreground"
                )}
              />
              <p className="font-medium text-sm">{goal.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Compute Budget */}
      <div className="mb-8">
        <label className="text-sm font-medium mb-3 block">Compute Budget</label>
        <div className="grid grid-cols-3 gap-3">
          {budgets.map((budget) => (
            <motion.button
              key={budget.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig({ computeBudget: budget.id })}
              className={cn(
                "floating-card text-center transition-all",
                config.computeBudget === budget.id
                  ? "border-primary bg-primary/10"
                  : "hover:border-muted-foreground/30"
              )}
            >
              <budget.icon
                className={cn(
                  "w-6 h-6 mx-auto mb-2",
                  config.computeBudget === budget.id ? "text-primary" : "text-muted-foreground"
                )}
              />
              <p className="font-medium text-sm">{budget.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{budget.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dataset Size Indicator */}
      {dataset && (
        <div className="glass-card p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Dataset Size</span>
            <span className="text-sm text-primary">{dataset.rows.toLocaleString()} samples</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((dataset.rows / 10000) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {dataset.rows < 1000
              ? "Small dataset - simple models may suffice"
              : dataset.rows < 10000
              ? "Medium dataset - good for most algorithms"
              : "Large dataset - consider scalable solutions"}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(0)}>
          Back
        </Button>
        <Button onClick={() => setCurrentStep(2)}>
          Analyze Dataset
        </Button>
      </div>
    </motion.div>
  );
}
