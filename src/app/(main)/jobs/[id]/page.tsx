'use client';

import React from 'react';

interface JobDetailsProps {
  params: {
    id: string;
  };
}

export default function JobDetailsPage({ params }: JobDetailsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-foreground font-medium p-20 border border-dashed border-border rounded-2xl bg-card">
      <h1 className="text-2xl font-bold mb-4">Job Details for ID: {params.id}</h1>
      <p className="text-foreground/70 text-center">
        Our team is working on this page. You'll soon see detailed information about this job posting.
      </p>
    </div>
  );
}
