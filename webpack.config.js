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
		]
	}
	, resolve: {
		extensions: [ "", ".js", ".css" ]
	}
	, output: {
		path: __dirname + "/public"
		, filename: "bundle.js"
	}
};
