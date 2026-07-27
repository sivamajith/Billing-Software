require('dotenv').config();
const http = require('http');

const makeRequest = (path, method = 'GET', headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', reject);
    req.end();
  });
};

const test = async () => {
  try {
    console.log('\n🔍 Quick API Test\n');

    // Test health
    console.log('1️⃣ Testing /api/health');
    const health = await makeRequest('/api/health');
    console.log(`Status: ${health.status}`);
    console.log(`Response: ${health.body}\n`);

    // Test plans without auth (should fail with 401)
    console.log('2️⃣ Testing /api/plans (no auth)');
    const plansNoAuth = await makeRequest('/api/plans');
    console.log(`Status: ${plansNoAuth.status}`);
    console.log(`Response: ${plansNoAuth.body.substring(0, 100)}\n`);

    console.log('✅ API is responding\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

test();
