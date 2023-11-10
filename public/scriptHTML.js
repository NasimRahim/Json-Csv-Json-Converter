//function dalam html

//start sini

// Function to remove empty arrays within arrays
function removeEmptyArrays(jsonData) {
    if (Array.isArray(jsonData)) {
        jsonData = jsonData.filter(item => {
          if (Array.isArray(item)) {
            return item.length > 0 || item.some(subItem => Array.isArray(subItem) && subItem.length > 0);
          }
          return item;
        });
        for (let i = 0; i < jsonData.length; i++) {
          jsonData[i] = removeEmptyArrays(jsonData[i]);
        }
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        for (let key in jsonData) {
          jsonData[key] = removeEmptyArrays(jsonData[key]);
        }
      }
      return jsonData;
}

// Function to recursively replace "true" and "false" with true and false (case-insensitive) and change str into null value
function replaceBoolValues(obj) {
    if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
          if (typeof obj[key] === 'string') {
            const lowerCaseValue = obj[key].toLowerCase();
            if (lowerCaseValue === 'true.b') {
              obj[key] = true;
            } else if (lowerCaseValue === 'false.b') {
              obj[key] = false;
            }
            if (lowerCaseValue === 'null') {
              obj[key] = null;
            }
          } else {
            replaceBoolValues(obj[key]);
          }
        }
      } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          replaceBoolValues(obj[i]);
        }
      }
}

// Function to convert values ending with ".int" to integers
function convertValuesToInt(data) {
    if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
          return data.map(item => convertValuesToInt(item));
        } else {
          let newData = {};
          for (let key in data) {
            newData[key] = convertValuesToInt(data[key]);
          }
          return newData;
        }
      } else if (typeof data === 'string' && data.endsWith('.int')) {
        try {
          return parseInt(data.slice(0, -4));
        } catch (error) {
          return data;
        }
      } else {
        return data;
      }
}

// Function to replace empty lists with an empty list
function replaceEmptyListWithEmptyList(data) {
    if (Array.isArray(data)) {
        if (data.every(item => Array.isArray(item) && item.length === 0)) {
          return [];
        }
        for (let i = 0; i < data.length; i++) {
          data[i] = replaceEmptyListWithEmptyList(data[i]);
        }
      } else if (typeof data === 'object' && data !== null) {
        for (let key in data) {
          data[key] = replaceEmptyListWithEmptyList(data[key]);
        }
      }
      return data;
}

// Function to split strings with semicolons into multiple strings
function splitStringWithSemicolon(data) {
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] === 'string' && data[i].includes(';')) {
            data.splice(i, 1, ...data[i].split(';'));
          } else {
            splitStringWithSemicolon(data[i]);
          }
        }
      } else if (typeof data === 'object' && data !== null) {
        for (let key in data) {
          data[key] = splitStringWithSemicolon(data[key]);
        }
      }
      return data;
}

