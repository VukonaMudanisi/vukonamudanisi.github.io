// script.js - Complete with all requested features

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.bindEvents();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.theme);
  }

  bindEvents() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// Scroll Animations
class ScrollAnimator {
  constructor() {
    this.elements = document.querySelectorAll('[data-scroll]');
    this.init();
  }

  init() {
    this.observeElements();
    window.addEventListener('scroll', this.throttle(this.checkElements.bind(this), 100));
    this.checkElements(); // Initial check
  }

  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    this.elements.forEach(el => observer.observe(el));
  }

  checkElements() {
    this.elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0);
      
      if (isVisible) {
        el.classList.add('visible');
      }
    });
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Skill Bars Animation
class SkillAnimator {
  constructor() {
    this.skills = document.querySelectorAll('.skill-progress');
    this.init();
  }

  init() {
    this.animateSkills();
  }

  animateSkills() {
    this.skills.forEach(skill => {
      const width = skill.getAttribute('data-width');
      skill.style.width = width + '%';
    });
  }
}

// Project Filter
class ProjectFilter {
  constructor() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.projects = document.querySelectorAll('.project');
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        this.filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        this.filterProjects(filter);
      });
    });
  }

  filterProjects(filter) {
    this.projects.forEach(project => {
      const categories = project.getAttribute('data-category').split(' ');
      
      if (filter === 'all' || categories.includes(filter)) {
        project.classList.remove('hidden');
        project.style.opacity = '0';
        project.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          project.style.opacity = '1';
          project.style.transform = 'translateY(0)';
        }, 200);
      } else {
        project.classList.add('hidden');
      }
    });
  }
}

// PWA functionality
class PWAHandler {
  constructor() {
    this.deferredPrompt = null;
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.bindInstallPrompt();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  bindInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    const installBtn = document.getElementById('installBtn');
    const dismissBtn = document.getElementById('dismissBtn');
    const installPrompt = document.getElementById('installPrompt');

    if (installBtn && dismissBtn) {
      installBtn.addEventListener('click', () => this.installApp());
      dismissBtn.addEventListener('click', () => this.hideInstallPrompt());
    }
  }

  showInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
      installPrompt.style.display = 'block';
    }
  }

  hideInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
      installPrompt.style.display = 'none';
    }
  }

  async installApp() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.hideInstallPrompt();
      }
      
      this.deferredPrompt = null;
    }
  }
}

// Main Application
class PortfolioApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.scrollAnimator = new ScrollAnimator();
    this.skillAnimator = new SkillAnimator();
    this.projectFilter = new ProjectFilter();
    this.pwaHandler = new PWAHandler();
    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeComponents();
  }

  bindEvents() {
    // Profile image handling
    const profileImage = document.querySelector('.profile');
    if (profileImage) {
      profileImage.addEventListener('load', () => {
        profileImage.classList.remove('loading');
      });
      
      profileImage.addEventListener('error', () => {
        console.warn('Profile image failed to load');
      });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Form enhancement
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          if (submitBtn.disabled) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        }, 5000);
      });
    }

    // Add current year to footer
    this.updateFooterYear();
  }

  initializeComponents() {
    // Initialize any additional components here
    console.log('Portfolio app initialized successfully!');
  }

  updateFooterYear() {
    const yearElement = document.querySelector('footer p');
    if (yearElement) {
      const currentYear = new Date().getFullYear();
      yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Add console welcome message
console.log(
  '%c🚀 Vukona Mudanisi Portfolio - Loaded with Advanced Features!',
  'color: #2563eb; font-size: 16px; font-weight: bold;'
);
console.log(
  '%c✨ Features: Dark Mode • Skill Bars • Project Filter • Scroll Animations • PWA',
  'color: #64748b; font-size: 14px;'
);