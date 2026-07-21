# Expo Web 서빙 절차 (S0 실현성 증거)

react-native-web PoC 화면(`native/App.tsx` → `MatchList`)이 브라우저에 실제로 렌더됨을 재현하는 절차. 포트는 **8091**로 고정한다(Next.js dev 서버 3100과 충돌 회피).

## 1. 정적 웹 export (우선 시도 — 가장 결정론적)

```bash
cd native && npx expo export --platform web --output-dir dist 2>&1 | tail -8
```

**성공 기준**: `dist/`에 `index.html`, `favicon.ico`, `metadata.json`, `_expo/static/js/web/*.js` 생성. Metro가 `Web Bundled` 로그와 함께 종료.

실패 시(예: 웹 번들러 설정 문제) → 2b(dev 서버 폴백)로 전환.

## 2. 정적 서빙 (8091)

```bash
cd native && (npx serve dist -l 8091 &)
```

준비될 때까지 폴링(최대 20초):

```bash
for i in $(seq 1 20); do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8091/)
  [ "$code" = "200" ] && echo "READY ($i)" && break
  sleep 1
done
```

**성공 기준**: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8091/` → `200`.

### 2b. 폴백 — dev 서버 (export 실패 시)

```bash
cd native && (npx expo start --web --port 8091 &)
```

Metro 컴파일 완료까지 대기 후 동일하게 `curl ... http://localhost:8091/` → `200` 확인.

## 3. 렌더 실증 (Playwright)

빈 화면이 아니라 react-native-web이 실제 컴포넌트 트리를 렌더했는지 텍스트 레벨로 확인한다. 저장소 루트의 Playwright를 재사용(native 자체에 playwright 설치 불필요):

```bash
node -e "
const {chromium}=require('/Users/yss/개발/build/repick-design/node_modules/playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage();
  await p.goto('http://localhost:8091/',{waitUntil:'load'});
  await p.waitForTimeout(1500);
  const t=await p.evaluate(()=>document.body.innerText);
  await p.screenshot({path:'native/dist-render.png'});
  await b.close();
  console.log('TEXT_HAS_HEADING:', t.includes('AI 매칭 결과'), '| TEXT_HAS_CARD:', t.includes('Contax'));
})()
"
```

**성공 기준**: `TEXT_HAS_HEADING: true | TEXT_HAS_CARD: true`. 스크린샷은 `native/dist-render.png`(gitignore 처리, 커밋 대상 아님 — 검증용 임시 산출물).

`false`가 하나라도 나오면 **react-native-web이 이 환경에서 렌더되지 않는다는 신호** — spike 실패로 취급하고 억지로 통과시키지 않는다(export/dev 서버 콘솔 로그, 브라우저 console 에러 확인 필요).

## 4. 정리

검증 종료 후 백그라운드 서버 프로세스를 반드시 종료한다:

```bash
lsof -ti :8091 | xargs -r kill
```

## 참고

- `dist/`, `dist-render.png`는 `.gitignore` 처리 — 재현 절차(본 문서)만 커밋 대상.
- Task 4(iframe 임베드)는 이 문서의 8091 URL을 그대로 소비한다.
