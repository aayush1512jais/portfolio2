// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.themeToggle = document.getElementById('themeToggle');
    this.body = document.body;
    
    this.init();
  }
  
  init() {
    this.setTheme(this.theme);
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
  }
  
  setTheme(theme) {
    this.theme = theme;
    this.body.className = theme;
    localStorage.setItem('theme', theme);
    
    const icon = this.themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
  
  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}

// Animated Background
class AnimatedBackground {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.bgContainer = null;
    this.initialized = false;
    this._waitForContainer();
  }

  _waitForContainer() {
    // Try to get the container, if not found, retry until found
    const tryInit = () => {
      this.bgContainer = document.getElementById('animatedBg');
      if (this.bgContainer) {
        // Prevent multiple canvases
        if (!this.bgContainer.querySelector('canvas')) {
          this.init();
        }
      } else {
        // Retry after a short delay
        setTimeout(tryInit, 50);
      }
    };
    if (document.readyState === "loading") {
      document.addEventListener('DOMContentLoaded', tryInit, { once: true });
    } else {
      tryInit();
    }
  }

  init() {
    if (!this.bgContainer) return;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.bgContainer.appendChild(this.canvas);
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  createParticles() {
    this.particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        particle.x -= dx * 0.01;
        particle.y -= dy * 0.01;
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(168, 85, 247, ${particle.opacity})`;
      this.ctx.fill();
      
      // Connect nearby particles
      this.particles.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(168, 85, 247, ${0.1 * (1 - distance / 100)})`;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Smooth Scrolling & Navigation
class Navigation {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    this.mobileToggle = document.getElementById('mobileMenuToggle');
    this.navMenu = document.querySelector('.nav-menu');
    
    this.init();
  }
  
  init() {
    this.bindSmoothScroll();
    this.bindMobileMenu();
    this.bindActiveLinks();
  }
  
  bindSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  bindMobileMenu() {
    if (this.mobileToggle && this.navMenu) {
      this.mobileToggle.addEventListener('click', () => {
        this.navMenu.classList.toggle('active');
      });
    }
  }
  
  bindActiveLinks() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.fade-in, .skill-category, .project-card, .timeline-item');
    this.init();
  }
  
  init() {
    this.bindScrollObserver();
  }
  
  bindScrollObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, options);
    
    this.elements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(element);
    });
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }
  
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    this.showNotification('Message sent successfully!', 'success');
    this.form.reset();
  }
  
  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.lazyLoadImages();
    this.debounceScrollEvents();
  }
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
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
  
  debounceScrollEvents() {
    let ticking = false;
    
    const updateOnScroll = () => {
      // Add any scroll-based updates here
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    });
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  // If you have SplashScreenManager defined, uncomment the next two lines:
  // new SplashScreenManager();
  // setTimeout(() => {
  //   new ThemeManager();
  //   new AnimatedBackground();
  //   new Navigation();
  //   new ScrollAnimations();
  //   new ContactForm();
  //   new PerformanceOptimizer();
  //   document.body.classList.add('loaded');
  // }, 100);

  // Otherwise, initialize all modules immediately:
  new ThemeManager();
  new AnimatedBackground();
  new Navigation();
  new ScrollAnimations();
  new ContactForm();
  new PerformanceOptimizer();
  document.body.classList.add('loaded');

  // Console message for developers
  console.log(`
    ╔══════════════════════════════════════╗
    ║        Aayush Jaiswal Portfolio      ║
    ║     Built with passion and code      ║
    ║                                      ║
    ║  Tech Stack: HTML5, CSS3, Vanilla JS ║
    ║  Features: Responsive, Accessible    ║
    ║           Dark/Light Mode            ║
    ║           Smooth Animations          ║
    ╚══════════════════════════════════════╝
  `);
});

// Add CSS for mobile menu
const mobileMenuCSS = `
  @media (max-width: 768px) {
    .nav-menu {
      position: fixed;
      top: 70px;
      left: -100%;
      width: 100%;
      height: calc(100vh - 70px);
      background: rgba(15, 15, 26, 0.98);
      backdrop-filter: blur(20px);
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding-top: 2rem;
      transition: left 0.3s ease-out;
      z-index: 999;
    }
    
    .nav-menu.active {
      left: 0;
    }
    
    .nav-menu .nav-link {
      font-size: 1.2rem;
      padding: 1rem;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid rgba(168, 85, 247, 0.2);
    }
    
    .theme-toggle {
      margin-top: 2rem;
    }
  }
`;

// Inject mobile menu CSS
const style = document.createElement('style');
style.textContent = mobileMenuCSS;
document.head.appendChild(style);