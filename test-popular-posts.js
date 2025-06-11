// Test script to check popular posts API call

// Test popular posts endpoint
async function testPopularPosts() {
  console.log('\n🧪 Testing Popular Posts API...');

  const baseUrl = 'http://localhost:5000/api';
  console.log('Base URL:', baseUrl);
  
  // Test endpoints
  const endpoints = [
    `${baseUrl}/safespace/posts/public?limit=10`,
    `${baseUrl}/safespace/posts?limit=10`,
    `${baseUrl}/safespace/test`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   Response type: ${typeof data}`);
        console.log(`   Has posts: ${data.posts ? 'Yes' : 'No'}`);
        if (data.posts) {
          console.log(`   Posts count: ${data.posts.length}`);
          if (data.posts.length > 0) {
            console.log(`   First post: ${data.posts[0].content?.substring(0, 50)}...`);
          }
        }
      } else {
        const errorText = await response.text();
        console.log(`   Error: ${errorText}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
}

// Run test
testPopularPosts().catch(console.error);
