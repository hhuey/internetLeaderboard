// Function to display the number of unique websites
function displayUniqueWebsiteCount() {
  // Send a message to the background script to get the total website count
  chrome.runtime.sendMessage({ message: "getTotalWebsiteCount" }, (response) => {
      if (chrome.runtime.lastError) {
          console.error("Error communicating with background script:", chrome.runtime.lastError);
          return;
      }

      const uniqueWebsiteCount = response.total || 0;
      const uniqueWebsiteCountElement = document.getElementById("unique-website-count");
      uniqueWebsiteCountElement.textContent = uniqueWebsiteCount;
  });
}
  
  // Call the function to display the count when the popup is opened
  displayUniqueWebsiteCount();

  ///hello there i am trying to figure out how gitub works
  
  