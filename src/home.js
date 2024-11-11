export default function loadHome() {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear previous content

    const homeSection = document.createElement('div');
    homeSection.classList.add('home-section');

    const heading = document.createElement('h1');
    heading.textContent = 'Welcome to Crimson and Gold';
    heading.classList.add('home-heading');

    const paragraph = document.createElement('p');
    paragraph.textContent = 'Experience authentic flavors and a warm atmosphere.';
    paragraph.classList.add('home-paragraph');

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Enter Your Name';
    nameInput.classList.add('reservation-input');

    const contactInput = document.createElement('input');
    contactInput.type = 'text';
    contactInput.placeholder = 'Enter Your Contact Info';
    contactInput.classList.add('reservation-input');

    const dateInput = document.createElement('input');
    dateInput.type = 'datetime-local';
    dateInput.placeholder = 'Select Date and Time';
    dateInput.classList.add('reservation-input');

    const seatsInput = document.createElement('input');
    seatsInput.type = 'number';
    seatsInput.placeholder = 'Number of Seats';
    seatsInput.min = 1;
    seatsInput.classList.add('reservation-input');

    const button = document.createElement('button');
    button.textContent = 'Reserve a Table';
    button.classList.add('reserve-button');

    // Append elements to the home section
    homeSection.appendChild(heading);
    homeSection.appendChild(paragraph);
    homeSection.appendChild(nameInput);
    homeSection.appendChild(contactInput);
    homeSection.appendChild(dateInput);
    homeSection.appendChild(seatsInput);
    homeSection.appendChild(button);

    // Create a div to display reservation messages
    const messageDiv = document.createElement('div');
    messageDiv.id = 'reservationMessage';
    messageDiv.classList.add('reservation-message');
    homeSection.appendChild(messageDiv);

    // Append the home section to the main content
    content.appendChild(homeSection);

    // Add event listener for the reservation button
    button.addEventListener('click', () => {
        // Validate input fields
        if (!nameInput.value || !contactInput.value || !dateInput.value || !seatsInput.value) {
            alert("Please fill out all fields.");
            return;
        }

        const reservationDetails = {
            name: nameInput.value,
            contact: contactInput.value,
            date: dateInput.value,
            seats: parseInt(seatsInput.value)
        };

        fetch('http://localhost:3000/reserve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationDetails)
        })
        .then(response => response.json())
        .then(data => {
            const messageDiv = document.getElementById('reservationMessage');
            if (data.message) {
                // Display success message
                messageDiv.innerHTML = `<p>${data.message}</p>`;
                messageDiv.style.color = 'green';
            } else {
                alert(data.error || "Reservation failed. Please try again.");
                messageDiv.innerHTML = ''; // Clear any previous messages
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
            document.getElementById('reservationMessage').innerHTML = ''; // Clear any previous messages
        });
    });
}