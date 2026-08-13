import DemoPanel from '../../../components/common/DemoPanel';

const EncodingProgress = () => {
  return (
    <DemoPanel
      eyebrow="Protecting content"
      title="Encoding viewer identity"
      description={
        <>
          Underlayer is generating a protected copy
          linked to this viewer.
        </>
      }
    >
      <div
        className="encodingProgress__loader"
        aria-hidden="true"
      />

      <p
        className="encodingProgress__status"
        role="status"
      >
        Embedding invisible identifier...
      </p>
    </DemoPanel>
  );
};

export default EncodingProgress;