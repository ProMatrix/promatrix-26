const os = require('os');
const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const nodemailer = require('nodemailer');

const contactRecipient = process.env.CONTACT_RECIPIENT || 'admin@promatrixinc.com';

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

// Builds an SMTP transport from environment variables; returns null when unconfigured.
function createMailTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  // Port 465 uses implicit TLS (secure=true); 587/25 use STARTTLS (secure=false).
  // Honor an explicit true/false, otherwise derive from the port so loose values (e.g. "StartTLS") don't misconfigure TLS.
  const secureRaw = String(process.env.SMTP_SECURE ?? '').trim().toLowerCase();
  const secure = secureRaw === 'true' ? true : secureRaw === 'false' ? false : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    greetingTimeout: 15000,
    connectionTimeout: 15000,
  });
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

exports.sendSmtp = onRequest(functionOptions, async (req, res) => {
  if (applyCors(req, res)) {
    return;
  }

  const emailAddress = typeof req.body?.emailAddress === 'string' ? req.body.emailAddress.trim() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!emailAddress || !message) {
    res.status(400).json({
      ...createStatus('invalid'),
      message: 'Both emailAddress and message are required.',
    });
    return;
  }

  const transport = createMailTransport();
  if (!transport) {
    logger.error('sendSmtp is missing SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS).');
    res.status(500).json({
      ...createStatus('error'),
      message: 'Email transport is not configured.',
    });
    return;
  }

  // The contact field may hold an email or a phone number; only use it as replyTo when it is an email.
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
  const safeMessage = message.slice(0, 1000);

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: contactRecipient,
      replyTo: isEmail ? emailAddress : undefined,
      subject: 'New ProMatrix contact message',
      text: [
        'A new message was submitted from the ProMatrix contact form.',
        '',
        `Contact: ${emailAddress}`,
        '',
        'Message:',
        safeMessage,
      ].join('\n'),
    });

    logger.info('sendSmtp delivered the contact email.', { isEmail });
    res.json(createStatus('sent'));
  } catch (error) {
    logger.error('sendSmtp failed to deliver the contact email.', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    const body = {
      ...createStatus('error'),
      message: 'Failed to send the contact email.',
    };
    // Surface the underlying reason only in the local emulator, never in production.
    if (process.env.FUNCTIONS_EMULATOR === 'true') {
      body.reason = error.message;
      body.code = error.code;
    }
    res.status(500).json(body);
  }
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