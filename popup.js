const toggleBtn = document.getElementById("toggleBtn");

function updateButton(enabled) {
  toggleBtn.textContent = enabled ? "Engellemeyi Kapat" : "Engellemeyi Aç";
}

chrome.storage.local.get("enabled", (res) => {
  const enabled = typeof res.enabled === "boolean" ? res.enabled : true;
  updateButton(enabled);
});

toggleBtn.addEventListener("click", () => {
  chrome.storage.local.get("enabled", (res) => {
    const current = typeof res.enabled === "boolean" ? res.enabled : true;
    const newValue = !current;
    chrome.storage.local.set({ enabled: newValue }, () => {
      updateButton(newValue);
      // Sayfayı yenilemek için aktif sekmeyi bulup reload et
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
});

