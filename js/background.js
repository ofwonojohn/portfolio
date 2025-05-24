// Dynamic background effects
document.addEventListener('DOMContentLoaded', function() {
    // Create color picker if it doesn't exist
    if (!document.querySelector('.color-picker-container')) {
        createColorPicker();
    }
    
    // Create canvas for background animation
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3'; // Subtle effect
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Initialize particles
    let particles = [];
    const particleCount = 50;
    
    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                color: 'rgba(255, 255, 255, 0.5)',
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5
            });
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Move particles
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Connect particles with lines if they're close enough
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const distance = Math.sqrt(
                    Math.pow(p.x - p2.x, 2) + 
                    Math.pow(p.y - p2.y, 2)
                );
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - distance/500})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Initialize
    window.addEventListener('resize', function() {
        resizeCanvas();
        createParticles();
    });
    
    resizeCanvas();
    createParticles();
    animate();
    
    // Apply saved background color
    applySavedBackgroundColor();
});

// Create color picker
function createColorPicker() {
    const colorPickerContainer = document.createElement('div');
    colorPickerContainer.className = 'color-picker-container';
    
    const colors = [
        { color: '#2c3e50', active: true }, //Dark blue
        { color: '#27ae60', active: false }, //Green
        { color: '#8e44ad', active: false }, //Purple
        { color: '#e74c3c', active: false } //Red
    ];
    
    colors.forEach(colorObj => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        if (colorObj.active) colorOption.classList.add('active');
        colorOption.dataset.color = colorObj.color;
        colorOption.style.backgroundColor = colorObj.color;
        
        colorOption.addEventListener('click', function() {
            // Update background color
            document.body.style.backgroundColor = this.dataset.color;
            
            // Update active state
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Save preference to localStorage
            localStorage.setItem('preferredBgColor', this.dataset.color);
            
            // Update particle colors based on background
            updateParticleColors(this.dataset.color);
        });
        
        colorPickerContainer.appendChild(colorOption);
    });
    
    document.body.appendChild(colorPickerContainer);
}

// Apply saved background color
function applySavedBackgroundColor() {
    const savedColor = localStorage.getItem('preferredBgColor');
    if (savedColor) {
        document.body.style.backgroundColor = savedColor;
        
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(opt => {
            if (opt.dataset.color === savedColor) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
        
        updateParticleColors(savedColor);
    } else {
        // Set default color
        document.body.style.backgroundColor = '#1a1a1a';
    }
}

// Update particle colors based on background
function updateParticleColors(bgColor) {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    
    // Create a contrasting color for particles
    const particleColor = r + g + b < 382 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
    
    // Update all particles if they exist
    if (window.particles) {
        window.particles.forEach(p => {
            p.color = particleColor;
        });
    }
}
