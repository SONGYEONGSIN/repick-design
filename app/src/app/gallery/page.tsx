import { permanentRedirect } from "next/navigation";

/**
 * Specimen 갤러리는 2026-08-27 에 `/` 로 옮겨졌다 — 사이트의 정문이 사이트 자신이어야 하고,
 * 그전까지 `/` 는 카탈로그의 한 작품(Attune)이 차지하고 있었다. 그 작품은 `/v18` 로 내려갔다.
 * 이 라우트는 기존 링크(scene·motion-pilot 의 "Specimen" 내비, 외부 공유 주소)를 위해 남는다.
 * 상세는 `/gallery/[id]` 로 그대로 유지되므로 이 파일만 리다이렉트한다.
 */
export default function GalleryIndexRedirect(): never {
  permanentRedirect("/");
}
