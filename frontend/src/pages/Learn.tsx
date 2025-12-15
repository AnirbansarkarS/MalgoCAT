import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trees, LineChart, Brain, Layers, GitBranch, 
  ChevronRight, Check, X, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const learnCards = [
  {
    id: "random-forest",
    icon: Trees,
    title: "Why Random Forest Works Well on Tabular Data",
    summary: "Ensemble of decision trees with bagging and feature randomness",
    content: {
      explanation: "Random Forest creates hundreds of decision trees, each trained on a random subset of data and features. This diversity makes it robust to noise, handles non-linear relationships naturally, and provides built-in feature importance.",
      strengths: [
        "Handles mixed feature types without preprocessing",
        "Robust to outliers and missing values",
        "Low risk of overfitting with proper parameters",
        "Provides feature importance rankings",
      ],
      weaknesses: [
        "Slower inference for real-time applications",
        "Can't extrapolate beyond training data range",
        "Large model size in production",
      ],
      bestFor: ["Tabular data with mixed types", "When interpretability matters", "Quick baseline models"],
    },
  },
  {
    id: "linear-beats-deep",
    icon: LineChart,
    title: "When Linear Models Beat Deep Learning",
    summary: "Understanding the bias-variance tradeoff in practice",
    content: {
      explanation: "Linear models like Logistic Regression and Ridge often outperform neural networks on structured tabular data with limited samples. Deep learning excels with unstructured data (images, text) and massive datasets, but introduces unnecessary complexity for many ML problems.",
      strengths: [
        "Interpretable coefficients",
        "Fast training and inference",
        "Works well with limited data",
        "Less prone to overfitting",
      ],
      weaknesses: [
        "Can't capture complex interactions",
        "Assumes linear decision boundaries",
        "Requires feature engineering",
      ],
      bestFor: ["Small to medium datasets", "Regulated industries", "When speed matters"],
    },
  },
  {
    id: "gradient-boosting",
    icon: Layers,
    title: "Gradient Boosting: XGBoost vs LightGBM vs CatBoost",
    summary: "Choosing the right boosting framework for your needs",
    content: {
      explanation: "All three are gradient boosting implementations but with key differences. XGBoost uses level-wise tree growth, LightGBM uses leaf-wise (faster but can overfit), and CatBoost has built-in categorical handling and ordered boosting to prevent target leakage.",
      strengths: [
        "State-of-the-art tabular performance",
        "Handle feature interactions automatically",
        "Built-in regularization",
        "GPU acceleration available",
      ],
      weaknesses: [
        "Many hyperparameters to tune",
        "Can overfit on small datasets",
        "Sequential training limits parallelism",
      ],
      bestFor: ["Kaggle competitions", "Structured data problems", "When accuracy is priority"],
    },
  },
  {
    id: "neural-networks",
    icon: Brain,
    title: "When to Use Neural Networks on Tabular Data",
    summary: "Modern deep learning approaches for structured data",
    content: {
      explanation: "Recent architectures like TabNet, FT-Transformer, and TabTransformer bring attention mechanisms to tabular data. They can outperform gradient boosting on very large datasets (millions of rows) but require careful tuning and more compute.",
      strengths: [
        "Can learn complex patterns",
        "End-to-end feature learning",
        "Transfer learning potential",
        "Handle embeddings naturally",
      ],
      weaknesses: [
        "Require more data to train",
        "Harder to interpret",
        "More compute intensive",
        "Hyperparameter sensitive",
      ],
      bestFor: ["Very large datasets", "High-cardinality categoricals", "Multi-modal inputs"],
    },
  },
  {
    id: "feature-selection",
    icon: GitBranch,
    title: "Feature Selection Strategies",
    summary: "Reducing dimensionality without losing signal",
    content: {
      explanation: "Feature selection removes irrelevant or redundant features to improve model performance and reduce overfitting. Methods range from simple correlation filters to model-based importance and recursive elimination.",
      strengths: [
        "Reduces training time",
        "Prevents overfitting",
        "Improves interpretability",
        "Can improve accuracy",
      ],
      weaknesses: [
        "Risk of removing useful features",
        "Computationally expensive methods",
        "May need domain knowledge",
      ],
      bestFor: ["High-dimensional datasets", "Before training complex models", "Feature engineering phase"],
    },
  },
];

function LearnCard({ card, isExpanded, onToggle }: { 
  card: typeof learnCards[0]; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "glass-card overflow-hidden cursor-pointer transition-all",
        isExpanded && "glow-border"
      )}
      onClick={onToggle}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <card.icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.summary}</p>
          </div>
          <ChevronRight 
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform flex-shrink-0",
              isExpanded && "rotate-90"
            )}
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border/50"
          >
            <div className="p-6 space-y-6">
              {/* Explanation */}
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.content.explanation}
                </p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {card.content.strengths.map((item) => (
                      <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-success mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <X className="w-4 h-4 text-destructive" />
                    Weaknesses
                  </h4>
                  <ul className="space-y-1">
                    {card.content.weaknesses.map((item) => (
                      <li key={item} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best For */}
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Best For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {card.content.bestFor.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const Learn = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Learn <span className="gradient-text">ML Insights</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Understand when and why different algorithms work best.
              Practical knowledge for real-world ML decisions.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {learnCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <LearnCard
                  card={card}
                  isExpanded={expandedId === card.id}
                  onToggle={() => setExpandedId(expandedId === card.id ? null : card.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Learn;
