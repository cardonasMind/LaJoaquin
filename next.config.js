const withLess = require('@zeit/next-less');

module.exports = withLess({
  distDir: 'build',
  lessLoaderOptions: {
    javascriptEnabled: true
  }
});


/*module.exports = {
  distDir: 'build'
}*/