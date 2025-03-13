let visitedWebsites = [];

// Load saved websites from Chrome storage on startup
chrome.storage.local.get("visitedWebsites", (data) => {
    if (data.visitedWebsites) {
        visitedWebsites = data.visitedWebsites;
        console.log("Loaded visited websites from storage:", visitedWebsites);
    }
});

// Function to add a website to the array
function addVisitedWebsite(url) {
    if (!visitedWebsites.includes(url)) {
        visitedWebsites.push(url);
        console.log(`Website added: ${url}`);

        // Save updated array to Chrome storage
        chrome.storage.local.set({ visitedWebsites });
    }
}

// Function to get the total number of visited websites
function getTotalWebsiteCount() {
    return visitedWebsites.length;
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "pageLoad" && request.url) {
        addVisitedWebsite(request.url);
    } else if (request.message === "getTotalWebsiteCount") {
        sendResponse({ total: getTotalWebsiteCount() });
    }
});