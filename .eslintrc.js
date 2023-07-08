module.exports = {
	$schema: "https://json.schemastore.org/eslintrc",
	root: true,
	env: {
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "prettier"],

	rules: {
		"prettier/prettier": ["warn"],
		indent: ["off"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-explicit-any": "off",
	},
	settings: {
		next: {
			rootDir: ["./"],
		},
	},
	ignorePatterns: [
		"node_modules/",
		".next/",
		"out/",
		"public/",
		"dist/",
		".cache/",
		"lib/"
	],
};
