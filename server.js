require('dotenv').config();
const express = require('express');
const path = require('path');
const { Resend } = require('resend');

const app = express();
const port = Number(process.env.PORT || 3000);
const restaurantEmail = process.env.RESTAURANT_EMAIL || 'hello@elgrito.ie';
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'El Grito service is running.' });
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, message } = req.body || {};

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        ok: false,
        message: 'Please complete all required fields.'
      });
    }

    const safeGuestCount = Number(guests);
    const reservation = {
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      date: String(date),
      time: String(time),
      guests: Number.isFinite(safeGuestCount) ? safeGuestCount : 1,
      message: String(message || '').trim()
    };

    const emailBody = `
New reservation request for El Grito

Name: ${reservation.name}
Email: ${reservation.email}
Phone: ${reservation.phone}
Date: ${reservation.date}
Time: ${reservation.time}
Guests: ${reservation.guests}

Message: ${reservation.message || 'No additional notes'}
`.trim();

    if (resend && restaurantEmail) {
      await resend.emails.send({
        from: 'El Grito <no-reply@elgrito.ie>',
        to: [restaurantEmail],
        subject: `New table booking request for ${reservation.date}`,
        text: emailBody
      });
    } else {
      console.log('Reservation email not sent: RESEND_API_KEY missing.');
      console.log(emailBody);
    }

    return res.status(200).json({
      ok: true,
      message: 'Reservation received successfully.'
    });
  } catch (error) {
    console.error('Reservation processing error:', error);
    return res.status(500).json({
      ok: false,
      message: 'Unable to process your reservation right now. Please try again.'
    });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`El Grito server running on http://localhost:${port}`);
});
