// CONFIGURAÇÃO DA NEXALINK: insira apenas os números do WhatsApp com DDI e DDD.
// Exemplo de formato: '5521999999999'. Não insira +, espaços ou traços.
const WHATSAPP_NUMBER = '5521981532376';

const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();


// Clique nos cards: preenche o serviço e navega suavemente para o orçamento.
const serviceSelect = document.getElementById('type');
const contactSection = document.getElementById('contato');
document.querySelectorAll('.service-card[data-service]').forEach(card => {
  card.addEventListener('click', event => {
    const chosenService = card.dataset.service;
    const exists = [...serviceSelect.options].some(option => option.value === chosenService);
    if (!exists) return;
    event.preventDefault();
    serviceSelect.value = chosenService;
    serviceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    serviceSelect.classList.add('service-selected');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    contactSection.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth', block: 'start' });
    if (window.location.hash !== '#contato') window.history.replaceState(null, '', '#contato');
  });
});
serviceSelect.addEventListener('change', () => serviceSelect.classList.remove('service-selected'));

// Validação discreta: sem CAPTCHA. Evita entradas claramente inválidas,
// mas aceita nomes curtos, compostos e com acentos. Não é proteção antirrobô infalível.
const nameField = document.getElementById('name');
const detailsField = document.getElementById('details');
const note = document.getElementById('formNote');
const fieldErrors = {
  name: document.getElementById('nameError'),
  details: document.getElementById('detailsError')
};
function setFieldError(field, message) {
  fieldErrors[field.id].textContent = message;
  fieldErrors[field.id].hidden = !message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}
[nameField, detailsField].forEach(field => {
  field.addEventListener('input', () => {
    setFieldError(field, '');
    note.hidden = true;
  });
});
// Caracteres aleatórios, teclas sequenciais e texto repetido.
const looksLikeGibberish = value => {
  const normalized = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const compact = normalized.replace(/[^a-z]/g, '');
  if (/(.)\1{4,}/.test(normalized) || /(asdf|qwer|zxcv|12345|abcde|qazwsx|dasdas)/i.test(normalized)) return true;
  if (compact.length >= 9 && !/[aeiou]/.test(compact)) return true;
  return false;
};
function validateName(name) {
  if (name.length < 2 || !/[\p{L}]/u.test(name)) return 'Informe um nome válido para continuar.';
  if (/[\d@#$%*_=+<>\[\]{}\\/]/.test(name) || !/^[\p{L}\p{M} .'-]+$/u.test(name)) return 'Use um nome válido, sem números ou símbolos.';
  if (name.replace(/[^\p{L}]/gu,'').length < 2 || looksLikeGibberish(name)) return 'Informe um nome válido para continuar.';
  return '';
}
function validateDetails(details) {
  const letters = (details.match(/\p{L}/gu) || []).length;
  if (details.length < 12 || letters < 8 || looksLikeGibberish(details)) return 'Descreva brevemente o serviço que você precisa, com informações válidas.';
  return '';
}

document.getElementById('leadForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = nameField.value.trim().replace(/\s+/g, ' ');
  const service = serviceSelect.value;
  const details = detailsField.value.trim();
  const nameError = validateName(name);
  const detailsError = validateDetails(details);
  setFieldError(nameField, nameError);
  setFieldError(detailsField, detailsError);
  if (nameError || detailsError) {
    (nameError ? nameField : detailsField).focus();
    return;
  }
  // Campo invisível para identificar bots que preencham todos os inputs.
  if (document.getElementById('extraWebsite').value.trim()) return;
  const message = `Olá! Gostaria de solicitar um orçamento à NexaLink Tecnologia.\n\nNome: ${name}\nServiço: ${service}\nDescrição: ${details}`;
  if (/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
    note.hidden = true;
    window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
    return;
  }
  note.textContent = 'Não foi possível abrir o atendimento agora. Tente novamente mais tarde.';
  note.hidden = false;
});
