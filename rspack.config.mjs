import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
	entry: {
		main: "./src/main.js",
	},
	output: {
		filename: "bundle.js",
		// eslint-disable-next-line no-undef
		path: resolve(__dirname, "dist")
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			{
				test: /\.js$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "ecmascript"
								}
							},
							env: { targets }
						}
					}
				]
			}
		]
	},
	plugins: [new rspack.HtmlRspackPlugin({ template: "./index.html" })],
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin(),
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets }
			})
		]
	},
	experiments: {
		css: true
	},
	devServer: {
		port: 8080
	}
});
