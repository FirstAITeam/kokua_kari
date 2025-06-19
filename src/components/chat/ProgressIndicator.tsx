
import React from 'react';

interface Step {
  id: string;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  title: string;
  description: string;
}

export const ProgressIndicator = ({ steps, title, description }: ProgressIndicatorProps) => {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-1">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex items-center">
              {/* Circle */}
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 ${
                  step.isActive ? 'bg-green-500 border-green-500' : 
                  step.isCompleted ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-300'
                }`}
              >
                {step.isCompleted && !step.isActive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div className={`w-3 h-3 rounded-full ${step.isActive ? 'bg-white' : 'bg-gray-400'}`} />
                )}
              </div>
              
              {/* Label */}
              <div className="ml-4">
                <p className={`font-medium ${step.isActive ? 'text-black' : 'text-gray-500'}`}>
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
