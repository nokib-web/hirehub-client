import React from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card p-6 rounded-3xl border border-border shadow-sm">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Stat {i}</h3>
            <p className="text-3xl font-black text-primary">--</p>
          </div>
        ))}
      </div>
      <div className="bg-card h-96 rounded-3xl border border-border flex items-center justify-center text-muted-foreground font-medium">
        Overview Chart Placeholder
      </div>
    </div>
  );
}
