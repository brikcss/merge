// -------------------
// Set up environment.
//
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import prettier from 'rollup-plugin-prettier';
const prettierConfig = require('./.prettierrc.js');
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

// Flags.
const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test';

// Set base options.
const base = {
	input: 'src/merge.js',
	watch: {
		chokidar: true,
		include: 'src/**',
		exclude: 'node_modules/**',
		clearScreen: true
	}
};

// -----------------------
// Build config variatons.
//
// Build configs to be merged (later) with base.
let configs = [
	{
		output: [
			// CommonJS for Node.
			{
				file: pkg.main,
				format: 'cjs'
			},
			// ES module for bundlers / build systems.
			{
				file: pkg.module,
				format: 'es'
			}
		],
		plugins: [
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**'
			}),
			isProd && prettier(prettierConfig)
		]
	},
	{
		output: [
			// Browser global / IIFE.
			{
				name: 'brikcss.merge',
				file: pkg.browser,
				format: 'iife'
			},
			// Browser friendly UMD.
			{
				name: 'brikcss.merge',
				file: pkg.umd,
				format: 'umd'
			}
		],
		plugins: [
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**',
				presets: [
					[
						'env',
						{
							targets: {
								node: '8',
								browsers: ['last 2 versions', '> 2%']
							},
							modules: false
						}
					]
				]
			}),
			isProd && prettier(prettierConfig)
		]
	}
];

// Add configs with minified files on production build.
if (isProd) {
	const prodConfigs = [];
	configs.forEach((config) => {
		// Clone original config.
		let newConfig = JSON.parse(JSON.stringify(config));
		// Clone original plugins (they can't be cloned with above method).
		newConfig.plugins = config.plugins.slice(0);
		// Remove prettier.
		if (newConfig.plugins[newConfig.plugins.length - 1].name === 'rollup-plugin-prettier') {
			newConfig.plugins.splice(-1, 1);
		}
		// Add minifier and add `.min` to file name.
		newConfig.plugins.push(uglify());
		newConfig.output.forEach((output, i) => {
			newConfig.output[i].file = newConfig.output[i].file.replace('.js', '.min.js');
		});
		// Add minified config.
		prodConfigs.push(newConfig);
	});
	configs = configs.concat(prodConfigs);
}

// Merge each config with base config.
configs = configs.map((config) => {
	return Object.assign({}, base, config);
});

// ---------------
// Export configs.
//
export default configs;
