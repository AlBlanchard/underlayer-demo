import type { PropsWithChildren, ReactNode } from 'react';

interface DemoPanelProps extends PropsWithChildren {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
}

const DemoPanel = ({
  eyebrow,
  title,
  description,
  className = '',
  children,
}: DemoPanelProps) => {
  return (
    <section className={`demoPanel ${className}`}>
      {eyebrow && (
        <span className="demoPanel__eyebrow">
          {eyebrow}
        </span>
      )}

      <h1 className="demoPanel__title">
        {title}
      </h1>

      {description && (
        <div className="demoPanel__description">
          {description}
        </div>
      )}

      {children}
    </section>
  );
};

export default DemoPanel;