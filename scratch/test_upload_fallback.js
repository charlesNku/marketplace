const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

async function testUpload() {
    try {
        console.log('Logging in as admin...');
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@marketplace.com',
                password: 'Admin@123'
            })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);

        const token = loginData.token;
        console.log('Login successful.');

        console.log('Preparing upload...');
        const formData = new FormData();
        const blob = new Blob(['dummy image data'], { type: 'image/jpeg' });
        formData.append('image', blob, 'test-image.jpg');

        console.log('Sending upload request...');
        const uploadRes = await fetch(`${BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const uploadData = await uploadRes.json();
        console.log('Upload Response:', uploadData);

        if (uploadRes.status === 200 && uploadData.imageUrl.startsWith('/api/uploads/')) {
            console.log('✅ Fallback successful! Image saved to local storage.');
        } else {
            console.log('❓ Result:', uploadData);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testUpload();
