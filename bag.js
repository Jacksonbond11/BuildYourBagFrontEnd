//VARAIBLES
let sessionUserID;
let bag = document.getElementById("bag");
let suggestions = document.getElementById("suggestions");
let search = document.getElementById("search");
let logoutBtn = document.getElementById("logout");
let profileBtn = document.getElementById("profile");
let profileModal = document.getElementById("profileModal");
//import { isLoggedIn, username } from "./landing.js";

//modal

//FUNCTIONS

window.onload = (event) => {
  console.log("getUserIdFromToken called");
  sessionUserID = getUserIdFromToken();
  console.log(sessionUserID);
};

profileBtn.onclick = function () {
  if (profileModal.style.display === "block") {
    profileModal.style.display = "none";
  } else {
    profileModal.style.display = "block";
  }
};
function searchDisc() {
  let query = search.value;
  fetch(
    `https://good-clouds-move.loca.lt/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch search data");
      }
      return response.json();
    })
    .then((data) => {
      const suggestionsContainer = document.getElementById("suggestions");
      suggestionsContainer.innerHTML = ""; // Clear previous suggestions

      data.sort(function (a, b) {
        if (
          a.name.toLowerCase().substring(0, query.length) ===
          query.toLowerCase()
        ) {
          return -1;
        }
      });
      data.forEach(function (item) {
        var p = document.createElement("p");
        p.textContent = item.name;
        p.addEventListener("click", function () {
          var searchInput = document.getElementById("search");
          searchInput.value = item.name;
          suggestionsContainer.innerHTML = ""; // Clear suggestions
        });
        suggestionsContainer.appendChild(p);
      });

      suggestionsContainer.style.display = "block"; // Display the suggestions
    })
    .catch((error) => {
      console.error("Error fetching search data:", error);
    });
}

function displayDiscInfo(discName) {
  fetch(
    "https://good-clouds-move.loca.lt/discdata?q=" +
      encodeURIComponent(discName),
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      var discInfo = data[0]; // Assuming you're expecting a single disc object
      var discContainer = document.getElementById("disc-data");
      discContainer.innerHTML = ""; // Clear previous disc information
      if (discInfo) {
        // Construct the image URL based on the disc name
        var imageOfDisc =
          "disc-images/" + discInfo.brand + "-" + discName + ".png";

        var discContainer = document.getElementById("disc-data");

        // Create an img element for the disc image
        var imgElement = document.createElement("img");
        imgElement.src = imageOfDisc;
        imgElement.alt = discName;
        imgElement.id = "disc-image";
        discContainer.appendChild(imgElement);
      }

      for (var prop in discInfo) {
        if (
          discInfo.hasOwnProperty(prop) &&
          prop !== "pic" &&
          prop !== "purchase_url"
        ) {
          var propElement = document.createElement("p");
          propElement.textContent =
            prop.charAt(0).toUpperCase() +
            prop.slice(1) +
            ": " +
            discInfo[prop];
          discContainer.appendChild(propElement);
        }
      }

      // Display the disc image
      if (discInfo.pic) {
        var imgElement = document.createElement("img");
        imgElement.src = discInfo.pic;
        imgElement.alt = discInfo.name;
        discContainer.appendChild(imgElement);
      }
      if (discInfo.purchase_url) {
        var propElement = document.createElement("p");
        var linkElement = document.createElement("a");
        linkElement.href = discInfo.purchase_url;
        linkElement.textContent = "Purchase Disc";
        linkElement.style.fontWeight = "bold";
        linkElement.target = "_blank"; // Open link in a new tab

        // Apply custom styles to the link
        linkElement.style.textDecoration = "none"; // Remove underline
        linkElement.style.color = "white"; // Change link color

        propElement.appendChild(linkElement);
        discContainer.appendChild(propElement);
      }
    })
    .catch((error) => {
      console.error("Error fetching disc information:", error);
    });
}

function addToBag(discName) {
  let userId = sessionUserID;
  fetch("https://good-clouds-move.loca.lt/add-disc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: JSON.stringify({ userId: userId, discName: discName }),
  }).then(function (response) {
    if (response.ok) {
      console.log("Added disc to bag");
      refresh();
    } else {
      console.error("Error adding disc to bag");
    }
  });
}

function loadCategoryCount() {
  const userId = sessionUserID; // replace with actual user ID once implemented
  fetch(
    `https://good-clouds-move.loca.lt/get-category-count?userId=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Add the token to the request headers
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      // get the stats element
      const stats = document.getElementById("stats");
      stats.innerHTML = ""; // Clear the stats

      data.forEach((item) => {
        // Create a new list item for each category
        var li = document.createElement("li");
        li.textContent = `${item.category}: ${item.count}`;

        stats.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function loadBag() {
  var userId = sessionUserID; // replace with actual user ID once implemented
  console.log("loadBag called with user id " + userId);
  fetch(`https://good-clouds-move.loca.lt/get-discs?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Add the token to the request headers
    },
  })
    .then((response) => response.json())
    .then((data) => {
      bag.innerHTML = ""; // Clear the bag

      data.forEach((item) => {
        // For each item returned from the server, create a new list item
        var li = document.createElement("li");
        var span = document.createElement("span");
        var removeButton = document.createElement("button");
        li.className = "bag-item";
        span.textContent = item.disc_name;
        removeButton.textContent = "x";
        removeButton.className = "remove-disc";
        li.appendChild(span);
        li.appendChild(removeButton);
        bag.appendChild(li);
        li.addEventListener("click", function () {
          var selectedDisc = this.querySelector("span").textContent;
          displayDiscInfo(selectedDisc);
        });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function loadAverageSpeed() {
  var userId = sessionUserID;
  fetch(`https://good-clouds-move.loca.lt/get-average-speed?userId=${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Add the token to the request headers
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const stats = document.getElementById("stats_AVGSpeed");
      stats.innerHTML = "";

      data.forEach((item) => {
        var li = document.createElement("li");
        li.textContent = `${item.category}: ${item.round}`;
        stats.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function refresh() {
  loadBag(sessionUserID);
  loadCategoryCount(sessionUserID);
  loadAverageSpeed(sessionUserID);
}

//Event Listeners

document.getElementById("add-to-bag").addEventListener("click", function () {
  suggestions.style.border = "none";
  let bagSelect = bag;
  if (bagSelect.innerText === "Your bag is empty...") {
    bagSelect.innerText = "";
  }
  var discName = search.value;
  if (discName !== "") {
    addToBag(discName);

    var li = document.createElement("li");
    var span = document.createElement("span");
    var removeButton = document.createElement("button");
    li.className = "bag-item";
    span.textContent = discName;
    removeButton.textContent = "x";
    removeButton.className = "remove-disc";
    li.appendChild(span);
    li.appendChild(removeButton);
    bag.appendChild(li);
    search.value = "";
    $("#suggestions").empty();

    li.addEventListener("click", function () {
      var selectedDisc = this.querySelector("span").textContent;
      displayDiscInfo(selectedDisc);
    });
  }
});

bag.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-disc")) {
    e.target.parentNode.remove();
  } else if (e.target.tagName === "SPAN") {
    var selectedDisc = e.target.textContent;
    displayDiscInfo(selectedDisc);
  }
});

window.addEventListener("DOMContentLoaded", (event) => {
  refresh();
  // Check if user is logged in
  const token = localStorage.getItem("accessToken");
  if (token) {
    fetch("https://good-clouds-move.loca.lt/userinfo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(function (response) {
        if (response.ok) {
          console.log("Retrieved user info successfully");
          return response.json();
        } else {
          console.log("Error retrieving user info:", response.status);
          throw new Error("Get user info request failed");
        }
      })
      .then(function (data) {
        profileBtn.innerText = data.username;
      })
      .catch(function (error) {
        console.log("Error retrieving user info:", error);
      });
  }
});

bag.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-disc")) {
    var discName = e.target.parentNode.querySelector("span").textContent;
    var userId = sessionUserID; // Replace with actual user ID from session or token once implemented
    fetch(`https://good-clouds-move.loca.lt/remove-disc`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ userId, discName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // If the server reports success, remove the disc from the bag in the UI
          e.target.parentNode.remove();
          refresh();
        } else {
          // If the server reports an error, log it to the console
          console.error("Error removing disc:", data.error);
        }
      });
  } else if (e.target.tagName === "SPAN") {
    var selectedDisc = e.target.textContent;
    displayDiscInfo(selectedDisc);
  }
});

window.addEventListener("load", function () {
  suggestions.style.border = "none";
});

search.addEventListener("input", function () {
  if (this.value === "") {
    suggestions.innerHTML = "";
    suggestions.style.border = "none";
  } else {
    suggestions.style.border = "1px solid #0a7b38"; // Set the border to your desired style
    searchDisc();
  }
});

logoutBtn.onclick = function () {
  localStorage.removeItem("accessToken");
  location.href = "index.html";
};

function getUserIdFromToken() {
  // Retrieve the JWT from local storage
  var token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("No access token found");
    return null;
  }

  try {
    // Decode the JWT to access the payload
    var payload = JSON.parse(atob(token.split(".")[1]));
    var userId = payload.userId;
    if (!userId) {
      console.error("No userId in token payload");
      return null;
    }

    return userId;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
profileBtn.onclick = function () {
  if (profileModal.style.display === "block") {
    profileModal.style.display = "none";
  } else {
    profileModal.style.display = "block";
  }
};

logoutBtn.onclick = function () {
  localStorage.removeItem("accessToken");
  location.href = "index.html";
};
