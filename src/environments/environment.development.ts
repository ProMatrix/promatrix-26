export const environment = {
  appVersion: require('../../package.json').version,
  name: 'Development',
  production: false,
  getHelloWorld: 'http://127.0.0.1:5013/demo-promatrix-us/us-central1/helloWorld',
  getUtcDateTime: 'http://127.0.0.1:5013/demo-promatrix-us/us-central1/getUtcDateTime',
  postSendSms: 'http://127.0.0.1:5013/demo-promatrix-us/us-central1/sendSms',
  getAudioFromText: 'http://127.0.0.1:5013/demo-promatrix-us/us-central1/getAudioFromText'
};