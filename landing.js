let loginModal = document.getElementById("loginModal");
let signInBtn = document.getElementById("signIn");
let span = document.getElementsByClassName("close")[0];
let signUpSpan = document.getElementsByClassName("close")[1];
let signUpModal = document.getElementById("signUpModal");
let signUpBtn = document.getElementById("signUp");
let signUpBtn2 = document.getElementById("signUp2");
let signUpSubmitBtn = document.getElementById("signUpSubmit");
let loginSubmitBtn = document.getElementById("loginSubmitButton");
let startBuilding = document.getElementById("start-building");
let profileBtn = document.getElementById("profile");
let logoutBtn = document.getElementById("logout");
let username;
let isLoggedIn;

// LOGIN
signInBtn.onclick = function () {
  console.log("signInBtn clicked");
  loginModal.style.display = "block";
};

span.onclick = function () {
  loginModal.style.display = "none";
  console.log("Span clicked");
};

window.onclick = function (event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
};

// SIGN UP
signUpBtn.onclick = function () {
  console.log("signUpBtn clicked");
  signUpModal.style.display = "block";
};

signUpSpan.onclick = function () {
  signUpModal.style.display = "none";
  console.log("Span clicked");
};

signUpBtn2.onclick = function () {
  loginModal.style.display = "none";
  signUpModal.style.display = "block";
};
window.onclick = function (event) {
  if (event.target == signUpModal) {
    signUpModal.style.display = "none";
  }
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
};

loginSubmitBtn.onclick = function () {
  login();
};

//Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  var signUpButton = document.getElementById("signUpSubmit");
  signUpButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    createUserAccount();
  });
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
          return response.json();
        } else {
          console.log("Error retrieving user info:", response.status);
          throw new Error("Get user info request failed");
        }
      })
      .then(function (data) {
        username = "≡  " + data.username;

        // Update login and signup buttons
        profileBtn.innerText = username;
        signInBtn.style.display = "none";
        signUpBtn.style.display = "none";
      })
      .catch(function (error) {
        console.log("Error retrieving user info:", error);
      });

    startBuilding.innerText = "View Your Bag";
  }
});

startBuilding.onclick = function () {
  let jwt = localStorage.getItem("accessToken");
  if (jwt && jwt.trim() !== "") {
    window.location.href = "http://127.0.0.1:5500/bag.html";
  } else {
    loginModal.style.display = "block";
  }
};

function createUserAccount() {
  var email = document.getElementById("emailInput").value;
  var username = document.getElementById("usernameInput").value;
  var password = document.getElementById("passwordInput").value;
  var date = new Date();

  var formData = {
    email: email,
    username: username,
    password: password,
    salt: "", // Add salt value here if applicable
    creation_date: date, // Add creation date value here if applicable
  };

  fetch("https://good-clouds-move.loca.lt/createAccount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Account created successfully!");
        newAccountSuccess();
        return response.json();
        // Redirect or display a success message to the user
      } else {
        console.log("Error creating account:", response.status);
        // Display an error message to the user
      }
    })
    .then(function (data) {
      let jwt = data.accessToken;
      localStorage.setItem("accessToken", jwt);
      console.log("token stored " + jwt);
      console.log(data.username);
      profileBtn.innerText = "≡  " + data.username;
      signUpBtn.style.display = "none";
      signInBtn.style.display = "none";
      signUpModal.style.display = "none";
    })

    .catch(function (error) {
      console.log("Error creating account:", error);
      // Display an error message to the user
    });

  startBuilding.innerText = "View Your Bag";
}

function newAccountSuccess() {
  console.log("called");
  let tempModal = document.getElementsByClassName("modal-content");
  tempModal[0].innerHTML = "Account Created Successfully";
}

function login() {
  console.log("login called");
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;
  var formData = {
    email: email,
    password: password,
  };

  fetch("https://good-clouds-move.loca.lt/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Logged in successfully");
        return response.json();
      } else {
        console.log("Error logging in:", response.status);
        throw new Error("Login request failed");
      }
    })
    .then(function (data) {
      console.log(data);
      let jwt = data.accessToken;
      localStorage.setItem("accessToken", jwt);
      console.log("token stored " + jwt);
      username = data.username;

      profileBtn.innerText = "≡  " + username;
      signUpBtn.style.display = "none";
      signInBtn.style.display = "none";
      loginModal.style.display = "none";
    })
    .catch(function (error) {
      console.log("Error logging in:", error);
    });

  startBuilding.innerText = "View Your Bag";
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
