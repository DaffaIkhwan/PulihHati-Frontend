// Test script to check backend connectivity
// Run with: node test-backend-connection.cjs

const https = require('https');
const http = require('http');

const BACKEND_URLS = [
  'https://pulih-hati-backend-obpvpxn7l-daffaikhwans-projects.vercel.app',
  'https://pulih-hati-backend-obpvpxn7l-daffaikhwans-projects.vercel.app/health',
  'https://pulih-hati-backend-obpvpxn7l-daffaikhwans-projects.vercel.app/api',
  'https://pulih-hati-backend.vercel.app',
  'https://pulih-hati-backend.vercel.app/api',
  'https://pulih-hati-backend.vercel.app/api/health',
  'http://localhost:5000',
  'http://localhost:5000/api',
  'http://localhost:5000/api/health'
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    console.log(`\n🔍 Testing: ${url}`);
    
    const req = client.get(url, { timeout: 5000 }, (res) => {
      console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
      console.log(`   Headers:`, res.headers);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (data) {
          console.log(`   Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
        }
        resolve({ url, status: res.statusCode, success: res.statusCode < 400 });
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Error: ${error.message}`);
      resolve({ url, error: error.message, success: false });
    });
    
    req.on('timeout', () => {
      console.log(`   ⏱️ Timeout`);
      req.destroy();
      resolve({ url, error: 'Timeout', success: false });
    });
  });
}

async function main() {
  console.log('🚀 Testing Backend Connectivity');
  console.log('================================');
  
  const results = [];
  
  for (const url of BACKEND_URLS) {
    const result = await testUrl(url);
    results.push(result);
  }
  
  console.log('\n📊 Summary:');
  console.log('===========');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('\n✅ Working URLs:');
    successful.forEach(r => console.log(`   - ${r.url} (${r.status})`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed URLs:');
    failed.forEach(r => console.log(`   - ${r.url} (${r.error || 'Unknown error'})`));
  }
  
  console.log('\n💡 Recommendations:');
  if (successful.some(r => r.url.includes('vercel.app'))) {
    console.log('   - Vercel backend is accessible');
    console.log('   - Use: VITE_API_BASE_URL=https://pulih-hati-backend.vercel.app/api');
  } else if (successful.some(r => r.url.includes('localhost'))) {
    console.log('   - Local backend is accessible');
    console.log('   - Use: VITE_API_BASE_URL=http://localhost:5000/api');
  } else {
    console.log('   - No backend is accessible');
    console.log('   - Check if backend is deployed and running');
    console.log('   - Verify CORS configuration');
  }
}

main().catch(console.error);
