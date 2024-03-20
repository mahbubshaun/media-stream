const axios = require('axios');

// Replace 'username' and 'password' with your actual credentials
// Replace 'username' and 'password' with your actual credentials
const username = 'shaun';
const password = '123';

// Create a base64-encoded string of the credentials
console.log(username);
const credentials = Buffer.from(`${username}:${password}`).toString('base64');

console.log(credentials);

axios.get('https://310c-103-145-74-131.ngrok-free.app/media_stream/', {
        headers: {
            'Authorization': `Basic ${credentials}`,
        },
    }).then(response => {
        console.log('data:', response.data)
    });

