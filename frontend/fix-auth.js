// Run this script to clear authentication and fix admin panel
// Usage: node fix-auth.js

console.log('🔧 Fixing authentication issues...\n');

const fs = require('fs');
const path = require('path');

// Create a simple HTML file that auto-clears auth
const fixHtml = `<!DOCTYPE html>
<html>
<head>
    <title>Fixing Auth...</title>
    <meta http-equiv="refresh" content="0;url=/admin/login">
</head>
<body>
    <h1>Clearing authentication...</h1>
    <script>
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
            window.location.href = '/admin/login';
        }, 100);
    </script>
</body>
</html>`;

const publicDir = path.join(__dirname, 'public');
const fixPath = path.join(publicDir, 'fix.html');

try {
    fs.writeFileSync(fixPath, fixHtml);
    console.log('✅ Created fix.html');
    console.log('\n📍 Open this URL in your browser:');
    console.log('   http://localhost:5173/fix.html');
    console.log('\n   It will automatically:');
    console.log('   1. Clear all authentication data');
    console.log('   2. Redirect to admin login');
    console.log('   3. You can then login with fresh credentials\n');
} catch (error) {
    console.error('❌ Error:', error.message);
}
