const fs = require('fs');
const { google } = require('googleapis');

const apikeys = require('./apikeys.json');
const SCOPE = ['https://www.googleapis.com/auth/drive.file']; // Use 'drive.file' to have more limited scope

// A Function that can provide access to google drive api
async function authorize(){
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}

// A Function that will upload the desired file to google drive folder
async function uploadFile(authClient, filePath, fileName){
    return new Promise((resolve, reject) => {
        const drive = google.drive({version:'v3', auth: authClient}); 

        const fileMetaData = {
            name: fileName,
            parents: ['1asUnKv5d9aMChPnmf7HFdqmvP0RoBnAe'] // A folder ID to which file will get uploaded
        };

        const media = {
            mimeType: 'image/jpeg', // Adjust MIME type if needed
            body: fs.createReadStream(filePath),
        };

        drive.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        }, (error, file) => {
            if (error) {
                return reject(error);
            }
            drive.permissions.create({
                fileId: file.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            }).then(() => {
                drive.files.get({
                    fileId: file.data.id,
                    fields: 'webViewLink'
                }).then(response => {
                    resolve(response.data.webViewLink);
                }).catch(reject);
            }).catch(reject);
        });
    });
}

module.exports = { authorize, uploadFile };
