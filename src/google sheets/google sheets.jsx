import { gapi } from 'gapi-script';
import creds from '../config.jsx'
import firebase_functions from '../firebase/activities.jsx';

async function listMajors() {
  var spreadsheetId = '1DUVlg_IkZ9PcjY6pNuspFzmCzAGHAXaAZ8FVjSiG4zs'
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?key=${creds.api_key}`)
    .then(response => response.json())
    .then(data => console.log(data.values))
    .catch(error => console.error('Error:', error));
}

async function drive_setup(email, habits) {
  return new Promise(async (resolve, reject) => {
    var accessToken = await window.getToken();
    var folder_data = null
    var file_data = null
    // Create the new folder
    fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        name: "Live Life Love",
        mimeType: 'application/vnd.google-apps.folder',
      }),
    })
      .then((response) => response.json())
      .then(async (folderData) => {
        const folderId = folderData.id;
        console.log("created folder:", folderData.id)
        //Creating the file
        var file_name = "Vivir Vida Amor"
        fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({

            name: file_name,
            mimeType: 'application/vnd.google-apps.spreadsheet',
            parents: [folderId], // Use parents property for folder ID
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Spreadsheet created:', data);
            console.log(folderData, data)
            folder_data = folderData
            file_data = data
            //Storing data
            localStorage.setItem('file_id', data.id)
            firebase_functions.update_user_documents(email, [folderData, data])

            //Add the various sheets
            fetch(`https://sheets.googleapis.com/v4/spreadsheets/${data.id}:batchUpdate`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', },
              body: JSON.stringify({
                requests: [{ addSheet: { properties: { title: 'Log', }, }, }, { addSheet: { properties: { title: 'Main', }, }, },],
              }),
            })
              .then((response) => response.json())
              .then((updateData) => {
                console.log('Extra sheets added:', updateData);
                //Write habits to the habits sheet
                fetch(`https://sheets.googleapis.com/v4/spreadsheets/${data.id}/values/${"Sheet1!A1:Z1"}:append?valueInputOption=USER_ENTERED`, {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', },
                  body: JSON.stringify({ values: [habits] }),
                })
                  .then((response) => response.json())
                  .then((data) => { console.log('Formating complete:', data); localStorage.setItem('habits', JSON.stringify(["Date", "Time", ...habits])); resolve(true) })
                  .catch((error) => { console.error('Error appending data:', error); });
              })
              .catch((error) => {
                console.error('Error adding sheets:', error);
              });
          })
          .catch((error) => {
            console.error('Error creating spreadsheet:', error);
            reject('Error creating the spreadsheet')
          })

      })
      .catch((error) => {
        console.error('Error creating folder:', error);
      })


  })
}

function log_entry(file_id, log) {
  return new Promise(async (resolve, reject) => {
    //Write habits to the habits sheet
    var accessToken = await window.getToken();
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${file_id}/values/${"Log!A:Z"}:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', },
      body: JSON.stringify({ values: [log] }),
    })
      .then((response) => response.json())
      .then((data) => { console.log('Entry log made', data); resolve(true) })
      .catch((error) => { console.error('Error while making entry log', error); reject(false) });
  })
}

function habits_entry(file_id, range, data) {
  return new Promise(async (resolve, reject) => {
    //Write habits to the habits sheet
    var accessToken = await window.getToken();
    console.log(range)
    if (range == null) {
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${file_id}/values/${"Sheet1!A:Z"}:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', },
        body: JSON.stringify({ values: [data] }),
      })
        .then((response) => response.json())
        .then((data) => { console.log('First Entry habit made', data); resolve(data.updates) })
        .catch((error) => { console.error('Error while making entry habits', error); reject(false) });
    } else {

      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${file_id}/values/${range}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', },
        body: JSON.stringify({ values: [data] }),
      })
        .then((response) => response.json())
        .then((data) => { console.log('Entry habit made', data); resolve(data) })
        .catch((error) => { console.error('Error while making entry habits', error); reject(false) });
    }

  })
}


function read_habits(doc_id) {
  return new Promise(async (resolve, reject) => {

    var accessToken = await window.getToken();
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${doc_id}/values/${"Sheet1!A1:Z1"}?valueRenderOption=FORMATTED_VALUE`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log('Habits', data);
        resolve(data.values)
      })
      .catch((error) => {
        console.error('Error querying spreadsheet data:', error);
      });


  })
}


async function create_sheet_file(folderId) {
  var accessToken = await window.getToken();
  var file_name = "Vivir Vida Amor"
  fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({

      name: file_name,
      mimeType: 'application/vnd.google-apps.spreadsheet',
      parents: [folderId] // Use parents property for folder ID
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Spreadsheet created:', data);
      return data
    })
    .catch((error) => {
      console.error('Error creating spreadsheet:', error);
    })
}


async function get_data() {
  var doc_id = "1uCNQOdPVkUTLJCbTxCpm2wvFaq0zIjQG3GlGknszDxo"
  var accessToken = await window.getToken();
  // Use the access token to query data from the spreadsheet
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${doc_id}/values/${"Sheet1!A:Z"}?valueRenderOption=FORMATTED_VALUE`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Spreadsheet data:', data);
    })
    .catch((error) => {
      console.error('Error querying spreadsheet data:', error);
    });
}


const sheets = { listMajors, drive_setup, read_habits, log_entry, get_data, habits_entry }
export default sheets