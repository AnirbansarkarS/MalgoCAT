import { motion } from "framer-motion";
import { BarChart3, Trophy, Sparkles, Database, Zap } from "lucide-react";

const cards = [
  {
    title: "Dataset Stats",
    content: "1,247 rows • 23 features",
    icon: Database,
    delay: 0,
    className: "animate-float",
  },
  {
    title: "Top Model",
    content: "XGBoost • 94.2%",
    icon: Trophy,
    delay: 0.2,
    className: "animate-float-delayed",
  },
  {
    title: "Feature Importance",
    content: "age, income, score",
    icon: BarChart3,
    delay: 0.4,
    className: "animate-float-slow",
  },
];

export function FloatingCards() {
  return (
    <div className="relative h-[400px] w-full max-w-lg mx-auto">
      {/* Glowing orb background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
      
      {/* Cards */}
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: card.delay }}
          className={`absolute floating-card ${card.className}`}
          style={{
            top: `${20 + index * 25}%`,
            left: `${10 + index * 20}%`,
            zIndex: 10 - index,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <card.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{card.title}</p>
              <p className="text-sm font-medium">{card.content}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-10 right-10 flex items-center gap-2 text-sm text-primary"
      >
        <Sparkles className="w-4 h-4" />
        <span>AI-powered analysis</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute top-10 right-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs"
      >
        <Zap className="w-3 h-3" />
        <span>Instant results</span>
      </motion.div>
    </div>
  );
}
