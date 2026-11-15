"use client";

import { Card, CardTitle } from "./ui";
import { Tabs } from "./Tabs";
import { ReplenishmentTable } from "./ReplenishmentTable";
import { ReceiptsTable } from "./ReceiptsTable";

export type TaskTab = "queue" | "receipts";

export function TaskPanel({ activeTab, onTabChange }: { activeTab: TaskTab; onTabChange: (t: TaskTab) => void }) {
  return (
    <Card id="task-panel">
      <CardTitle>Fulfillment tasks</CardTitle>
      <div className="mt-3">
        <Tabs
          label="Fulfillment task views"
          active={activeTab}
          onChange={onTabChange}
          tabs={[
            { value: "queue", label: "Replenishment Queue" },
            { value: "receipts", label: "Recent Receipts" },
          ]}
        />
      </div>
      {activeTab === "queue" ? <ReplenishmentTable /> : <ReceiptsTable />}
    </Card>
  );
}
