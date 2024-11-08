import "./styles.css";

import loadMenu from "./menu";
import loadHome from "./home.js";
import loadContact from "./contact.js";
import { fetchReservations } from './reservations.js';
import { setupReservationButton } from './reservations.js';
import { displayLoginForm } from './login.js';




// Select the content div
const content = document.getElementById("content");

// Function to clear the content div before loading new content
function clearContent() {
    content.innerHTML = "";
}

// Event listener for the "Menu" button
document.getElementById("menuBtn").addEventListener("click", () => {
    clearContent(); // Clear existing content
    content.appendChild(loadMenu()); // Load and display menu content
});
// Function to set up event listeners
function setupEventListeners() {
    const homeBtn = document.getElementById('homeBtn');

    // Load home section when the Home button is clicked
    homeBtn.addEventListener('click', loadHome); // Directly call loadHome
}

// Initialize the page by loading the home section by default
loadHome(); // Optionally, load home on page load
setupEventListeners(); // Set up the event listeners
// Add event listeners to buttons

document.getElementById('contactBtn').addEventListener('click', loadContact);

// Load home by default on initial page load
loadHome();
document.addEventListener("DOMContentLoaded", () => {
    setupReservationButton();
});
// Assuming your login button in the main navigation triggers this function:
document.getElementById('loginBtn').addEventListener('click', () => {
    displayLoginForm();
});