export default function loadContact() {
    const content = document.getElementById('content');
    content.innerHTML = ''; // Clear existing content

    const contactSection = document.createElement('div');
    contactSection.className = 'contact-section';

    // Create heading
    const heading = document.createElement('h1');
    heading.textContent = 'Contact Us';
    heading.classList.add('contact-heading'); // Add class for specific styling
    contactSection.appendChild(heading);

    // Create contact information paragraph
    const paragraph = document.createElement('p');
    paragraph.innerHTML = `
        <strong>Phone:</strong> 123456789<br>
        <strong>Email:</strong> crimson&gold@gmail.com<br>
        <strong>Address:</strong> 123 ABC, Mangalore, India
    `;
    contactSection.appendChild(paragraph);

    // Create a form for user inquiries
    const form = document.createElement('form');
    
    const messageLabel = document.createElement('label');
    messageLabel.textContent = 'Message:';
    const messageInput = document.createElement('textarea');
    messageInput.name = 'message';
    messageInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Send Message';
    
    form.appendChild(messageLabel);
    form.appendChild(messageInput);
    form.appendChild(submitButton);
    
    contactSection.appendChild(form);

    // Append the contact section to content
    content.appendChild(contactSection);

    // Event listener for message submission
    submitButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent page reload
    
        const message = messageInput.value.trim(); // Get the message content
    
        if (!message) {
            alert("Please enter a message.");
            return;
        }
    
        // Prepare the message data to send to the server
        const messageData = {
            content: message // The backend expects 'content'
        };
    
        // Send the message to the server via fetch
        fetch('http://localhost:3000/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData) // Send the content as a JSON body
        })
        .then(response => response.json())
        .then(data => {
            const messageDiv = document.createElement('div');
            if (data.message) {
                messageDiv.innerHTML = `<p>${data.message}</p>`;
                messageDiv.style.color = 'green';
            } else {
                messageDiv.innerHTML = `<p>${data.error}</p>`;
                messageDiv.style.color = 'red';
            }
            contactSection.appendChild(messageDiv);
            messageInput.value = ''; // Clear message input
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
    });
}  