
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: '../uploads/' });

app.post('/scan', upload.single('file'), async (req, res) => {
  // Basic demo response
  const report = [
    {
      selector: '.unused-class',
      file: 'theme.css',
      status: 'Unused'
    },
    {
      selector: '.product-card',
      file: 'theme.css',
      status: 'Used'
    }
  ];

  res.json({
    totalRules: 2,
    unusedRules: 1,
    estimatedSavings: '4KB',
    report
  });
});

app.post('/remove', (req, res) => {
  res.json({
    success: true,
    message: 'Selected CSS removed and backup created.'
  });
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
