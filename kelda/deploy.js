const kelda = require('kelda');

const vm = new kelda.Machine({ provider: 'Amazon' });
const infrastructure = new kelda.Infrastructure({ masters: vm, workers: vm });

const website = new kelda.Container({ name: 'website', image: 'luise/kelda.io' });
kelda.allowTraffic(kelda.publicInternet, website, 80);

website.deploy(infrastructure);
