import { AppConfig } from "../config.js";
import { Utils } from "../utils.js";

/**
 * Contact Form Module
 * Handles form validation and email sending
 */

export class ContactFormController {
  constructor() {
    this.contactForm = document.querySelector(".contact-form");
    this.contactSubmitBtn = document.getElementById("contact-submit-btn");
    this.fromName = document.getElementById("from_name");
    this.emailId = document.getElementById("email_id");
    this.message = document.getElementById("message");
    this.honeypot = document.getElementById("hp_website");
    this.formTs = document.getElementById("form_ts");

    this.init();
  }

  init() {
    if (this.contactForm) {
      this.contactForm.addEventListener("submit", (e) => this.handleSubmit(e));
    }

    // Set timestamp when form becomes available
    if (this.formTs) {
      this.formTs.value = String(Date.now());
    }

    this.initEmailJS();
  }

  getLogger() {
    return Utils.getLogger();
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const logger = this.getLogger();

    if (!this.fromName || !this.emailId || !this.message) {
      logger.warn("Contact form elements not found");
      return;
    }

    // Anti-spam: honeypot check (bots fill hidden fields)
    if (this.honeypot && this.honeypot.value) {
      logger.warn("Honeypot triggered");
      this.fromName.value = "";
      this.emailId.value = "";
      this.message.value = "";
      this.showSuccess(); // Fake success to not alert the bot
      return;
    }

    const email = this.emailId.value.trim();
    if (!this.validateEmail(email)) {
      this.emailId.classList.add("is-invalid");
      this.emailId.focus();
      return;
    }

    this.emailId.classList.remove("is-invalid");

    const params = {
      from_name: this.fromName.value.trim(),
      email_id: email,
      message: this.message.value.trim(),
      _ts: this.formTs ? this.formTs.value : "",
    };

    // Disable submit button
    if (this.contactSubmitBtn) {
      this.contactSubmitBtn.disabled = true;
      this.contactSubmitBtn.innerHTML = "<span>Sending...</span>";
    }

    try {
      // Try backend API first (more secure)
      const API_ENDPOINT = AppConfig.EMAIL?.API_ENDPOINT || "/api/contact";

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success || data.error === undefined) {
        // Clear form
        this.fromName.value = "";
        this.emailId.value = "";
        this.message.value = "";
        this.emailId.classList.remove("is-invalid");

        this.showSuccess();
      } else {
        throw new Error(data.message || "Failed to send email");
      }
    } catch (error) {
      logger.error("Contact form error:", error);
      this.showError();
    } finally {
      // Re-enable submit button
      if (this.contactSubmitBtn) {
        this.contactSubmitBtn.disabled = false;
        this.contactSubmitBtn.innerHTML =
          '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      }
    }
  }

  showSuccess() {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        position: "top",
        icon: "success",
        title: "Email Sent Successfully",
        text: "Thank you for your message. I will get back to you soon!",
        showConfirmButton: false,
        timer: 3000,
      });
    } else {
      alert("Email sent successfully! Thank you for your message.");
    }
  }

  showError() {
    const errorMessage =
      "Failed to send email. Please try again or contact directly at vophuthinhcm@gmail.com";
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "error",
        title: "Send Failed",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    } else {
      alert(errorMessage);
    }
  }

  initEmailJS() {
    // Defer SweetAlert2 loading until idle to avoid impacting first paint
    const runWhenIdle = window.requestIdleCallback
      ? window.requestIdleCallback.bind(window)
      : (cb) => setTimeout(cb, 500);

    runWhenIdle(async () => {
      await this.ensureSwalLoaded();
    });
  }

  async ensureSwalLoaded() {
    if (typeof Swal !== "undefined") return true;
    return this.loadScript("https://cdn.jsdelivr.net/npm/sweetalert2@11");
  }

  loadScript(src) {
    return new Promise((resolve) => {
      if (document.querySelector(`script[data-src="${src}"]`)) {
        resolve(typeof Swal !== "undefined");
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;
      script.dataset.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }
}
