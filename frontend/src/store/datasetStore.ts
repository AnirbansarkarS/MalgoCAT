import { create } from "zustand";

export interface DatasetInfo {
  filename: string;
  size: number;
  rows: number;
  columns: number;
  taskType: "classification" | "regression" | "clustering" | "time-series" | null;
  features: string[];
}

export interface DatasetFingerprint {
  classImbalance: { ratio: number; severity: "low" | "medium" | "high" };
  missingValueRatio: number;
  featureTypes: { numerical: number; categorical: number; text: number };
  correlationStrength: "weak" | "moderate" | "strong";
  sparseness: number;
}

export interface AlgorithmRecommendation {
  name: string;
  confidence: number;
  pros: string[];
  cons: string[];
  performanceRange: { min: number; max: number };
  explanation: string;
  whenItFails: string;
  pythonCode: string;
  isBestFit: boolean;
}

export interface AnalysisConfig {
  goal: "accuracy" | "speed" | "interpretability" | "competition";
  computeBudget: "low" | "medium" | "high";
}

interface DatasetState {
  dataset: DatasetInfo | null;
  fingerprint: DatasetFingerprint | null;
  config: AnalysisConfig;
  recommendations: AlgorithmRecommendation[];
  tips: string[];
  plots: string[];
  currentStep: number;
  isAnalyzing: boolean;

  analysisResults: any | null; // Full analysis object from backend

  setDataset: (dataset: DatasetInfo) => void;
  setFingerprint: (fingerprint: DatasetFingerprint) => void;
  setAnalysisResults: (results: any) => void;
  setPlots: (plots: string[]) => void;
  setConfig: (config: Partial<AnalysisConfig>) => void;
  setRecommendations: (recommendations: AlgorithmRecommendation[]) => void;
  setTips: (tips: string[]) => void;
  setCurrentStep: (step: number) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  reset: () => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  dataset: null,
  fingerprint: null,
  analysisResults: null,
  config: {
    goal: "accuracy",
    computeBudget: "medium",
  },
  recommendations: [],
  tips: [],
  plots: [],
  currentStep: 0,
  isAnalyzing: false,

  setDataset: (dataset) => set({ dataset }),
  setFingerprint: (fingerprint) => set({ fingerprint }),
  setAnalysisResults: (results) => set({ analysisResults: results }),
  setPlots: (plots) => set({ plots }),
  setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
  setRecommendations: (recommendations) => set({ recommendations }),
  setTips: (tips) => set({ tips }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  reset: () =>
    set({
      dataset: null,
      fingerprint: null,
      analysisResults: null,
      config: { goal: "accuracy", computeBudget: "medium" },
      recommendations: [],
      tips: [],
      plots: [],
      currentStep: 0,
      isAnalyzing: false,
    }),
}));
