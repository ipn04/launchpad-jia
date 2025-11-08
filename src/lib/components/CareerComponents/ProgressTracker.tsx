import React from 'react';

interface Step {
  id: number;
  label: string;
}

interface ProgressTrackerProps {
  currentStep: number;
  steps?: Step[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  steps: customSteps
}) => {
  const defaultSteps: Step[] = [
    { id: 1, label: 'Career Details & Team Access' },
    { id: 2, label: 'CV Review & Pre-screening' },
    { id: 3, label: 'AI Interview Setup' },
    // { id: 4, label: 'Pipeline Stages' },
    { id: 4, label: 'Review Career' }
  ];

  const steps = customSteps || defaultSteps;

  return (
    <div style={{
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      backgroundColor: 'white'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}>
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;

          return (
            <React.Fragment key={step.id}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                // alignItems: 'center',
                position: 'relative',
                zIndex: 2
              }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#16A34A' : isCurrent ? 'white' : isUpcoming ? '#E5E7EB' : '#E5E7EB',
                    border: isCurrent ? '2px solid #000000' : isCompleted ? '2px solid #16A34A' : '2px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                    marginBottom: '8px'
                  }}
                >
                  {isCompleted && (
                    <i className="la la-check" style={{
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 'bold'
                    }}></i>
                  )}
                  {isCurrent && (
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#000000'
                    }}></div>
                  )}
                </div>

                <div style={{
                  fontSize: 13,
                  color: isCompleted ? '#000000' : isCurrent ? '#000000' : isUpcoming ? '#D1D5DB' : '#D1D5DB',
                  fontWeight: isCompleted || isCurrent ? 500 : 400,
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
                  height: 2,
                  background: isCompleted
                    ? 'linear-gradient(to right, red 0%, #16A34A 100%, #E5E7EB 100%, #E5E7EB 100%)'
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