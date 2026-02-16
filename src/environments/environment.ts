export const environment = {
  appVersion: require('../../package.json').version,
  name: 'Development',
  production: false,
  getHelloWorld: 'http://localhost:5000/promatrix-us/us-central1/helloWorld',
  getUtcDateTime: 'http://localhost:5000/promatrix-us/us-central1/getUtcDateTime',
  postSendSms: 'http://localhost:5000/promatrix-us/us-central1/sendSms',
  getAudioFromText: 'http://localhost:5000/promatrix-us/us-central1/getAudioFromText'
};