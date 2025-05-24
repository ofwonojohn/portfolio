// Function to include HTML components
async function includeHTML(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error loading ${filePath}: ${response.statusText}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Initialize navbar functionality after header is loaded
        if (elementId === 'header-placeholder') {
            initializeNavbar();
        }
        
        // Highlight the current page in the navigation
        highlightCurrentPage();
    } catch (error) {
        console.error("Error including HTML:", error);
    }
}

// Initialize navbar functionality
function initializeNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    
    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// Function to highlight the current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split("/").pop();
    
    // Remove all active classes first
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });
    
    // Add active class to current page
    if (currentPage === "" || currentPage === "index.html") {
        const homeLink = document.getElementById("nav-home");
        if (homeLink) homeLink.classList.add("active");
    } else if (currentPage === "about.html") {
        const aboutLink = document.getElementById("nav-about");
        if (aboutLink) aboutLink.classList.add("active");
    } else if (currentPage === "projects.html") {
        const projectsLink = document.getElementById("nav-projects");
        if (projectsLink) projectsLink.classList.add("active");
    } else if (currentPage === "skills.html") {
        const skillsLink = document.getElementById("nav-skills");
        if (skillsLink) skillsLink.classList.add("active");
    } else if (currentPage === "contact.html") {
        const contactLink = document.getElementById("nav-contact");
        if (contactLink) contactLink.classList.add("active");
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
    
    // Initialize any additional features
    initializeSkillBars();
    initializeProjectFilters();
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

// Initialize skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    if (skillBars.length > 0) {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const width = skillBar.style.width;
                    skillBar.style.width = '0%';
                    
                    setTimeout(() => {
                        skillBar.style.transition = 'width 1.5s ease-in-out';
                        skillBar.style.width = width;
                    }, 200);
                    
                    observer.unobserve(skillBar);
                }
            });
        }, observerOptions);
        
        skillBars.forEach(bar => observer.observe(bar));
    }
}

// Initialize project filters
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                filterProjects(filter);
            });
        });
    }
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

// Project filter functionality
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    
    if (category === 'all') {
        projects.forEach(project => {
            project.style.display = 'block';
            project.style.animation = 'fadeIn 0.5s ease-in-out';
        });
    } else {
        projects.forEach(project => {
            if (project.classList.contains(category)) {
                project.style.display = 'block';
                project.style.animation = 'fadeIn 0.5s ease-in-out';
            } else {
                project.style.display = 'none';
            }
        });
    }
}

// Initialize any sliders or carousels
function initSliders() {
    // This is a placeholder for slider initialization code
    // You can add a library like Swiper.js later if needed
    console.log("Sliders initialized");
}

// Add dark mode toggle functionality
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update dark mode icon if it exists
    const darkModeIcon = document.querySelector('.dark-mode-toggle i');
    if (darkModeIcon) {
        darkModeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Check for saved dark mode preference
function checkDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        
        // Update icon if it exists
        const darkModeIcon = document.querySelector('.dark-mode-toggle i');
        if (darkModeIcon) {
            darkModeIcon.className = 'fas fa-sun';
        }
    }
}

// Initialize dark mode toggle button
function initializeDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Scroll to top functionality
function initializeScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize all features when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Check dark mode preference first
    checkDarkModePreference();
    
    // Initialize all features
    initializeDarkModeToggle();
    initializeLazyLoading();
    initializeScrollToTop();
    
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => sectionObserver.observe(section));
});

// Handle form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.classList.add('error');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Add input event listeners for real-time validation
document.addEventListener('input', function(event) {
    if (event.target.matches('input, textarea')) {
        if (event.target.value.trim()) {
            event.target.classList.remove('error');
        }
    }
});

// Preloader functionality
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Hide preloader when page is fully loaded
window.addEventListener('load', hidePreloader);

// Export functions for external use if needed
window.portfolioFunctions = {
    toggleDarkMode,
    filterProjects,
    typeEffect,
    highlightCurrentPage
};
