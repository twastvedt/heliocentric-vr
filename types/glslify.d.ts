// Type definitions for Glslify
// Project: https://github.com/stackgl/glslify
// Definitions by: Trygve Wastvedt <https://github.com/twastvedt>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare var glslify: glslify.GlslifyConstructor;
export = glslify;

declare namespace glslify {

interface GlslifyConstructor {
	(file: string, opts?: Options): string;
	(shaderSource: string, opts?: Options): string;
	// Tagged template string function.
	(literals: string, ...placeholders: string[]): string;
	// Compile a shader string from a string src.
	compile: {(src: string, opts?: Options): string};
	// Compile a shader from a filename.
	file: {(filename: string, opts?: Options): string};
}

interface Options {
	// Directory to resolve relative paths.
	basedir?: string,
	// An array of transform functions, transform module name.
	transform?: SourceTransform[]

}

type SourceTransform = SourceTransformPair | string | TransformFunction;

type TransformFunction = {(input: string): string};

type SourceTransformPair = [
	string,
	TransformOptions
];

interface TransformOptions {
	// Global transforms are applied after local transforms to every file, regardless of whether or not it's a dependency.
	global?: boolean,
	// Post transforms are applied to the entire output file once it's been bundled. Generally, you want to reserve this for very specific use cases such as whole-shader optimisation.
	post?: boolean,
	[name: string]: any
}
}
