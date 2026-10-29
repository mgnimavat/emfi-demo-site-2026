"use client";

import { useState } from "react";
import { settlement } from "@/content/settlement";
import { ResearchWorkbench } from "@/components/demos/research-workbench";
import { DemoDisclaimer } from "@/components/demos/demo-disclaimer";
import { OrderEntry } from "@/components/mockups/order-entry";
import { OperatingView } from "@/components/mockups/operating-view";
import { PortfolioView } from "@/components/mockups/portfolio-view";
import { cn } from "@/lib/cn";

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-card">
      <div className="border-b border-line bg-subtle px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
        {title} · demonstration data
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function WorkstationDemo() {
  const tabs = settlement.workstationTabs;
  const [tab, setTab] = useState<(typeof tabs)[number]>(tabs[0]);

  return (
    <div id="workstation-demo" className="rounded-lg border border-line bg-page p-6 md:p-8">
      <h3 className="mt-2 text-2xl font-bold text-ink">Explore the platform</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-secondary">
        {settlement.workstationBody}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[11px] font-bold tracking-[0.12em]",
              tab === item
                ? "border-brand bg-brand text-ink-inverse"
                : "border-line text-ink-muted hover:border-ink hover:text-ink",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Research" ? (
          <Panel title="Research">
            <ResearchWorkbench />
          </Panel>
        ) : null}
        {tab === "Orders" ? <OrderEntry /> : null}
        {tab === "Positions" ? <PortfolioView /> : null}
        {tab === "Settlement" ? <OperatingView /> : null}
        {tab === "Cash" ? (
          <Panel title="Cash">
            <dl className="grid gap-3 sm:grid-cols-3">
              {[
                ["USD", "1,240,000"],
                ["EUR", "860,500"],
                ["GBP", "410,200"],
              ].map(([ccy, value]) => (
                <div key={ccy} className="rounded-md border border-line bg-subtle px-4 py-3">
                  <dt className="font-mono text-[10px] text-ink-muted">{ccy}</dt>
                  <dd className="mt-1 text-lg font-bold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-ink-muted">
              Illustrative balances. No client-specific information.
            </p>
          </Panel>
        ) : null}
        {tab === "Reporting" ? (
          <Panel title="Reporting">
            <ul className="space-y-3 text-sm text-ink">
              <li className="border-b border-line pb-3">Daily settlement status — demonstration</li>
              <li className="border-b border-line pb-3">Holdings / valuations — demonstration</li>
              <li>Corporate actions diary — demonstration</li>
            </ul>
          </Panel>
        ) : null}
      </div>

      <DemoDisclaimer />
    </div>
  );
}
