interface ViewerProgressProps {
  currentStep: 1 | 2 | 3;
}

const ViewerProgress = ({
  currentStep,
}: ViewerProgressProps) => {
  return (
    <div
      className="viewerProgress"
      aria-label={`Step ${currentStep} of 3`}
    >
      <div className="viewerProgress__header">
        <span>
          Step {currentStep} of 3
        </span>

        <span>
          Underlayer Demo
        </span>
      </div>

      <div
        className="viewerProgress__track"
        aria-hidden="true"
      >
        <span
          className="viewerProgress__value"
          style={{
            width: `${(currentStep / 3) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default ViewerProgress;