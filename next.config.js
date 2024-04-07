/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.coinranking.com"],
  },
  distDir: ".next", // 빌드된 파일의 경로를 지정합니다.
};
