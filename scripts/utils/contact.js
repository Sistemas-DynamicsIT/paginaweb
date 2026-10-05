// ===== CONTACT-FORM-MANAGER =====
class ContactFormManager {
  constructor(formElement, voiceContainer) {
    this.form = formElement;
    this.customerVoiceContainer = voiceContainer;
    this.customerVoiceSurveyId = this.getCustomerVoiceSurveyId();
    this.customerVoiceUrl = this.getCustomerVoiceUrl();
    this.init();
  }

  init() {
    if (this.customerVoiceSurveyId) {
      this.embedCustomerVoiceSurvey(this.customerVoiceSurveyId);
      return;
    }

    // Embed the Customer Voice iframe and hide the local form when a URL is available.
    if (this.customerVoiceUrl) {
      this.embedCustomerVoice(this.customerVoiceUrl);
      return;
    }

    // Otherwise, configure the local Marketo form.
    if (this.form) {
      this.setupValidation();
      this.setupSubmitHandler();
      this.setupInputFormatting();
    }
  }

  getCustomerVoiceUrl() {
    const url = this.customerVoiceContainer?.dataset?.url || '';
    return url.trim().length > 0 ? url.trim() : '';
  }

  getCustomerVoiceSurveyId() {
    const surveyId = this.customerVoiceContainer?.dataset?.surveyId || '';
    return surveyId.trim();
  }

  embedCustomerVoiceSurvey(surveyId) {
    if (!this.customerVoiceContainer) return;

    if (typeof SurveyEmbed !== 'function') {
      this.renderCustomerVoiceLink(this.customerVoiceUrl);
      return;
    }

    const survey = new SurveyEmbed(
      surveyId,
      'https://customervoice.microsoft.com/',
      'https://mfpembedcdnwus2.azureedge.net/mfpembedcontwus2/',
      'true'
    );
    survey.renderInline(this.customerVoiceContainer.id, { locale: 'es-ES' });
  }

  embedCustomerVoice(url) {
    if (!this.customerVoiceContainer) return;

    // Hide the fallback form when one is present.
    const fallback = document.getElementById('fallback-form');
    if (fallback) {
      fallback.style.display = 'none';
    }

    if (/\/Pages\/ProjectPage\.aspx/i.test(url)) {
      this.renderCustomerVoiceLink(url);
      return;
    }

    // Create the iframe.
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.title = 'Dynamics 365 Customer Voice';
    iframe.style.width = '100%';
    iframe.style.minHeight = '900px';
    iframe.style.border = '0';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

    this.customerVoiceContainer.appendChild(iframe);
  }

  renderCustomerVoiceLink(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'customer-voice-link';
    link.textContent = 'Abrir el formulario de Customer Voice';

    this.customerVoiceContainer.appendChild(link);
  }

  // --- Local Marketo validation and submission ---
  setupValidation() {
    const requiredFields = this.form.querySelectorAll('.mktoRequired');
    requiredFields.forEach((field) => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearError(field));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    this.clearError(field);

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio';
    }
    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Ingrese una dirección de correo electrónico válida';
    }
    if (field.type === 'tel' && value && !this.isValidPhone(value)) {
      isValid = false;
      errorMessage = 'Ingrese un número de teléfono válido';
    }

    if (!isValid) {
      this.showError(field, errorMessage);
    }
    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  showError(field, message) {
    field.classList.add('mktoInvalid');
    let errorElement = field.parentNode.querySelector('.mktoErrorMsg');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'mktoErrorMsg';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearError(field) {
    field.classList.remove('mktoInvalid');
    const errorElement = field.parentNode.querySelector('.mktoErrorMsg');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  setupInputFormatting() {
    const phoneInput = this.form.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
          value = value.match(/.{1,4}/g).join(' ');
          if (value.length > 14) value = value.substring(0, 14);
        }
        e.target.value = value;
      });
    }
  }

  setupSubmitHandler() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        await this.submitForm();
      }
    });
  }

  validateForm() {
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('.mktoRequired');
    requiredFields.forEach((field) => {
      if (!this.validateField(field)) isValid = false;
    });
    const consentCheckboxes = this.form.querySelectorAll('input[type="checkbox"][required]');
    consentCheckboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        isValid = false;
        this.showError(checkbox, 'Debe aceptar este campo para continuar');
      }
    });
    return isValid;
  }

  submitForm() {
    this.showErrorMessage('El formulario no tiene configurado un servicio de envío.');
  }

  showErrorMessage(msg) {
    alert(msg);
  }
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-faq-toggle]').forEach((button, index) => {
    const answer = button.parentElement.querySelector('.faq-answer');
    if (answer) {
      answer.id = answer.id || `contact-faq-answer-${index + 1}`;
      answer.setAttribute('aria-hidden', String(!button.parentElement.classList.contains('open')));
      button.setAttribute('aria-controls', answer.id);
      button.setAttribute('aria-expanded', String(button.parentElement.classList.contains('open')));
    }
    button.type = 'button';
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const isOpen = faqItem.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('open');
        item.querySelector('[data-faq-toggle]')?.setAttribute('aria-expanded', 'false');
        item.querySelector('.faq-answer')?.setAttribute('aria-hidden', 'true');
      });

      if (!isOpen) {
        faqItem.classList.add('open');
      }
      button.setAttribute('aria-expanded', String(!isOpen));
      answer?.setAttribute('aria-hidden', String(isOpen));
    });
  });

  const form = document.getElementById('mktoForm_18544'); // ID del formulario local (si existe)
  const voiceContainer = document.getElementById('customer-voice-container');

  if (voiceContainer) {
    new ContactFormManager(form, voiceContainer);
  }
});
