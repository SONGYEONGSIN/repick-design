import type { Metadata } from "next";
import RenewalDeskClient from "./RenewalDeskClient";

export const metadata: Metadata = {
  title: "Tenure — 갱신 데스크",
  description:
    "B2B 구독 갱신 데스크. 좌측 레일에서 갱신 건을 고르고, 상세 페인의 시점 스크러버로 계약 12개월을 되짚어 사용량·지원·가격 이력을 그 시점 기준으로 다시 읽습니다.",
};

export default function Page() {
  return <RenewalDeskClient />;
}
