// adress.ts
const host = window.location.hostname;
const adress = {
  adress: 'ws://${host}:8000/',
  http: 'http://${host}:8000/'
};

export default adress;