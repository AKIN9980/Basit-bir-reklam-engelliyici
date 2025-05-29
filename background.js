let enabled = true;

// Uzantı açıldığında ayarı çek
chrome.storage.local.get("enabled", (res) => {
  enabled = typeof res.enabled === "boolean" ? res.enabled : true;
});

// Ayar değişirse güncelle
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
    // Aktif/pasif değiştiğinde aktif sekmeleri yenile
    chrome.tabs.query({ url: ["*://*.youtube.com/*", "*://*/*"] }, (tabs) => {
      for (const tab of tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => location.reload()
        });
      }
    });
  }
});

