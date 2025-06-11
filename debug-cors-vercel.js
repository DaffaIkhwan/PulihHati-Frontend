// Debug CORS di Vercel - Jalankan di Browser Console
// Copy paste script ini ke browser console di Vercel deployment

console.log('🔍 CORS Debug Script for Vercel');
console.log('================================');

// Info current environment
console.log('📍 Current URL:', window.location.href);
console.log('📍 Current Origin:', window.location.origin);
console.log('📍 User Agent:', navigator.userAgent);

const BACKEND_URL = 'https://pulih-hati-backend-production.up.railway.app';

async function testCORS() {
  console.log('\n🧪 Testing CORS Connection...');
  
  // Test 1: Simple GET request
  console.log('\n1️⃣ Testing simple GET request...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ Simple GET Success:', response.status, response.statusText);
    const data = await response.json();
    console.log('📦 Response data:', data);
  } catch (error) {
    console.error('❌ Simple GET Failed:', error.message);
    console.error('🔍 Error details:', error);
  }
  
  // Test 2: GET with credentials
  console.log('\n2️⃣ Testing GET with credentials...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ GET with credentials Success:', response.status, response.statusText);
    const data = await response.json();
    console.log('📦 Response data:', data);
  } catch (error) {
    console.error('❌ GET with credentials Failed:', error.message);
    console.error('🔍 Error details:', error);
  }
  
  // Test 3: OPTIONS preflight
  console.log('\n3️⃣ Testing OPTIONS preflight...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/safespace/posts/public`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('✅ OPTIONS Success:', response.status, response.statusText);
    console.log('📦 CORS Headers:');
    console.log('  - Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('  - Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('  - Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
    console.log('  - Access-Control-Allow-Credentials:', response.headers.get('Access-Control-Allow-Credentials'));
  } catch (error) {
    console.error('❌ OPTIONS Failed:', error.message);
    console.error('🔍 Error details:', error);
  }
  
  // Test 4: Actual API call
  console.log('\n4️⃣ Testing actual API call...');
  try {
    const response = await fetch(`${BACKEND_URL}/api/safespace/posts/public?limit=3`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      console.log('✅ API call Success:', response.status, response.statusText);
      const data = await response.json();
      console.log('📦 API Response:', data);
    } else {
      console.error('❌ API call Failed:', response.status, response.statusText);
      const text = await response.text();
      console.error('📦 Error response:', text);
    }
  } catch (error) {
    console.error('❌ API call Failed:', error.message);
    console.error('🔍 Error details:', error);
  }
}

// Auto-run test
testCORS();

// Make function available globally
window.testCORS = testCORS;
console.log('\n💡 You can run testCORS() again anytime');