// Function for converting CSV to JSON
function convertCSVToJSON() {
  const fileInput = document.getElementById('csvFileInput');
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const csvData = event.target.result;

    Papa.parse(csvData, {
      header: true,
      complete: function (results) {
        const rows = results.data;
        const jsonDataArray = [];

        rows.forEach(row => {
          if (Object.values(row).some(value => value !== '')) {
            const jsonData = {};

            for (const key in row) {
              const keys = key.split('.');
              let current = jsonData;

              for (let i = 0; i < keys.length; i++) {
                const field = keys[i];
                const next = keys[i + 1];

                if (next) {
                  if (!current[field]) {
                    current[field] = next.match(/^\d+$/) ? [] : {};
                  }
                  current = current[field];
                } else {
                  if (field.endsWith('Code') || field === 'isPoliceCase' || field === 'internalReferral') {
                    current[field] = row[key].toString();
                  } else {
                    current[field] = row[key];
                  }
                }
              }
            }

            jsonDataArray.push(jsonData);
          }
        });

        const jsonDataString = JSON.stringify(jsonDataArray, null, 2);

        let data;
        try {
          data = JSON.parse(jsonDataString);

          // Function 1: removeEmptyArrays
          data = removeEmptyArrays(data);

          // Function 2: replaceBoolValues
          replaceBoolValues(data);

          // Function 3: convertValuesToInt
          data = convertValuesToInt(data);

          // Function 4: replaceEmptyListWithEmptyList
          data = replaceEmptyListWithEmptyList(data);

          // Function 5: splitStringWithSemicolon
          data = splitStringWithSemicolon(data);

          // Convert back to string
          const updatedJsonDataString = JSON.stringify(data, null, 2);

          const blob = new Blob([updatedJsonDataString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'update.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err) {
          console.log("Error parsing JSON data:", err);
        }
      }
    });
  };

  reader.readAsText(file);
}
//habis sini

//FUNCTION FOR DOWNLOAD
/*
function convertCSVToJSON1() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvData = event.target.result;

        Papa.parse(csvData, {
            header: true,
            complete: function (results) {
                const rows = results.data;
                const jsonDataArray = [];

                rows.forEach(row => {
                    if (Object.values(row).some(value => value !== '')) {
                        const jsonData = {};

                    for (const key in row) {
                        const keys = key.split('.');
                        let current = jsonData;

                        for (let i = 0; i < keys.length; i++) {
                            const field = keys[i];
                            const next = keys[i + 1];

                            if (next) {
                                if (!current[field]) {
                                    current[field] = next.match(/^\d+$/) ? [] : {};
                                }
                                current = current[field];
                            } else {
                                if (field.endsWith('Code') || field === 'isPoliceCase' || field === 'internalReferral') {
                                    current[field] = row[key].toString();
                                } else {
                                    current[field] = row[key];
                                }
                            }
                        }
                    }

                    jsonDataArray.push(jsonData); 
                }
                });

                const jsonDataString = JSON.stringify(jsonDataArray, null, 2);
                const blob = new Blob([jsonDataString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'update.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        });
    };

    reader.readAsText(file);
}
*/

//FUNCTION FOR DISPLAY OUTPUT
//FUNCTION FOR DISPLAY OUTPUT
function convertDisplay() {
    const fileInput = document.getElementById('csvFileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csvData = event.target.result;

        Papa.parse(csvData, {
            header: true,
            complete: function (results) {
                const rows = results.data;
                const jsonDataArray = [];

                rows.forEach(row => {
                    if (Object.values(row).some(value => value !== '')) {
                        const jsonData = {};

                        for (const key in row) {
                            const keys = key.split('.');
                            let current = jsonData;

                            for (let i = 0; i < keys.length; i++) {
                                const field = keys[i];
                                const next = keys[i + 1];

                                if (next) {
                                    if (!current[field]) {
                                        current[field] = next.match(/^\d+$/) ? [] : {};
                                    }
                                    current = current[field];
                                } else {
                                    if (field.endsWith('Code') || field === 'isPoliceCase' || field === 'internalReferral') {
                                        current[field] = row[key].toString();
                                    } else {
                                        current[field] = row[key];
                                    }
                                }
                            }
                        }

                        jsonDataArray.push(jsonData);
                    }
                });

                let data;
                try {
                    data = jsonDataArray;

                    // Apply the same set of data manipulation functions here

                    // Function 1: removeEmptyArrays
                    data = removeEmptyArrays(data);

                    // Function 2: replaceBoolValues
                    replaceBoolValues(data);

                    // Function 3: convertValuesToInt
                    data = convertValuesToInt(data);

                    // Function 4: replaceEmptyListWithEmptyList
                    data = replaceEmptyListWithEmptyList(data);

                    // Function 5: splitStringWithSemicolon
                    data = splitStringWithSemicolon(data);

                    // Display the updated JSON data
                    document.getElementById('jsonOutput').innerText = JSON.stringify(data, null, 2);
                } catch (err) {
                    console.log("Error parsing JSON data:", err);
                }
            }
        });
    };

    reader.readAsText(file);
}

//
//
//FUNCTION FOR TEMPLATE CSV

function flattenJson(jsonData, parentKey = '', separator = '.') {
    let items = {};
    if (typeof jsonData === 'object') {
        if (Array.isArray(jsonData)) {
            jsonData.forEach((item, index) => {
                const newKey = parentKey ? `${parentKey}${separator}${index}` : index.toString();
                if (typeof item === 'object') {
                    Object.assign(items, flattenJson(item, newKey, separator));
                } else {
                    if (typeof item === 'boolean') {
                        item = `${item}.B`;
                    } else if (Number.isInteger(item)) {
                        item = `${item}.int`;
                    }
                    items[newKey] = item !== null ? item : '';
                }
            });
            if (jsonData.length === 0) {
                const newKey = parentKey ? `${parentKey}${separator}0` : '0';
                items[newKey] = '';
            }
        } else {
            Object.entries(jsonData).forEach(([key, value]) => {
                const newKey = parentKey ? `${parentKey}${separator}${key}` : key;
                if (typeof value === 'object') {
                    Object.assign(items, flattenJson(value, newKey, separator));
                } else {
                    if (typeof value === 'boolean') {
                        value = `${value}.B`;
                    } else if (Number.isInteger(value)) {
                        value = `${value}.int`;
                    }
                    items[newKey] = value !== null ? value : '';
                }
            });
        }
    }
    return items;
}

function convertJSONtoCSV() {
    const fileInput = document.getElementById('input');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const jsonData = event.target.result;
        const data = JSON.parse(jsonData);
        if (!Array.isArray(data) || data.length === 0) {
            console.log('JSON data is not in the expected format.');
            return;
        }
        const headerData = data.reduce((acc, item) => {
            const flattenedItem = flattenJson(item);
            return { ...acc, ...flattenedItem };
        }, {});

        const csvContent = [];
        csvContent.push(Object.keys(headerData).join(','));

        data.forEach((item) => {
            const flattenedItem = flattenJson(item);
            const values = Object.keys(headerData).map(key => flattenedItem[key] || '');
            csvContent.push(values.join(','));
        });

        const csvData = csvContent.join('\n');
        const link = document.createElement('a');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    reader.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
    };

    if (file) {
        reader.readAsText(file);
    }
}


