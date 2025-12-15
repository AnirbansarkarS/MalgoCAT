import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { 
  Timer, Target, Zap, Wrench, Code2, Lightbulb,
  ChevronRight, Trophy, TrendingUp, Settings2, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const timeBudgets = [
  { id: "5min", label: "5 min", description: "Quick baseline" },
  { id: "30min", label: "30 min", description: "Standard run" },
  { id: "2hrs", label: "2 hrs", description: "Full optimization" },
];

const metrics = [
  { id: "accuracy", label: "Accuracy" },
  { id: "f1", label: "F1 Score" },
  { id: "auc", label: "AUC-ROC" },
  { id: "rmse", label: "RMSE" },
  { id: "mae", label: "MAE" },
  { id: "log_loss", label: "Log Loss" },
];

const competitionPlan = {
  baseline: {
    model: "LightGBM with default params",
    expectedScore: "0.82",
    time: "~2 minutes",
    code: `import lightgbm as lgb
from sklearn.model_selection import cross_val_score

# Quick baseline - no tuning
lgb_params = {
    'objective': 'binary',
    'metric': 'auc',
    'verbosity': -1,
    'boosting_type': 'gbdt',
    'num_leaves': 31,
    'learning_rate': 0.05,
    'feature_fraction': 0.9
}

dtrain = lgb.Dataset(X_train, label=y_train)
model = lgb.train(lgb_params, dtrain, num_boost_round=100)

# Submit baseline
predictions = model.predict(X_test)`,
  },
  advanced: {
    model: "Stacked Ensemble (XGB + LGB + CatBoost)",
    expectedScore: "0.89",
    time: "~45 minutes",
    code: `from sklearn.ensemble import StackingClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier
from sklearn.linear_model import LogisticRegression

# Define base models
estimators = [
    ('xgb', XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1)),
    ('lgb', LGBMClassifier(n_estimators=200, num_leaves=31)),
    ('cat', CatBoostClassifier(iterations=200, depth=6, verbose=0))
]

# Stack with Logistic Regression
stack = StackingClassifier(
    estimators=estimators,
    final_estimator=LogisticRegression(),
    cv=5,
    n_jobs=-1
)

stack.fit(X_train, y_train)
predictions = stack.predict_proba(X_test)[:, 1]`,
  },
  featureEngineering: [
    "Create target encoding for high-cardinality categoricals",
    "Add rolling statistics for any time-based features",
    "Generate interaction features between top correlated pairs",
    "Apply log transform to skewed numerical features",
    "Create binned versions of continuous variables",
  ],
  hyperparameters: [
    { param: "learning_rate", range: "0.01 - 0.1", tip: "Lower for more data" },
    { param: "num_leaves", range: "20 - 100", tip: "Increase with dataset size" },
    { param: "max_depth", range: "4 - 10", tip: "Deeper for complex patterns" },
    { param: "min_child_samples", range: "20 - 100", tip: "Higher prevents overfitting" },
    { param: "feature_fraction", range: "0.6 - 0.9", tip: "Lower adds regularization" },
  ],
};

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="code-block text-xs overflow-x-auto max-h-64">
        <code>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
}

const Competition = () => {
  const [timeBudget, setTimeBudget] = useState("30min");
  const [metric, setMetric] = useState("auc");
  const [showResults, setShowResults] = useState(false);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm mb-4">
              <Trophy className="w-4 h-4" />
              Competition Mode
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Kaggle-Ready Playbook
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get a competition-optimized strategy with baseline, advanced models, 
              and winning feature engineering tips.
            </p>
          </motion.div>

          {/* Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="glass-card p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Time Budget */}
                <div>
                  <label className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Timer className="w-4 h-4 text-primary" />
                    Time Budget
                  </label>
                  <div className="flex gap-2">
                    {timeBudgets.map((budget) => (
                      <button
                        key={budget.id}
                        onClick={() => setTimeBudget(budget.id)}
                        className={cn(
                          "flex-1 px-4 py-3 rounded-lg border transition-all text-center",
                          timeBudget === budget.id
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-muted-foreground/50 text-muted-foreground"
                        )}
                      >
                        <p className="font-medium">{budget.label}</p>
                        <p className="text-xs mt-1">{budget.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Metric */}
                <div>
                  <label className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Optimization Metric
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {metrics.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMetric(m.id)}
                        className={cn(
                          "px-3 py-2 rounded-lg border transition-all text-sm",
                          metric === m.id
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-muted-foreground/50 text-muted-foreground"
                        )}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={() => setShowResults(true)}
              >
                Generate Competition Plan
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>

          {/* Results */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Baseline Model */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h3 className="font-bold">Fast Baseline</h3>
                    <p className="text-sm text-muted-foreground">Get on the leaderboard quickly</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm text-muted-foreground">Expected Score</p>
                    <p className="text-lg font-bold text-info">{competitionPlan.baseline.expectedScore}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">Model: </span>
                  <span className="text-sm font-medium">{competitionPlan.baseline.model}</span>
                  <span className="text-xs text-muted-foreground ml-4">({competitionPlan.baseline.time})</span>
                </div>
                <CodeBlock code={competitionPlan.baseline.code} />
              </div>

              {/* Advanced Model */}
              <div className="glass-card p-6 glow-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Advanced Ensemble</h3>
                    <p className="text-sm text-muted-foreground">Push for top positions</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm text-muted-foreground">Expected Score</p>
                    <p className="text-lg font-bold text-primary">{competitionPlan.advanced.expectedScore}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-muted-foreground">Model: </span>
                  <span className="text-sm font-medium">{competitionPlan.advanced.model}</span>
                  <span className="text-xs text-muted-foreground ml-4">({competitionPlan.advanced.time})</span>
                </div>
                <CodeBlock code={competitionPlan.advanced.code} />
              </div>

              {/* Feature Engineering */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold">Feature Engineering Ideas</h3>
                    <p className="text-sm text-muted-foreground">Boost your score with better features</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {competitionPlan.featureEngineering.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Lightbulb className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Hyperparameter Hints */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-bold">Hyperparameter Tuning Guide</h3>
                    <p className="text-sm text-muted-foreground">Key parameters to optimize</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-medium">Parameter</th>
                        <th className="text-left py-2 font-medium">Range</th>
                        <th className="text-left py-2 font-medium">Tip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitionPlan.hyperparameters.map((hp) => (
                        <tr key={hp.param} className="border-b border-border/50">
                          <td className="py-2 font-mono text-primary">{hp.param}</td>
                          <td className="py-2 text-muted-foreground">{hp.range}</td>
                          <td className="py-2 text-muted-foreground">{hp.tip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Competition;
