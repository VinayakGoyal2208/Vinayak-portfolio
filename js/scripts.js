// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) navLinks.classList.remove('open');
});

// Smooth active link highlight
const sections = ['home', 'about', 'skills', 'projects', 'resume', 'contact'].map(id => document.getElementById(id));
const navAnchors = [...document.querySelectorAll('.nav-links a')];
window.addEventListener('scroll', () => {
    let current = 'home';
    sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top + window.scrollY - 120;
        if (window.scrollY >= top) current = sec.id;
    });
    navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

// Reveal on scroll + skill bars
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Animate bars inside skills when visible
            entry.target.querySelectorAll('.bar>span').forEach(el => {
                const w = el.getAttribute('data-skill') || 0;
                el.style.width = w + '%';
            });
        }
    });
}, { threshold: .15 });
document.querySelectorAll('.reveal, .skill').forEach(el => observer.observe(el));

// Contact form -> mailto
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = encodeURIComponent(data.get('name'));
    const email = encodeURIComponent(data.get('email'));
    const subject = encodeURIComponent(data.get('subject') || 'Portfolio Inquiry');
    const message = encodeURIComponent(data.get('message'));
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:vinayakgoyal2208@gmail.com?subject=${subject}&body=${body}`;
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();