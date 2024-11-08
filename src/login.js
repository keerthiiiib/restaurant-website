
// This function will display the login form
export function displayLoginForm() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div id="loginPage">
            <form id="loginForm">
                <h2>Login</h2>
                <input type="text" id="username" placeholder="Username" required />
                <input type="password" id="password" placeholder="Password" required />
                <button type="submit">Login</button>
                <div id="loginMessage"></div>
            </form>
        </div>
    `;

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
}

// This function will handle login logic
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    // Here, you can replace with actual authentication logic (e.g., backend API request)
    if (username === 'user' && password === 'password') {
        loginMessage.textContent = 'Login successful!';
        loginMessage.style.color = '#28a745'; // Green color for success
        showHomePage();
    } else {
        loginMessage.textContent = 'Invalid username or password';
        loginMessage.style.color = '#dc3545'; // Red color for error
    }
}

// This function will show the home page after login is successful
function showHomePage() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <nav>
            <button id="homeBtn">Home</button>
            <button id="contactBtn">Contact</button>
            <button id="reservationsBtn">Reservations</button>
            <button id="accountBtn">My Account</button>
            <button id="logoutBtn">Logout</button>
        </nav>
    `;

    // Logout button action
    document.getElementById('logoutBtn').addEventListener('click', () => {
        window.location.reload();
    });
}
