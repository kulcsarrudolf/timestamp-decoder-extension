// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertUnixTime",
    title: "Convert Unix timestamp",
    contexts: ["selection"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertUnixTime") {
    const selectedText = info.selectionText.trim();

    // Try to parse as Unix timestamp (in seconds or milliseconds)
    let timestamp = parseInt(selectedText, 10);

    if (isNaN(timestamp)) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showPopup,
        args: ["Error", "The selected text is not a valid Unix timestamp."],
      });
      return;
    }

    // If timestamp looks like it's in seconds (< 10000000000), convert to milliseconds
    if (timestamp < 10000000000) {
      timestamp = timestamp * 1000;
    }

    // Convert to date
    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showPopup,
        args: ["Error", "Could not convert the timestamp to a valid date."],
      });
      return;
    }

    // Format the date
    const humanReadable = date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });

    const isoFormat = date.toISOString();

    // Show popup with the result
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showPopup,
      args: [humanReadable, isoFormat],
    });
  }
});

function showPopup(mainText, subText) {
  // Remove any existing popup
  const existing = document.getElementById("unix-time-popup");
  if (existing) {
    existing.remove();
  }

  // Get selection position
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Create popup
  const popup = document.createElement("div");
  popup.id = "unix-time-popup";
  popup.className = "unix-time-popup";

  const mainDiv = document.createElement("div");
  mainDiv.className = "unix-time-main";
  mainDiv.textContent = mainText;

  const subDiv = document.createElement("div");
  subDiv.className = "unix-time-sub";
  subDiv.textContent = subText;

  const copyBtn = document.createElement("button");
  copyBtn.className = "unix-time-copy";
  copyBtn.textContent = "Copy";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(mainText);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  };

  popup.appendChild(mainDiv);
  popup.appendChild(subDiv);
  popup.appendChild(copyBtn);

  document.body.appendChild(popup);

  // Position popup near selection
  const scrollY = window.scrollY || window.pageYOffset;
  const scrollX = window.scrollX || window.pageXOffset;

  popup.style.top = rect.bottom + scrollY + 10 + "px";
  popup.style.left = rect.left + scrollX + "px";

  // Auto-hide after 10 seconds or on click outside
  const closePopup = () => {
    if (popup.parentNode) {
      popup.remove();
    }
  };

  setTimeout(closePopup, 10000);

  document.addEventListener("click", function handler(e) {
    if (!popup.contains(e.target)) {
      closePopup();
      document.removeEventListener("click", handler);
    }
  });
}
