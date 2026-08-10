import DemoPanel from '../../../components/common/DemoPanel';

const AnalysisProgress = () => {
  return (
    <DemoPanel
      eyebrow="Analysing"
      title="Analysing screenshot"
      description={
        <>
          Underlayer is looking for the invisible
          identifier embedded in the image.
        </>
      }
    >
      <div
        className="analysisProgress__loader"
        aria-hidden="true"
      />

      <p
        className="analysisProgress__status"
        role="status"
      >
        Searching for viewer identity...
      </p>
    </DemoPanel>
  );
};

export default AnalysisProgress;