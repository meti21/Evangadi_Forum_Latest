const http = require('http');

// Test if the server is running
function testServer() {
  const port = process.env.PORT || 2112;
  const host = 'localhost';
  
  const options = {
    hostname: host,
    port: port,
    path: '/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`Server responded with status: ${res.statusCode}`);
    if (res.statusCode === 200) {
      console.log('✅ Server is running correctly!');
      process.exit(0);
    } else {
      console.log('❌ Server responded but with wrong status code');
      process.exit(1);
    }
  });

  req.on('error', (err) => {
    console.log('❌ Server test failed:', err.message);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.log('❌ Server test timed out');
    req.destroy();
    process.exit(1);
  });

  req.end();
}

// Wait a bit for server to start, then test
setTimeout(testServer, 3000); 