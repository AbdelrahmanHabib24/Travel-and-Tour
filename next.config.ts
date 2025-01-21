/** @type {import('next').NextConfig} */  
const nextConfig = {  
  images: {  

   
    remotePatterns: [  
      {  
        protocol: 'https',  
        hostname: 'your-image-host.com', 
        port: '',  
        pathname: '/path/to/image/**',  
      },  
      

    ],  
  },  
};  

module.exports = nextConfig;