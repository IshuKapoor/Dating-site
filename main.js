const API = "server/api.php";

function login() {
    fetch(API, {
        method: "POST",
        body: JSON.stringify({
            action: "login",
            email: email.value,
            password: password.value
        })
    }).then(r => r.json()).then(d => {
        if (d.status === "success") {
            showScreen("dashboardScreen");
            loadProfiles();
        }
    });
}

function loadProfiles() {
    fetch(API + "?action=getProfiles")
        .then(r => r.json())
        .then(users => {
            profilesContainer.innerHTML = "";
            users.forEach(u => {
                profilesContainer.innerHTML += `
        <div class="profile-card">
          <h3>${u.vibe}</h3>
          <p>${u.department}</p>
          <p>${u.break_style}</p>
          <button onclick="selectComfort(${u.id})">Comfort</button>
        </div>`;
            });
        });
}

function selectComfort(id) {
    fetch(API, {
        method: "POST",
        body: JSON.stringify({ action: "comfort", userId: id })
    }).then(r => r.json()).then(d => {
        if (d.match) {
            matchBox.style.display = "block";
            setTimeout(() => showScreen("chatScreen"), 1000);
            loadMessages();
            setInterval(loadMessages, 2000);
        }
    });
}

function sendMessage() {
    fetch(API, {
        method: "POST",
        body: JSON.stringify({ action: "sendMessage", message: messageInput.value })
    });
    messageInput.value = "";
}

function loadMessages() {
    fetch(API + "?action=getMessages")
        .then(r => r.json())
        .then(msgs => {
            messages.innerHTML = "";
            msgs.forEach(m => {
                messages.innerHTML += `<p>${m.sender_id == 1 ? "You" : "Them"}: ${m.message}</p>`;
            });
        });
}

function goAdmin() {
    showScreen("adminScreen");
    loadUsers();
}

/* LOAD USERS */
function loadUsers() {
    fetch(API + "?action=getAllUsers")
        .then(r => r.json())
        .then(users => {
            adminContent.innerHTML = "";
            users.forEach(u => {
                adminContent.innerHTML += `
        <div class="admin-card">
          <b>${u.email}</b><br>
          Dept: ${u.department}<br>
          Vibe: ${u.vibe}<br>
          <button onclick="deleteUser(${u.id})">Remove</button>
        </div>
      `;
            });
        });
}

/* LOAD MATCHES */
function loadMatches() {
    fetch(API + "?action=getAllMatches")
        .then(r => r.json())
        .then(matches => {
            adminContent.innerHTML = "";
            matches.forEach(m => {
                adminContent.innerHTML += `
        <div class="admin-card">
          Match: User ${m.user1} ❤️ User ${m.user2}
        </div>
      `;
            });
        });
}

function deleteUser(id) {
    fetch(API, {
        method: "POST",
        body: JSON.stringify({ action: "deleteUser", userId: id })
    }).then(() => loadUsers());
}