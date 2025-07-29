import './style.css'

const isProd = import.meta.env.PROD;
const gaId = import.meta.env.VITE_GA_ID;
const form = document.querySelector('form') as HTMLFormElement;

if (isProd) {
  document.querySelector('head')?.prepend(`<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${gaId}');
      </script>`);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault()

  // @ts-ignore
  const submitButton = event.target?.querySelector('button[type=submit]');
  const buttonText = submitButton.querySelector('.button-text');
  const spinner = submitButton.querySelector('.loading-spinner');
  const formData = new FormData(form);
  const url = new URL(`https://${formData.get('host')}`)
  const hasPort = (url.port.length > 0);

  submitButton.disabled = true;
  buttonText.classList.add('hidden');
  spinner.classList.remove('hidden');

  // @ts-ignore
  const response = await fetch(event.target?.action, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // @ts-ignore
    method: event.target?.method, 
    body: JSON.stringify({host: url.hostname, port: hasPort ? parseInt(url.port) : 443})
  }).then(r => {
    submitButton.disabled = false;
    buttonText.classList.remove('hidden');
    spinner.classList.add('hidden');
    return r.json();
  });

  const alertContainer = document.querySelector('.messages');
  const alert = document.createElement('div');
  const alertType = response.status ? "success" : "failure"
  const hostMessage = hasPort ? `${response.host}:${response.port}` : response.host;
  alert.className = `alert ${alertType}`;
  alert.textContent = alertType === 'success'
      ? `${hostMessage} appears to up` 
      : `${hostMessage} appears to down`;
  
  // @ts-ignore
  alertContainer.appendChild(alert);

  setTimeout(() => {
      if (alert.parentNode) {
          alert.style.animation = 'fadeOut 0.3s ease-out forwards';
          setTimeout(() => alert.remove(), 300);
      }
  }, 6000);

});
