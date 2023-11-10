const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const jsonfile = require('jsonfile');
const fs = require('fs');
const multer = require('multer');




// Serve static files from the 'public' directory
app.use(express.static('public'));

//download json
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'public', '1.json');
  res.download(filePath, 'update.json');
});

//get files from directory  for csv
app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, 'template', 'csv-folder',);
  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          res.status(404).send('Directory not found!');
      } else {
          res.json({ files });
      }
  });
});


//download files CSV from the directory DATABASE ONE
app.get('/downloadcsv', (req, res) => {
  const fileName = req.query.fileName;
  const filePath = path.join(__dirname, 'template', 'csv-folder', fileName);
  res.download(filePath, fileName);
});


//get file for JSON
app.get('/filesJson', (req, res) => {
  const directoryPath = path.join(__dirname, 'template', 'json-folder',);
  fs.readdir(directoryPath, (err, files) => {
      if (err) {
          res.status(404).send('Directory not found!');
      } else {
          res.json({ files });
      }
  });
});

//download files json from the directory DATABASE ONE
app.get('/downloadjson', (req, res) => {
  const fileName = req.query.fileName;
  const filePath = path.join(__dirname, 'template', 'json-folder', fileName);
  res.download(filePath, fileName);
});


//port to the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

