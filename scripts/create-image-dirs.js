const fs = require('fs');
const path = require('path');

// Define the directories to create
const directories = [
  'public/images/research',
  'public/images/blog',
  'public/images/team',
  'public/images/projects',
  'public/images/ui'
];

// Create each directory
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  } else {
    console.log(`Directory already exists: ${fullPath}`);
  }
});

// Verify directories
console.log('\nVerifying directories:');
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  const exists = fs.existsSync(fullPath);
  console.log(`${dir}: ${exists ? '✅ Exists' : '❌ Missing'}`);
});

console.log('\nImage directory structure created successfully!');
console.log('\nYou can now place your images in the following directories:');
directories.forEach(dir => {
  console.log(`- ${dir}`);
}); 