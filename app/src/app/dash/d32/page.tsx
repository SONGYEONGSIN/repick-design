import type { Metadata } from "next";
import { PortfolioProvider } from "./context";
import { Shell } from "./shell";
import KpiRow from "./kpi-row";
import PortfolioChartCard from "./portfolio-chart";
import AssetDetailPanel from "./asset-detail-panel";
import HoldingsTable from "./holdings-table";
import AllocationDonut from "./allocation-donut";
import RecentTransactions from "./recent-transactions";

export const metadata: Metadata = {
  title: "Meridian — 포트폴리오 개요",
  description: "디지털 자산 보유 현황, 가격 추이, 거래 내역을 한눈에 확인하는 포트폴리오 대시보드",
};

export default function Page() {
  return (
    <PortfolioProvider defaultAssetId="portfolio">
      <Shell>
        <div className="mx-auto flex w-full max-w-[1600px] flex-col">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">포트폴리오 개요</h1>
            <p className="mt-1 text-sm text-zinc-500">보유 자산 현황과 시장 동향을 한눈에 확인하세요.</p>
          </div>

          <div className="grid grid-cols-12 gap-4 sm:gap-5">
            <KpiRow />
            <PortfolioChartCard />
            <AssetDetailPanel />
            <HoldingsTable />
            <AllocationDonut />
            <RecentTransactions />
          </div>
        </div>
      </Shell>
    </PortfolioProvider>
  );
}
