const https = require('https');

const data = JSON.stringify({
  email: 'admin@marketplace.com',
  password: 'Admin@123'
});

const options = {
  hostname: 'marketplace-app-livid-three.vercel.app',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let responseData = '';
  res.on('data', d => {
    responseData += d;
  });
  res.on('end', () => {
    console.log('Response:', responseData);
    
    // Now try accessing /auth/users with the token
    try {
      const parsed = JSON.parse(responseData);
      if (parsed.token) {
        console.log('Got token, testing /api/auth/users...');
        const userOptions = {
          hostname: 'marketplace-app-livid-three.vercel.app',
          port: 443,
          path: '/api/auth/users',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${parsed.token}`
          }
        };
        const req2 = https.request(userOptions, res2 => {
          console.log(`Users statusCode: ${res2.statusCode}`);
          let uData = '';
          res2.on('data', d => uData += d);
          res2.on('end', () => console.log('Users Response:', uData));
        });
        req2.end();
      }
    } catch (e) {
      console.log('Error parsing JSON');
    }
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
