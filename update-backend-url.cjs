// Script untuk update backend URL di .env
// Usage: node update-backend-url.cjs https://your-railway-url.up.railway.app

const fs = require('fs');
const path = require('path');

const newBackendUrl = process.argv[2];

if (!newBackendUrl) {
  console.log('❌ Error: Please provide backend URL');
  console.log('Usage: node update-backend-url.cjs https://your-backend-url.com');
  process.exit(1);
}

// Validate URL
try {
  new URL(newBackendUrl);
} catch (error) {
  console.log('❌ Error: Invalid URL format');
  process.exit(1);
}

const envPath = path.join(__dirname, '.env');

try {
  // Read current .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update the VITE_API_BASE_URL line
  const apiUrl = newBackendUrl.endsWith('/') ? newBackendUrl + 'api' : newBackendUrl + '/api';
  
  // Replace the active VITE_API_BASE_URL line
  envContent = envContent.replace(
    /^VITE_API_BASE_URL=.*$/m,
    `VITE_API_BASE_URL=${apiUrl}`
  );
  
  // Comment out localhost line if it's active
  envContent = envContent.replace(
    /^VITE_API_BASE_URL=http:\/\/localhost:5000\/api$/m,
    '# VITE_API_BASE_URL=http://localhost:5000/api'
  );
  
  // Write back to file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Successfully updated .env file!');
  console.log(`🔗 Backend URL: ${apiUrl}`);
  console.log('🚀 You can now restart your frontend development server');
  console.log('📝 Run: npm run dev');
  
} catch (error) {
  console.log('❌ Error updating .env file:', error.message);
  process.exit(1);
}
