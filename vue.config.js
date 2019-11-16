module.exports = {
  outputDir: './server/dist',
  devServer: {
    port: 3031,
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        // target: 'http://api.do.justtaller.com',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
