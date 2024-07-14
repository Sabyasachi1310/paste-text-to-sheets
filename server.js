const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const app = express();
app.use(bodyParser.json());

const SPREADSHEET_ID = '1G7mh6hfJN_gs5vpRr_J1hMxTZMlcD2lXeBEzWwIJwso';
const SHEET_NAME = 'Sheet1';  // Replace 'Sheet1' with the actual name of your sheet if different

// Load the JSON key file
const keys = require(path.resolve('D:/Download/swift-delight-429407-f5-d8cfadfb159a.json'));

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: keys.client_email,
    private_key: keys.private_key.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.post('/', async (req, res) => {
  const text = req.body.text;
  const sheets = google.sheets({ version: 'v4', auth });
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[text]],
      },
    });
    res.status(200).send('Text added to Google Sheets');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding text to Google Sheets');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
