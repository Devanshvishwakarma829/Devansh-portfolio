"use strict";

/* =========================
   HELPERS
========================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================
   PROFESSIONAL BOOT SCREEN
========================= */

const bootScreen = $("#bootScreen");
const bootPercent = $("#bootPercent");

let bootValue = 0;

const bootInterval = setInterval(() => {

    bootValue += Math.floor(Math.random() * 7) + 2;

    if (bootValue >= 100) {
        bootValue = 100;
        clearInterval(bootInterval);
    }

    if (bootPercent) {
        bootPercent.textContent = `${bootValue}%`;
    }

}, 55);

window.addEventListener("load", () => {

    setTimeout(() => {

        if (bootPercent) {
            bootPercent.textContent = "100%";
        }

        if (bootScreen) {
            bootScreen.classList.add("hide");
        }

        document.body.style.overflowY = "auto";

    }, 2700);

});


/* =========================
   MOUSE GLOW
========================= */

const mouseGlow = $(".mouse-glow");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let glowX = mouseX;
let glowY = mouseY;

window.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

});

function animateMouseGlow() {

    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    if (mouseGlow) {

        mouseGlow.style.left = `${glowX}px`;
        mouseGlow.style.top = `${glowY}px`;

    }

    requestAnimationFrame(animateMouseGlow);
}

animateMouseGlow();


/* ================= NETWORK BACKGROUND ================= */

const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let particles = [];
let width = 0;
let height = 0;

const pointer = {
    x: null,
    y: null,
    radius: 140
};

function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
}


function getParticleCount() {

    if (window.innerWidth < 600) {
        return 32;
    }

    if (window.innerWidth < 1000) {
        return 55;
    }

    return 85;
}


function createParticles() {

    particles = [];

    const count = getParticleCount();

    for (let i = 0; i < count; i++) {

        particles.push({

            x: Math.random() * width,
            y: Math.random() * height,

            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,

            size: Math.random() * 1.5 + 0.4,

            alpha: Math.random() * 0.45 + 0.12,

            phase: Math.random() * Math.PI * 2

        });
    }
}


function drawNetwork(time) {

    ctx.clearRect(0, 0, width, height);

    for (const particle of particles) {

        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.phase += 0.008;

        const pulse =
            Math.sin(particle.phase + time * 0.001) * 0.15;

        const currentAlpha =
            Math.max(0.05, particle.alpha + pulse);

        if (particle.x < -30) particle.x = width + 30;
        if (particle.x > width + 30) particle.x = -30;

        if (particle.y < -30) particle.y = height + 30;
        if (particle.y > height + 30) particle.y = -30;

        /* mouse influence */

        if (pointer.x !== null) {

            const dx = particle.x - pointer.x;
            const dy = particle.y - pointer.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < pointer.radius && distance > 0) {

                const force =
                    (pointer.radius - distance) /
                    pointer.radius;

                particle.x += (dx / distance) * force * 0.35;
                particle.y += (dy / distance) * force * 0.35;
            }
        }

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(220,235,255,${currentAlpha})`;

        ctx.fill();
    }


    /* connections */

    const maxDistance =
        window.innerWidth < 700 ? 120 : 150;

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            const a = particles[i];
            const b = particles[j];

            const dx = a.x - b.x;
            const dy = a.y - b.y;

            const distance =
                Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {

                const alpha =
                    (1 - distance / maxDistance) * 0.20;

                ctx.beginPath();

                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);

                ctx.strokeStyle =
                    `rgba(180,210,240,${alpha})`;

                ctx.lineWidth = 0.55;

                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(drawNetwork);
}


window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (event) => {

    pointer.x = event.clientX;
    pointer.y = event.clientY;

});

window.addEventListener("mouseleave", () => {

    pointer.x = null;
    pointer.y = null;

});

resizeCanvas();
requestAnimationFrame(drawNetwork);

/* =========================
   NAVIGATION
========================= */

$$("a[href^='#']").forEach((link) => {

    link.addEventListener("click", (event) => {

        const id = link.getAttribute("href");

        if (!id || id === "#") {
            return;
        }

        const target = $(id);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});

/* =========================
   SCROLL PROGRESS
========================= */

const scrollProgress = $(".scroll-progress");

window.addEventListener("scroll", () => {

    if (!scrollProgress) return;

    const scrollTop = window.scrollY;
    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        documentHeight > 0
            ? (scrollTop / documentHeight) * 100
            : 0;

    scrollProgress.style.width = `${progress}%`;

});

/* =========================
   BACK TO TOP
========================= */

const backToTop = $(".back-to-top");

window.addEventListener("scroll", () => {

    if (!backToTop) return;

    if (window.scrollY > 500) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }

});

/* =========================
   MOBILE MENU
========================= */

const mobileMenuBtn = $(".mobile-menu-btn");
const mobileMenu = $(".mobile-menu");

if (mobileMenuBtn && mobileMenu) {

    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
        });

    });

}

if (backToTop) {

    backToTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

/* =========================
   SCROLL REVEAL
========================= */

const revealElements = $$(`
    .section-intro,
    .about-copy,
    .about-info,
    .skill-card,
    .project-card,
    .experience-card,
    .future-box,
    .contact-card
`);

const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: .12
        }
    );

revealElements.forEach((element) => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


/* =========================
   ACTIVE NAVIGATION
========================= */

const sections = $$("main section[id]");
const navLinks = $$(".nav-links a");

const sectionObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach((link) => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${entry.target.id}`
                    ) {
                        link.classList.add("active");
                    }

                });

            });

        },
        {
            threshold: .45
        }
    );

sections.forEach((section) => {
    sectionObserver.observe(section);
});


/* =========================
   PROJECT CARD TILT
========================= */

if (window.innerWidth > 900) {

    $$(".project-card").forEach((card) => {

        card.addEventListener("mousemove", (event) => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const rotateX =
                ((y / rect.height) - .5) * -5;

            const rotateY =
                ((x / rect.width) - .5) * 5;

            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

}


/* =========================
   BUTTON RIPPLE
========================= */

$$(".btn, .project-btn, .project-github").forEach(
    (button) => {

        button.addEventListener("click", (event) => {

            const ripple =
                document.createElement("span");

            ripple.className = "ripple";

            const rect =
                button.getBoundingClientRect();

            ripple.style.left =
                `${event.clientX - rect.left}px`;

            ripple.style.top =
                `${event.clientY - rect.top}px`;

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);

        });

    }
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Home") {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

});

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// =========================
// SMOOTH NAVIGATION
// =========================

document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});