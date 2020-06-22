module.exports = {
  runtimeCompiler: true,
  configureWebpack: config => {
    config.module.rules.push(
      {
		test: /\.md$/,
		use: 'raw-loader'
      },
      {
		test: /\.ya?ml$/,
		type: 'json', // Required by Webpack v4
		use: 'yaml-loader'
      }
    )
  }
}