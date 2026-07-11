import type { Metadata } from "next";
import { PortfolioProvider } from "./context";
import { Shell } from "./shell";
import AssetRail from "./asset-rail";
import PortfolioChartCard from "./portfolio-chart";
import AssetDetailPanel from "./asset-detail-panel";
import PortfolioSummary from "./portfolio-summary";
import RecentTransactions from "./recent-transactions";

export const metadata: Metadata = {
  title: "Meridian — 포트폴리오 터미널",
  description: "보유 자산과 워치리스트를 선택해 가격 추이, 거래 내역, 상세 지표를 한 화면에서 확인하는 마켓 터미널",
};

export default function Page() {
  return (
    <PortfolioProvider defaultAssetId="portfolio">
      <Shell>
        {/* Visually silent — the selected asset name inside the chart panel
            functions as this page's visible headline (single h1, no skipped levels). */}
        <h1 className="sr-only">Meridian 포트폴리오 터미널</h1>

        <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-4">
          <AssetRail />

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <PortfolioChartCard />
            <RecentTransactions />
          </div>

          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-56 xl:w-72 2xl:w-80">
            <PortfolioSummary />
            <AssetDetailPanel />
          </div>
        </div>
      </Shell>
    </PortfolioProvider>
  );
}
