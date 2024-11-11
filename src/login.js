// This function will display the login form
export function displayLoginForm() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div id="loginPage">
            <form id="loginForm">
                <h2>Login</h2>
                <input type="tel" id="contact" placeholder="Contact" required />
                <input type="password" id="password" placeholder="Password" required />
                <button type="submit">Login</button>
                <div id="loginMessage"></div>
                <p>Not a user? <a href="#" id="signUpLink">Sign up here</a></p>
            </form>
        </div>
    `;

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);

    // Event listener for "Sign Up" link
    document.getElementById('signUpLink').addEventListener('click', displaySignUpForm);
}

// This function will handle login logic
export async function handleLogin(event) {
    event.preventDefault();

    const contact = document.getElementById('contact').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('loginMessage');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact: contact,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            loginMessage.textContent = data.message || 'Login successful!';
            loginMessage.style.color = '#28a745'; // Green color for success
            showHomePage();
        } else {
            loginMessage.textContent = data.error || 'Invalid contact or password';
            loginMessage.style.color = '#dc3545'; // Red color for error
        }
    } catch (error) {
        loginMessage.textContent = 'An error occurred while logging in.';
        loginMessage.style.color = '#dc3545'; // Red color for error
    }
}

// This function will display the sign-up form
export function displaySignUpForm() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <div id="signUpPage">
            <form id="signUpForm">
                <h2>Sign Up</h2>
                <input type="text" id="name" placeholder="Name" required />
                <input type="tel" id="contact" placeholder="Contact" required />
                <input type="password" id="newPassword" placeholder="Password" required />
                <input type="password" id="confirmPassword" placeholder="Retype Password" required />
                <button type="submit">Sign Up</button>
                <div id="signUpMessage"></div>
                <p>Already a user? <a href="#" id="loginLink">Log in here</a></p>
            </form>
        </div>
    `;

    const signUpForm = document.getElementById('signUpForm');
    signUpForm.addEventListener('submit', handleSignUp);

    // Event listener for "Log In" link
    document.getElementById('loginLink').addEventListener('click', displayLoginForm);
}

// This function will handle sign-up logic
export async function handleSignUp(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const signUpMessage = document.getElementById('signUpMessage');

    // Simple validation for matching passwords
    if (newPassword === confirmPassword) {
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    contact: contact,
                    password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                signUpMessage.textContent = 'Sign-up successful!';
                signUpMessage.style.color = '#28a745'; // Green color for success
                displayLoginForm(); // Redirect to login form
            } else {
                signUpMessage.textContent = data.error || 'Error during sign-up';
                signUpMessage.style.color = '#dc3545'; // Red color for error
            }
        } catch (error) {
            signUpMessage.textContent = 'An error occurred during sign-up.';
            signUpMessage.style.color = '#dc3545'; // Red color for error
        }
    } else {
        signUpMessage.textContent = 'Passwords do not match.';
        signUpMessage.style.color = '#dc3545'; // Red color for error
    }
}

// This function will show the home page after login is successful
export function showHomePage() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = `
        <nav>
            
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
