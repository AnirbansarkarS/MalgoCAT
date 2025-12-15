import { Layout } from "@/components/layout/Layout";
import { StepIndicator } from "@/components/analyzer/StepIndicator";
import { DatasetUpload } from "@/components/analyzer/DatasetUpload";
import { ProblemContext } from "@/components/analyzer/ProblemContext";
import { DatasetFingerprintPanel } from "@/components/analyzer/DatasetFingerprint";
import { AlgorithmRecommendations } from "@/components/analyzer/AlgorithmRecommendations";
import { useDatasetStore } from "@/store/datasetStore";
import { motion } from "framer-motion";

const steps = ["Upload", "Context", "Fingerprint", "Recommendations"];

const Analyzer = () => {
  const { currentStep } = useDatasetStore();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <DatasetUpload />;
      case 1:
        return <ProblemContext />;
      case 2:
        return <DatasetFingerprintPanel />;
      case 3:
        return <AlgorithmRecommendations />;
      default:
        return <DatasetUpload />;
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Dataset Analyzer</h1>
            <p className="text-muted-foreground">
              Follow the steps to get personalized algorithm recommendations
            </p>
          </motion.div>

          <StepIndicator steps={steps} currentStep={currentStep} />
          
          {renderStep()}
        </div>
      </div>
    </Layout>
  );
};

export default Analyzer;
