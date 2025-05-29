let enabled = true;
const YT_AD_SPEED = 16;

chrome.storage.local.get("enabled", (res) => {
  enabled = typeof res.enabled === "boolean" ? res.enabled : true;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
  }
});

// Çok kapsamlı reklam CSS seçicileri
const cssSelectors = [
  // EasyList, AdGuard, uAssets örnekleri
  '.ad-container', '.adsbox', '.advertisement', '[id^="ad_"]', '[class*="ad-slot"]',
  '[class*="adsbygoogle"]', 'iframe[src*="ads"]', 'iframe[src*="doubleclick"]',
  'iframe[src*="googlesyndication"]', 'iframe[src*="adservice"]', 'iframe[src*="adnetwork"]',
  'div[class*="google-ad"]', 'div[id*="google_ads"]', 'div[id^="google_ads"]',
  'div[class*="ad-banner"]', 'div[class*="ad-break"]', 'div[class*="ad--"]', 'div[class*="ad_"]',
  'ins.adsbygoogle', 'div[data-ad-slot]', 'div[data-google-query-id]',
  // YouTube reklamları ve overlaylar
  '.ytp-ad-module', '.ytp-ad-overlay-container', '.ytp-ad-player-overlay',
  '.ytp-ad-image-overlay', '.ytp-ad-text', '.video-ads.ytp-ad-module',
  '.ytp-ad-progress-list', '.ytp-ad-player-overlay-instream-info',
  '.ytp-ad-preview-container', '.ad-showing',
  // Google reklam ağları iframe'leri
  'iframe[src*="googleads"]', 'iframe[src*="g.doubleclick.net"]',
  // Shorts ve interstitial reklamlar için ek
  'ytd-companion-slot-renderer', 'ytd-promoted-sparkles-web-renderer',
  '#shorts-ad-container', '#shorts-ad', 'ytd-display-ad-renderer',
  '.ytp-ad-player-overlay-instream-info'
];

function hideAds() {
  if (!enabled) return;

  cssSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.offsetParent !== null) {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        // opsiyonel: el.remove(); // Elementi tamamen DOM'dan kaldırmak için
      }
    });
  });
}

let video = null;

function findVideo() {
  const v = document.querySelector("video");
  if (v && v !== video) {
    video = v;
  }
}

function controlYouTubeAdSpeed() {
  if (!enabled || !video) return;

  const adShowing = document.querySelector(".ad-showing") || document.querySelector("ytd-companion-slot-renderer");

  if (adShowing) {
    if (video.playbackRate !== YT_AD_SPEED) {
      video.playbackRate = YT_AD_SPEED;
      // console.log("Reklam oynuyor, hız 16x yapıldı.");
    }
  } else {
    if (video.playbackRate !== 1) {
      video.playbackRate = 1;
      // console.log("Reklam bitti, hız 1x yapıldı.");
    }
  }
}

setInterval(() => {
  if (!enabled) return;

  findVideo();
  hideAds();
  controlYouTubeAdSpeed();
}, 300);

