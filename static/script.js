// Custom Cursor Logic
function initCustomCursor() {
    const dot = document.createElement('div');
    const outline = document.createElement('div');
    dot.className = 'cursor-dot';
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        dot.style.transform = `translate(${posX}px, ${posY}px)`;
        outline.style.transform = `translate(${posX - 20}px, ${posY - 20}px)`;
    });

    // Hover effects for links and buttons
    const links = document.querySelectorAll('a, button, .skill-card, .exp-card, .music-toggle');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            outline.classList.add('hover');
        });
        link.addEventListener('mouseleave', () => {
            outline.classList.remove('hover');
        });
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('glass');
    } else {
        nav.classList.remove('glass');
    }
});

// Mouse Parallax for Stickers
document.addEventListener('mousemove', (e) => {
    const stickers = document.querySelectorAll('.sticker');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    stickers.forEach((sticker, index) => {
        const speed = (index + 1) * 30;
        const xOffset = (x - 0.5) * speed;
        const yOffset = (y - 0.5) * speed;
        sticker.style.transform = `translate(${xOffset}px, ${yOffset}px) rotate(${index % 2 === 0 ? 5 : -5}deg)`;
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-container');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// Flower Rain Logic
function createFlowerRain() {
    const container = document.getElementById('flowerRainContainer');
    const flowerColors = ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
    const flowerCount = 40;

    for (let i = 0; i < flowerCount; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower-particle';
        
        const size = Math.random() * 25 + 15;
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 4;
        const color = flowerColors[Math.floor(Math.random() * flowerColors.length)];

        flower.style.width = `${size}px`;
        flower.style.height = `${size}px`;
        flower.style.left = `${left}%`;
        flower.style.animationDelay = `${delay}s`;
        flower.style.animationDuration = `${duration}s`;
        flower.style.color = color;

        flower.innerHTML = `<i data-lucide="flower" style="width: 100%; height: 100%; fill: currentColor; opacity: 0.6;"></i>`;
        
        container.appendChild(flower);
    }
    
    lucide.createIcons();
}

function clearFlowerRain() {
    const container = document.getElementById('flowerRainContainer');
    container.innerHTML = '';
}

// Success Popup Logic
function triggerSuccessPopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.add('active');
    createFlowerRain();
    
    setTimeout(() => {
        closePopup();
    }, 8000);
}

function closePopup() {
    const popup = document.getElementById('successPopup');
    popup.classList.remove('active');
    setTimeout(clearFlowerRain, 1000);
}

// Fetch Messages
async function fetchMessages() {
    try {
        const response = await fetch('/api/messages');
        const messages = await response.json();
        const list = document.getElementById('messagesList');
        
        if (messages.length === 0) {
            list.innerHTML = '<div class="no-messages">No messages yet. Say hello!</div>';
            return;
        }

        list.innerHTML = messages.map(msg => `
            <div class="message-card reveal">
                <i data-lucide="heart" class="heart-icon"></i>
                <div class="message-header">
                    <div>
                        <h5>${msg.name}</h5>
                        <span class="email">${msg.email}</span>
                    </div>
                    <span class="date">${new Date(msg.timestamp).toLocaleDateString()}</span>
                </div>
                <p class="message-text">"${msg.message}"</p>
            </div>
        `).join('');
        
        document.querySelectorAll('.message-card').forEach(el => revealObserver.observe(el));
        lucide.createIcons();
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Form Submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            triggerSuccessPopup();
            contactForm.reset();
            fetchMessages();
        } else {
            alert('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error connecting to server.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Music Toggle Functionality
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i data-lucide="music"></i>';
    } else {
        bgMusic.play().catch(error => {
            console.log("Audio playback failed:", error);
        });
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i data-lucide="pause"></i>';
    }
    isMusicPlaying = !isMusicPlaying;
    lucide.createIcons();
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchMessages();
    lucide.createIcons();
    initCustomCursor();
});
