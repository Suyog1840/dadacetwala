/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/student/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
