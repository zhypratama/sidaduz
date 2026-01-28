const express = require('express');
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const pino = require('pino');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // For webhook
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const WEBHOOK_URL = 'http://127.0.0.1:8000/whatsapp/webhook'; // Laravel Webhook

app.use(cors());
app.use(bodyParser.json());

let sock;
let qrCodeData = null;
let isConnected = false;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: ['SIDADU Gateway', 'Chrome', '1.0.0'],
        printQRInTerminal: true,
        authTimeoutMs: 60000,
        connectTimeoutMs: 60000,
        retryRequestOn5xx: true
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('[Status] New QR Code generated');
            qrCodeData = await QRCode.toDataURL(qr);
        }

        if (connection === 'close') {
            const statusCode = (lastDisconnect.error)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log(`[Status] Connection closed. Reason: ${statusCode}, Reconnecting: ${shouldReconnect}`);
            isConnected = false;

            if (shouldReconnect) {
                // Exponential backoff or simple delay to avoid spamming
                console.log('[Status] Retrying connection in 5 seconds...');
                setTimeout(() => connectToWhatsApp(), 5000);
            } else {
                console.log('[Status] Session logged out. Clearing auth folder and generating new QR...');
                qrCodeData = null;

                // Explicitly clear the auth folder to force a new QR
                const authFolder = path.join(__dirname, 'auth_info_baileys');
                if (fs.existsSync(authFolder)) {
                    try {
                        fs.rmSync(authFolder, { recursive: true, force: true });
                        console.log('[Status] Auth folder cleared successfully.');
                    } catch (err) {
                        console.error('[Error] Failed to clear auth folder:', err.message);
                    }
                }

                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('[Status] WhatsApp Connected Successfully!');
            isConnected = true;
            qrCodeData = null;
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // MESSAGE LISTENER (Revised for security & stability)
    sock.ev.on('messages.upsert', async (m) => {
        if (m.type !== 'notify') return;

        for (const msg of m.messages) {
            if (msg.key.fromMe) continue; // Don't respond to own messages

            const sender = msg.key.remoteJid;
            const senderAlt = msg.key.remoteJidAlt;

            // Allow @s.whatsapp.net OR (@lid with valid Alt)
            const isValidUser = (sender && sender.endsWith('@s.whatsapp.net')) ||
                (sender && sender.endsWith('@lid') && senderAlt && senderAlt.endsWith('@s.whatsapp.net'));

            if (!isValidUser) continue;

            const pushName = msg.pushName || 'User';
            const text = msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                msg.message?.imageMessage?.caption ||
                '';

            if (text.trim()) {
                console.log(`[Message] Incoming from ${sender}: ${text}`);
                // Forward to Laravel Webhook (NON-BLOCKING to avoid deadlock)
                const senderJid = msg.key.remoteJidAlt || msg.key.remoteJid;

                axios.post(WEBHOOK_URL, {
                    sender: senderJid.replace('@s.whatsapp.net', ''),
                    message: text,
                    name: pushName
                }, { timeout: 10000 })
                    .then(res => {
                        console.log(`[Status] Webhook forwarded: ${res.status}`);
                    })
                    .catch(webhookError => {
                        console.error('[Error] Webhook Forwarding Failed:', webhookError.message);
                    });
            }
        }
    });
}

connectToWhatsApp();

// --- API ENDPOINTS ---

app.get('/status', (req, res) => {
    res.json({
        connected: isConnected,
        qr: qrCodeData,
        message: isConnected ? 'WhatsApp Connected' : 'Waiting for Scan'
    });
});

app.post('/send', async (req, res) => {
    // If not connected, return error
    if (!isConnected) {
        return res.status(500).json({ status: 'error', message: 'WhatsApp not connected' });
    }

    const { number, message } = req.body;
    if (!number || !message) return res.status(400).json({ status: 'error', message: 'Missing number or message' });

    try {
        let formattedNumber = number.toString().replace(/\D/g, '');
        if (formattedNumber.startsWith('0')) formattedNumber = '62' + formattedNumber.slice(1);
        if (!formattedNumber.endsWith('@s.whatsapp.net')) formattedNumber += '@s.whatsapp.net';

        console.log(`[Sending] To: ${formattedNumber}`);
        await sock.sendMessage(formattedNumber, { text: message });
        res.json({ status: 'success', message: 'Message sent' });
    } catch (error) {
        console.error('[Send Error]', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/logout', async (req, res) => {
    try {
        if (sock) await sock.logout();
        res.json({ status: 'success', message: 'Logged out' });
    } catch (error) {
        console.log('[Status] Logout error, forcing folder cleanup...');
        // Force cleanup if logout fails
        const authFolder = path.join(__dirname, 'auth_info_baileys');
        if (fs.existsSync(authFolder)) {
            try {
                fs.rmSync(authFolder, { recursive: true, force: true });
            } catch (rmError) {
                console.error('[Error] Force cleanup failed:', rmError.message);
            }
        }
        // Restart connection to generate new QR
        connectToWhatsApp();
        res.json({ status: 'success', message: 'Forced logout and session cleared' });
    }
});

app.listen(PORT, () => {
    console.log(`WA Gateway running on http://localhost:${PORT}`);
});