// FUNCTION FOR DISPLAY FILE LIST
// CSV FILE ONLY
//
function getFileList() {
  fetch('/files')
  .then(response => response.json())
  .then(data => {
      const fileList = data.files;
      const fileContainer = document.getElementById('fileContainer');
      fileList.forEach(fileName => {
          const fileLink = document.createElement('a');
          fileLink.href = '/downloadcsv?fileName=' + fileName;
          fileLink.textContent = fileName;
          fileContainer.appendChild(fileLink);
          fileContainer.appendChild(document.createElement('br'));
      });
  })
  .catch(error => console.error('Error:', error));
}


// FUNCTION FOR DISPLAY FILE LIST
// json FILE ONLY
//
function JsongetFileList() {
  fetch('/filesJson')
  .then(response => response.json())
  .then(data => {
      const fileList = data.files;
      const fileContainer = document.getElementById('fileContainer1');
      fileList.forEach(fileName => {
          const fileLink = document.createElement('a');
          fileLink.href = '/downloadjson?fileName=' + fileName;
          fileLink.textContent = fileName;
          fileContainer.appendChild(fileLink);
          fileContainer.appendChild(document.createElement('br'));
      });
  })
  .catch(error => console.error('Error:', error));
}

// clear list untuk database csv and json
//
//
function clearFileList() {
  const fileContainer1 = document.getElementById('fileContainer');
  const fileContainer2 = document.getElementById('fileContainer1');

  if (fileContainer1) {
      fileContainer1.innerHTML = '';
  }

  if (fileContainer2) {
      fileContainer2.innerHTML = '';
  }
}