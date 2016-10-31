const Webpack = require('webpack');

module.exports = {
	entry: [
    "./public/app.js"
	]
	, module: {
		loaders: [
			{
				test: /\.js/
				, exclude: /node_modules/
				, loader: "babel"
			}
			, {
          test: /\.scss$/
          , exclude: /node_modules/
          , loader: "style!css!sass"
      }
			, {
				test: /\.html$/
				, loader: "html"
			}
			, {
          test: /\.(png)$/
          , loader: require.resolve("file-loader")
      }
			, {
          test: /\.(jpg)/
          , loader: require.resolve("file-loader")
      }
		]
	}
	, resolve: {
		extensions: [ "", ".js", ".css" ]
	}
	, output: {
		path: __dirname + "/public"
		, filename: "bundle.js"
	}
	, target: 'node'
};
