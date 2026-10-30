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

document.getElementById('leadForm').addEventListener('submit', async event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const service = document.getElementById('type').value;
  const details = document.getElementById('details').value.trim();
  if (!name || !details) return;
  const message = `Olá! Gostaria de solicitar um orçamento à NexaLink Tecnologia.\n\nNome: ${name}\nServiço: ${service}\nDescrição: ${details}`;
  const note = document.getElementById('formNote');
  if (/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    note.textContent = 'O WhatsApp será aberto com a mensagem preparada. Confira e envie.';
    return;
  }
  try {
    await navigator.clipboard.writeText(message);
    note.textContent = 'Mensagem copiada! Configure o número comercial em script.js para ativar o WhatsApp.';
  } catch {
    note.textContent = 'WhatsApp ainda não configurado. Entre em contato com a NexaLink por seu canal comercial.';
  }
});
