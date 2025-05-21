// Function to include HTML components
async function includeHTML(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error loading ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Highlight the current page in the navigation
        highlightCurrentPage();
    } catch (error) {
        console.error("Error including HTML:", error);
    }
}

// Function to highlight the current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop();
    
    // Remove all active classes first
    document.querySelectorAll("#navbar ul li a").forEach(link => {
        link.classList.remove("active");
    });
    
    // Add active class to current page
    if (currentPage === "" || currentPage === "index.html") {
        document.getElementById("nav-home").classList.add("active");
    } else if (currentPage === "about.html") {
        document.getElementById("nav-about").classList.add("active");
    } else if (currentPage === "projects.html") {
        document.getElementById("nav-projects").classList.add("active");
    } else if (currentPage === "skills.html") {
        document.getElementById("nav-skills").classList.add("active");
    } else if (currentPage === "contact.html") {
        document.getElementById("nav-contact").classList.add("active");
    }
}

// Load components when the page is ready
document.addEventListener("DOMContentLoaded", function() {
    includeHTML("header-placeholder", "components/header.html");
    includeHTML("footer-placeholder", "components/footer.html");
    
    // For the home page, add the typing effect
    if (document.querySelector(".typed-text")) {
        typeEffect();
    }
    
    // For the contact page, add form submission handling
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", handleFormSubmit);
    }
});

// Typing effect for the home page
function typeEffect() {
    const typedTextElement = document.querySelector(".typed-text");
    const textArray = ["Web App Developer", "Designer", "Freelancer"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 1500); // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            setTimeout(type, 500); // Pause before typing next word
        } else {
            setTimeout(type, isDeleting ? 50 : 100); // Typing speed
        }
    }
    
    setTimeout(type, 1000); // Initial delay
}

// Handle contact form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
    
    // Here you would typically send the data to a server
    console.log("Form submitted:", { name, email, subject, message });
    
    // Show success message
    const successMessage = document.getElementById("form-success");
    if (successMessage) {
        successMessage.style.display = "block";
        
        // Hide the success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 5000);
    }
    
    // Reset the form
    event.target.reset();
}


// Smooth scrolling for navigation links
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.hash) {
        const targetElement = document.querySelector(event.target.hash);
        if (targetElement) {
            event.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    }
});

// Add scroll event listener for navbar styling
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Project filter functionality (if you add this feature later)
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    
    if (category === 'all') {
        projects.forEach(project => {
            project.style.display = 'block';
        });
    } else {
        projects.forEach(project => {
            if (project.classList.contains(category)) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });
    }
}

// Initialize any sliders or carousels (if you add them later)
function initSliders() {
    // This is a placeholder for slider initialization code
    // You can add a library like Swiper.js later if needed
    console.log("Sliders initialized");
}

// Add dark mode toggle functionality (if you want to add this feature)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Check for saved dark mode preference
function checkDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Call this function when the page loads
checkDarkModePreference();
