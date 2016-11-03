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
			 test: /\.(jpe?g|png|svg)$/i
			 , loader: "file-loader"
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
	, plugins : [
			new Webpack.ProvidePlugin({$ : "jquery", jQuery : "jquery"})
		]
};
