document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const signupButton = document.getElementById('signup-button');
    const signupSection = document.getElementById('signup-section');
    const profileSection = document.getElementById('profile-section');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');

    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');

    if (loggedInUserEmail) {
        displayProfile(loggedInUserEmail);
    }

    signupButton.addEventListener('click', function() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        if (name.length < 4) {
            alert('Name must be at least 4 characters long.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password === "") {
            alert('Password cannot be empty.');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (users.some(user => user.email === email)) {
            alert('You already have an account. Please log in.');
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUserEmail', email);

        alert('Account created successfully!');
        displayProfile(email);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function displayProfile(email) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);

        if (user) {
            signupSection.style.display = 'none';
            profileSection.style.display = 'block';
            profileName.innerText = `Name: ${user.name}`;
            profileEmail.innerText = `Email: ${user.email}`;
        }
    }
});

function adminLogin() {
    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (email === "admin@gmail.com" && password === "admin@123") {
        window.location.href = "admin_login.html";
    } else {
        alert("Please fill out the admin email and password.");
    }
    return false;
}

function logout() {
    localStorage.removeItem('loggedInUserEmail');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const updateButton = document.getElementById('update-button');
    const spots = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1', 'E2', 'E3', 'E4', 'F1', 'F2', 'F3', 'F4'];

    spots.forEach(spot => {
        const savedStatus = localStorage.getItem(`spot-${spot}`);
        if (savedStatus) {
            document.getElementById(`spot-${spot}`).value = savedStatus;
        }
    });

    updateButton.addEventListener('click', function() {
        spots.forEach(spot => {
            const status = document.getElementById(`spot-${spot}`).value;
            localStorage.setItem(`spot-${spot}`, status);
        });
        alert('Parking spots updated successfully.');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const spots = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1', 'E2', 'E3', 'E4', 'F1', 'F2', 'F3', 'F4'];
    const today = new Date().toISOString().split('T')[0];

    spots.forEach(spot => {
        const reservations = JSON.parse(localStorage.getItem(`spot-${spot}-reservations`)) || [];
        let status = 'available';

        reservations.forEach(reservation => {
            if (reservation.date === today) {
                const now = new Date().toTimeString().split(' ')[0];
                if (now >= reservation.startTime && now <= reservation.endTime) {
                    status = 'not-available';
                }
            }
        });

        const statusElement = document.getElementById(`status-${spot}`);
        statusElement.innerText = status.replace('-', ' ');
        statusElement.style.color = (status === 'available') ? 'green' : 'red';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const reserveButton = document.getElementById('reserve-button');

    reserveButton.addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;
        const spotSelect = document.getElementById('spot-select');
        const selectedSpot = spotSelect.value;

        if (name.length < 4) {
            alert('Name must be at least 4 characters long.');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!validateTime(startTime, endTime)) {
            alert('End time must be after start time.');
            return;
        }

        const reservation = {
            name: name,
            email: email,
            date: date,
            startTime: startTime,
            endTime: endTime
        };

        let reservations = JSON.parse(localStorage.getItem(`spot-${selectedSpot}-reservations`)) || [];
        reservations.push(reservation);
        localStorage.setItem(`spot-${selectedSpot}-reservations`, JSON.stringify(reservations));

        alert(`Spot ${selectedSpot} has been reserved from ${startTime} to ${endTime} on ${date}.`);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateTime(startTime, endTime) {
        return startTime < endTime;
    }
});