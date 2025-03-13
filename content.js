// function to only store the hostname so google.com/search and google.com/home both count as one.
function getDomain(url) {
  const link = document.createElement("a")
  link.href = url
  return link.hostname
}
// Listen for page load events
const currentURL = getDomain(window.location.href);

// Send a message to the background script when the page loads
chrome.runtime.sendMessage({ message: 'pageLoad', url: currentURL });
