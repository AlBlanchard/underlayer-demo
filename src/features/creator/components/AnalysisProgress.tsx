const AnalysisProgress = () => {
  return (
    <section className="analysisProgress">
      <span className="analysisProgress__step">
        Analysing
      </span>

      <h1 className="analysisProgress__title">
        Analysing screenshot
      </h1>

      <p className="analysisProgress__description">
        Underlayer is looking for the invisible
        identifier embedded in the image.
      </p>

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
    </section>
  );
};

export default AnalysisProgress;