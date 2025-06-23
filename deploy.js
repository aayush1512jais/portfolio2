import fs from 'fs';
import path from 'path';

/**
 * Deployment script for custom domains
 * 
 * Usage:
 * 1. Add "homepage": "https://yourdomain.com" to package.json
 * 2. Run: node deploy.js
 * 3. Build with: npm run build
 * 4. Deploy the dist folder to your hosting provider
 */

function updatePackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    if (!packageJson.homepage) {
      console.log('📝 Adding homepage field to package.json...');
      console.log('Please specify your domain when ready.');
      console.log('Example: "homepage": "https://yourdomain.com"');
      
      // Add example homepage field (commented)
      packageJson._homepage_example = "https://yourdomain.com";
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Package.json updated with example homepage field');
    } else {
      console.log(`✅ Homepage field found: ${packageJson.homepage}`);
      console.log('🚀 Ready for deployment!');
      console.log('Run: npm run build');
    }
    
    // Add deployment scripts if they don't exist
    if (!packageJson.scripts['prepare-deploy']) {
      packageJson.scripts['prepare-deploy'] = 'node deploy.js';
      packageJson.scripts['build:deploy'] = 'npm run prepare-deploy && npm run build';
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Added deployment scripts to package.json');
    }
    
  } catch (error) {
    console.error('❌ Error updating package.json:', error.message);
    process.exit(1);
  }
}

function createDeploymentGuide() {
  const guide = `
# Deployment Guide

## For Custom Domains

1. Add your domain to package.json:
   \`\`\`json
   {
     "homepage": "https://yourdomain.com"
   }
   \`\`\`

2. Build for production:
   \`\`\`bash
   npm run build:deploy
   \`\`\`

3. Deploy the \`dist\` folder to your hosting provider

## Popular Hosting Options

### Netlify
- Drag and drop the \`dist\` folder to Netlify
- Or connect your GitHub repo for automatic deployments

### Vercel
- \`npm i -g vercel\`
- \`vercel --prod\`

### GitHub Pages
- Push \`dist\` folder to \`gh-pages\` branch
- Enable GitHub Pages in repository settings

### Custom Server
- Upload \`dist\` folder contents to your web server
- Configure your server to serve the index.html for all routes
`;

  fs.writeFileSync('DEPLOY.md', guide);
  console.log('📖 Created DEPLOY.md with deployment instructions');
}

// Run the deployment preparation
console.log('🚀 Preparing for deployment...\n');
updatePackageJson();
createDeploymentGuide();
console.log('\nDeployment preparation complete! 🎉');
updatePackageJson();
createDeploymentGuide();
console.log('\nDeployment preparation complete! 🎉');
