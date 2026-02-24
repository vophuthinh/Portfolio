/**
 * Contact Form Module
 * Handles form validation and email sending
 */

export class ContactFormController {
  constructor() {
    this.contactForm = document.querySelector('.contact-form');
    this.contactSubmitBtn = document.getElementById('contact-submit-btn');
    this.fromName = document.getElementById('from_name');
    this.emailId = document.getElementById('email_id');
    this.message = document.getElementById('message');
    
    this.init();
  }
  
  init() {
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    this.initEmailJS();
  }
  
  getLogger() {
    return (typeof Utils !== 'undefined' && Utils.getLogger) 
      ? Utils.getLogger() 
      : { 
          log: console.log.bind(console),
          warn: console.warn.bind(console),
          error: console.error.bind(console)
        };
  }
  
  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    
    const logger = this.getLogger();
    
    if (!this.fromName || !this.emailId || !this.message) {
      logger.warn('Contact form elements not found');
      return;
    }
    
    const email = this.emailId.value.trim();
    if (!this.validateEmail(email)) {
      this.emailId.classList.add('is-invalid');
      this.emailId.focus();
      return;
    }
    
    this.emailId.classList.remove('is-invalid');
    
    const params = {
      from_name: this.fromName.value.trim(),
      email_id: email,
      message: this.message.value.trim(),
    };
    
    // Disable submit button
    if (this.contactSubmitBtn) {
      this.contactSubmitBtn.disabled = true;
      this.contactSubmitBtn.innerHTML = '<span>Sending...</span>';
    }
    
    try {
      // Try backend API first (more secure)
      const API_ENDPOINT = (typeof AppConfig !== 'undefined' && AppConfig.EMAIL?.API_ENDPOINT) 
        ? AppConfig.EMAIL.API_ENDPOINT 
        : '/api/contact';
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success || data.error === undefined) {
        // Clear form
        this.fromName.value = '';
        this.emailId.value = '';
        this.message.value = '';
        this.emailId.classList.remove('is-invalid');
        
        this.showSuccess();
      } else {
        throw new Error(data.message || 'Failed to send email');
      }
    } catch (error) {
      logger.error('Contact form error:', error);
      
      // Fallback to EmailJS direct (if available)
      if (typeof emailjs !== 'undefined') {
        try {
          const EMAILJS_SERVICE_ID =
            (typeof AppConfig !== 'undefined' && AppConfig.EMAIL?.SERVICE_ID)
              ? AppConfig.EMAIL.SERVICE_ID
              : '';
          const EMAILJS_TEMPLATE_ID =
            (typeof AppConfig !== 'undefined' && AppConfig.EMAIL?.TEMPLATE_ID)
              ? AppConfig.EMAIL.TEMPLATE_ID
              : '';

          if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
            this.showFallbackMessage();
            return;
          }
          
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
          
          // Clear form
          this.fromName.value = '';
          this.emailId.value = '';
          this.message.value = '';
          this.emailId.classList.remove('is-invalid');
          
          this.showSuccess();
        } catch (fallbackError) {
          logger.error('Fallback EmailJS error:', fallbackError);
          this.showError();
        }
      } else {
        this.showError();
      }
    } finally {
      // Re-enable submit button
      if (this.contactSubmitBtn) {
        this.contactSubmitBtn.disabled = false;
        this.contactSubmitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      }
    }
  }
  
  showSuccess() {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Email Sent Successfully',
        text: 'Thank you for your message. I will get back to you soon!',
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      alert('Email sent successfully! Thank you for your message.');
    }
  }
  
  showError() {
    const errorMessage = 'Failed to send email. Please try again or contact directly at vophuthinhcm@gmail.com';
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title: 'Send Failed',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    } else {
      alert(errorMessage);
    }
  }
  
  showFallbackMessage() {
    const fallbackMessage = 'Contact form is not configured. Please email directly at vophuthinhcm@gmail.com';
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'info',
        title: 'Contact Unavailable',
        text: fallbackMessage,
        confirmButtonText: 'OK'
      });
    } else {
      alert(fallbackMessage);
    }
    // Fallback: open mailto link
    if (this.message) {
      window.location.href = `mailto:vophuthinhcm@gmail.com?subject=Contact from Portfolio&body=${encodeURIComponent(this.message.value)}`;
    }
  }
  
  initEmailJS() {
    if (typeof emailjs === 'undefined') {
      const checkInterval = setInterval(() => {
        if (typeof emailjs !== 'undefined') {
          clearInterval(checkInterval);
          this.initializeEmailJS();
        }
      }, 100);
      
      setTimeout(() => clearInterval(checkInterval), 5000);
      return;
    }
    
    this.initializeEmailJS();
  }
  
  initializeEmailJS() {
    try {
      const publicKey =
        (typeof AppConfig !== 'undefined' && AppConfig.EMAIL?.PUBLIC_KEY)
          ? AppConfig.EMAIL.PUBLIC_KEY
          : '';
      
      if (publicKey && typeof emailjs !== 'undefined' && emailjs.init) {
        emailjs.init({
          publicKey: publicKey,
        });
        
        const logger = this.getLogger();
        logger.log('EmailJS initialized successfully');
      }
    } catch (error) {
      const logger = this.getLogger();
      logger.warn('EmailJS init error:', error);
    }
  }
}
