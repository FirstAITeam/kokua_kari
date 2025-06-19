
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  sublabel?: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: string;
  completedSteps: string[];
  heading: string;
  description: string;
  subDescription: string;
}

export const StepProgress = ({
  steps,
  currentStep,
  completedSteps,
  heading,
  description,
  subDescription
}: StepProgressProps) => {
  return (
    <div className="bg-white rounded-lg border-4 border-[#40414F] p-8 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-6xl font-black mb-8">{heading}</h2>
        <p className="text-xl mb-4">{description}</p>
        <p className="text-xl text-gray-600 whitespace-pre-line">{subDescription}</p>
      </div>

      <div className="relative mt-12 px-4 py-6">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isHighlighted = isCompleted || isCurrent;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="relative flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCompleted ? 'bg-green-500 border-green-500 text-white shadow-md' : 
                    isCurrent ? 'bg-[#1A1F2C] border-[#1A1F2C] text-white shadow-md' : 
                    'bg-gray-100 border-gray-300 text-gray-400'
                  )}>
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" fill={isCurrent ? "#FFFFFF" : "none"} />
                    )}
                  </div>
                  <div className="mt-4 text-xs text-center whitespace-pre-line absolute top-full pt-2 w-32">
                    <div className={cn(
                      "font-bold text-sm",
                      isHighlighted ? "text-[#1A1F2C]" : "text-gray-500"
                    )}>
                      {step.label}
                    </div>
                    {step.sublabel && (
                      <div className={cn(
                        "text-xs whitespace-pre-line mt-1",
                        isHighlighted ? "text-gray-700" : "text-gray-500"
                      )}>
                        {step.sublabel}
                      </div>
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-[3px] mx-4 transition-all duration-300",
                    completedSteps.includes(step.id) 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
