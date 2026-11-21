import React from 'react';

/** Standard page header used by every app view. */
export default function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="tw-label mb-1">{eyebrow}</div>}
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-fg">{title}</h1>
        {description && <p className="mt-0.5 max-w-2xl text-[13px] text-fg-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
