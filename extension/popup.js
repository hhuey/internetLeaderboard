document.addEventListener("DOMContentLoaded", () => {
  const authContainer = document.getElementById("auth-container");
  const userContainer = document.getElementById("user-container");
  const statusMsg = document.getElementById("status-msg");

  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const usernameSpan = document.getElementById("username");
  const visitCountSpan = document.getElementById("unique-website-count");

  const API_URL = "http://localhost:3000"; // Change this when deploying

  // Check if user is already logged in
  chrome.storage.local.get(["authToken"], async (result) => {
    if (result.authToken) {
      showUserUI(result.authToken);
    } else {
      displayUniqueWebsiteCount(); // Show local count if user is not logged in
    }
  });

  // Handle Login
  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
      chrome.storage.local.set({ authToken: data.token }, () => {
        showUserUI(data.token);
      });
    } else {
      statusMsg.textContent = "Login failed. Check credentials.";
    }
  });

  // Handle Signup
  signupBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const response = await fetch(`${API_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
      chrome.storage.local.set({ authToken: data.token }, () => {
        showUserUI(data.token);
      });
    } else {
      statusMsg.textContent = "Signup failed. Try again.";
    }
  });

  // Handle Logout
  logoutBtn.addEventListener("click", () => {
    chrome.storage.local.remove("authToken", () => {
      authContainer.classList.remove("hidden");
      userContainer.classList.add("hidden");
      displayUniqueWebsiteCount(); // Show local count again
    });
  });

  // Show User UI and Fetch Backend Data
  async function showUserUI(token) {
    authContainer.classList.add("hidden");
    userContainer.classList.remove("hidden");

    // Fetch user details and backend visit count
    const response = await fetch(`${API_URL}/api/user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.username) {
      usernameSpan.textContent = data.username;
      visitCountSpan.textContent = data.uniqueVisits || 0;
    }
  }

  // Function to display the number of unique websites (from local storage)
  function displayUniqueWebsiteCount() {
    chrome.runtime.sendMessage({ message: "getTotalWebsiteCount" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error communicating with background script:", chrome.runtime.lastError);
        return;
      }
      visitCountSpan.textContent = response.total || 0;
    });
  }
});
