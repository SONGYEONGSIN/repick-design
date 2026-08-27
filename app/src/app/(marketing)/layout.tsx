// 랜딩 카탈로그 작품(`/v6`~`/v18`)이 사는 그룹. **제목을 여기서 덮지 않는다** — 2026-08-27
// 이전에는 이 layout 이 사이트 제목을 "Attune" 으로 덮고 있었고, 그래서 그룹 안의 모든 작품이
// 한 작품의 브랜드명을 달고 있었다(`/v16`·`/v17` 은 자체 metadata 가 없어 그대로 상속했다).
// 제목은 루트 layout 의 Specimen 이 기본이고, 개별 작품이 필요하면 자기 page 에서 준다.

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
