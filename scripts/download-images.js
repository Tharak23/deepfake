const https = require('https');
const fs = require('fs');
const path = require('path');

// Define the images to download
const images = [
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000',
    filename: 'face-swapping.jpg',
    description: 'Face swapping research image'
  },
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000',
    filename: 'face-animation.jpg',
    description: 'Face animation research image'
  },
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000',
    filename: 'lip-sync.jpg',
    description: 'Lip sync research image'
  },
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000',
    filename: 'talking-avatar.jpg',
    description: 'Talking avatar research image'
  },
  {
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000',
    filename: 'api-sdk.jpg',
    description: 'API and SDK research image'
  }
];

// Create the directory if it doesn't exist
const dir = path.join(__dirname, '../public/images/research');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Download each image
images.forEach(image => {
  const filePath = path.join(dir, image.filename);
  
  https.get(image.url, (response) => {
    const fileStream = fs.createWriteStream(filePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`Downloaded ${image.filename}: ${image.description}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${image.filename}: ${err.message}`);
  });
});

console.log('Image download process started. Check the public/images/research directory for results.'); 