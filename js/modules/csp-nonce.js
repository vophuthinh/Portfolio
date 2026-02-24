/**
 * CSP Nonce Generator
 * Generates cryptographic nonces for Content Security Policy
 */

export class CSPNonceGenerator {
  constructor() {
    this.nonce = this.generateNonce();
  }
  
  /**
   * Generate a cryptographically secure nonce
   * @returns {string} Base64 encoded nonce
   */
  generateNonce() {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return btoa(String.fromCharCode.apply(null, array));
    }
    
    // Fallback for older browsers
    return btoa(Math.random().toString(36).substring(2, 15));
  }
  
  /**
   * Get the current nonce
   * @returns {string}
   */
  getNonce() {
    return this.nonce;
  }
  
  /**
   * Apply nonce to inline scripts
   */
  applyNonceToInlineScripts() {
    // Get nonce from meta tag if exists
    const metaNonce = document.querySelector('meta[name="csp-nonce"]');
    if (metaNonce) {
      this.nonce = metaNonce.getAttribute('content');
    }
    
    // Apply to all inline scripts
    document.querySelectorAll('script:not([src])').forEach(script => {
      if (!script.hasAttribute('nonce')) {
        script.setAttribute('nonce', this.nonce);
      }
    });
  }
}

// Export singleton
export const cspNonce = new CSPNonceGenerator();
