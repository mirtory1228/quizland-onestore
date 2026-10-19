// 타로 땅따먹기 — 원스토어 웹게임(H5) 진입점. 원스토어 앱 밖(일반 브라우저)에서도 그대로 플레이되도록 SDK 실패는 무시한다.
// SDK v1.1.0 (https://onestore-dev.gitbook.io/dev/tools/web-sdk). SDK는 게임 코드보다 먼저 로드해야 하고 최상위 문서에서 초기화해야 한다.
import { createSDK } from 'https://h5sdk.onestore.net/lib/v1.1.0/onestore-h5-sdk.min.js';

// ── ONEconsole에서 광고 지면(placement)을 발급받은 뒤 채우기. 비어 있으면 광고 없이 동작(부활은 바로 지급) ──
const PLACEMENT_REWARDED = 'xREL8-LDAK-NDZF-AGHF';      // 리워드(광고 보고 이어하기)
const PLACEMENT_INTERSTITIAL = 'xCKD7-GTCZ-QY2D-ERXY';  // 전면(3스테이지마다)

const sdk = createSDK();
let inStore = false;
const QL = () => window.QL;
const rid = () => 'r-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

sdk.on('pause', () => QL() && QL().set('sdk', true));
sdk.on('resume', () => QL() && QL().set('sdk', false));
// 진행(최고기록·타로 도감·언어)은 변경 즉시 localStorage에 저장되므로 exit 시 별도 저장 불필요.

window.AIT = {
  // 스테이지 사이 전면 광고. 노출 동안 게임은 멈춘다.
  interstitial() {
    if (!inStore || !PLACEMENT_INTERSTITIAL || !sdk.ads.isSupported('interstitial')) return;
    QL().set('ad', true);
    sdk.ads.showInterstitialAsync({ placementId: PLACEMENT_INTERSTITIAL }).catch(() => {}).finally(() => QL().set('ad', false));
  },
  // 광고 보고 이어하기. 'rewarded'일 때만 부활. 지면 미설정/미지원이면 광고 없이 바로 부활(기능은 항상 동작).
  rewardedRevive(grant) {
    if (!inStore || !PLACEMENT_REWARDED || !sdk.ads.isSupported('rewarded')) { grant(); return; }
    sdk.ads.showRewardedAsync({ placementId: PLACEMENT_REWARDED, requestId: rid() })
      .then((r) => { if (r && r.status === 'rewarded') grant(); })
      .catch(() => {});
  },
};

try {
  const init = await sdk.initializeAsync();   // 일반 브라우저에서는 err가 들어와 inStore=false
  inStore = !!init && !init.err;
} catch (_) { inStore = false; }

if (inStore) sdk.setLoadingProgress(30);
await import('./game.js');
if (inStore) {
  sdk.setLoadingProgress(100);
  try { await sdk.startGameAsync(); } catch (_) {}
}
