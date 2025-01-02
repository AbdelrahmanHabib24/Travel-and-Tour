/** @type {import('next').NextConfig} */  
const nextConfig = {  
  images: {  
    remotePatterns: [  
      {  
        protocol: 'https',  
        hostname: 'your-image-host.com', // Change to your actual domain  
        port: '',  
        pathname: '/path/to/image/**',  
      },  
      // Add more patterns as needed  
    ],  
  },  
};  

module.exports = nextConfig;