# 타로 땅따먹기 — 원스토어 웹게임(H5) 빌드

- 정적 파일만 있는 웹게임. 빌드 없음. 호스팅 후 **실행 URL**을 ONEconsole(Web 상품 → 기본정보)에 등록한다.
- 헤더(`vercel.json`): CSP `frame-ancestors`에 `*.onestore.co.kr`, `*.onestore.net` 허용 (원스토어가 iframe으로 로드). HTTP 응답 헤더여야 하며 메타태그는 무효.
- `onestore.js`: Web SDK v1.1.0 로드→initializeAsync→게임 로드→startGameAsync. 일반 브라우저에서는 SDK가 err를 반환하므로 그냥 플레이된다.
- 광고: `onestore.js` 상단 `PLACEMENT_REWARDED` / `PLACEMENT_INTERSTITIAL`에 ONEconsole 발급 지면 ID를 넣으면 활성. 비어 있으면 광고 없이 동작(부활은 바로 지급).
- 일시정지: `game.js`의 `window.QL`(holds) — 광고 노출·앱 백그라운드 동안 게임 정지/재개.
- 토스 미니앱 빌드는 `../quizland-miniapp`(별도). 게임 로직 변경 시 두 곳 동기화 필요.
