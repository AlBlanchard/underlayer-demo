import ViewerProgress from './ViewerProgress';

const PreparingContent = () => {
  return (
    <section className="preparingContent">
      <ViewerProgress currentStep={2} />

      <div className="preparingContent__content">
        <div
          className="preparingContent__loader"
          aria-hidden="true"
        />

        <h1 className="preparingContent__title">
          Preparing your content
        </h1>

        <p
          className="preparingContent__description"
          role="status"
        >
          Underlayer is generating a protected
          version specifically for you.
        </p>
      </div>
    </section>
  );
};

export default PreparingContent;