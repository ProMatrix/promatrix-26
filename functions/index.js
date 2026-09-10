const os = require('os');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');

const functionOptions = {
  region: 'us-central1',
  invoker: 'public',
};

function createStatus(status = 'ok') {
  return {
    status,
    timeAndDate: new Date().toISOString(),
    machineName: process.env.K_SERVICE || os.hostname(),
  };
}

function applyCors(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return true;
  }

  return false;
}

exports.helloWorld = onRequest(functionOptions, (req, res) => {
  if (applyCors(req, res)) {
    return;
  }

  res.json({
    ...createStatus(),
    message: 'Hello from ProMatrix Firebase Functions.',
  });
});

exports.getUtcDateTime = onRequest(functionOptions, (req, res) => {
  if (applyCors(req, res)) {
    return;
  }

  res.json(createStatus());
});

exports.sendSms = onRequest(functionOptions, (req, res) => {
  if (applyCors(req, res)) {
    return;
  }

  logger.info('Local sendSms request received.', {
    hasEmailAddress: Boolean(req.body?.emailAddress),
    hasMessage: Boolean(req.body?.message),
  });

  res.json(createStatus('queued'));
});

exports.getAudioFromText = onRequest(functionOptions, (req, res) => {
  if (applyCors(req, res)) {
    return;
  }

  res.status(501).json({
    ...createStatus('not-implemented'),
    message: 'Text-to-audio generation is not implemented in the local Firebase emulator yet.',
  });
});