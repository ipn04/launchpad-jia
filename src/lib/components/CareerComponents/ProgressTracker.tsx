import React from 'react';

interface Step {
  id: number;
  label: string;
}

interface ProgressTrackerProps {
  currentStep: number;
  maxStep: number;
  steps?: Step[];
  onStepClick?: (stepId: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  maxStep,
  steps: customSteps,
  onStepClick
}) => {
  const defaultSteps: Step[] = [
    { id: 1, label: 'Career Details & Team Access' },
    { id: 2, label: 'CV Review & Pre-screening' },
    { id: 3, label: 'AI Interview Setup' },
    { id: 4, label: 'Review Career' }
  ];

  const steps = customSteps || defaultSteps;

  return (
    <div
      style={{
      borderRadius: '8px',
      marginBottom: '24px',
      backgroundColor: 'white',
      width: '95%',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}>
        {steps.map((step, index) => {
          const isCompleted = step.id < maxStep;
          const isCurrent = step.id === currentStep;
          const isVisiting = step.id === currentStep && step.id < maxStep;

          return (
            <React.Fragment key={step.id}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 2
              }}>
                <div
                  onClick={() => {
                    if (step.id <= maxStep) onStepClick?.(step.id);
                  }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: (isCompleted || isVisiting) ? '#181D27' : isCurrent ? 'white' : 'transparent',
                    border: isCurrent ? '2px solid #000000' : (isCompleted || isVisiting) ? '2px solid #181D27' : '2px solid #D5D7DA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    marginBottom: '8px',
                    cursor: step.id <= maxStep ? 'pointer' : 'default'
                  }}
                >
                   {isCompleted ? (
                      <i
                        className="la la-check"
                        style={{
                          color: "white",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      ></i>
                    ) : (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: isCurrent ? "#000000" : (isCompleted || isVisiting) ? "#181D27" : "#D5D7DA",}}
                      ></div>
                    )}
                </div>

                <div style={{
                  fontSize: 14,
                  marginTop: 4,
                  color: (isCompleted || isVisiting || isCurrent) ? '#000000' : '#717680',
                  fontWeight: (isCompleted || isVisiting || isCurrent) ? 500 : 400,
                  textAlign: 'center',
                  lineHeight: '18px',
                  whiteSpace: 'nowrap',
                  maxWidth: '30px',
                }}>
                  {step.label}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: 4,
                  background: (isCompleted || isVisiting)
                    ? 'linear-gradient(90deg, #9FCAED, #CEB6DA, #EBACC9, #FCCEC0)'
                    : '#E5E7EB',
                  position: 'relative',
                  alignSelf: 'flex-start',
                  marginTop: '11px',
                  minWidth: '90px',
                  transition: 'all 0.3s ease',
                  marginRight: '8px',
                }}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;