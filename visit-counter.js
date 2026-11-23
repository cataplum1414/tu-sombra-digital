// Paste the deployed Worker's /visit URL here. No browser identifier is sent.
const VISIT_COUNTER_ENDPOINT = '';

const visitCounter = document.querySelector('#visit-counter');
const visitCount = document.querySelector('#visit-count');

if (VISIT_COUNTER_ENDPOINT && visitCounter && visitCount) {
  fetch(VISIT_COUNTER_ENDPOINT, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-store',
    credentials: 'omit',
    referrerPolicy: 'no-referrer'
  })
    .then((response) => {
      if (!response.ok) throw new Error('El contador no está disponible.');
      return response.json();
    })
    .then(({ visits }) => {
      if (!Number.isSafeInteger(visits) || visits < 1) return;
      visitCount.textContent = new Intl.NumberFormat('es-ES').format(visits);
      visitCounter.hidden = false;
    })
    .catch(() => {
      // Keep the story usable if the independent counter is offline.
    });
}
