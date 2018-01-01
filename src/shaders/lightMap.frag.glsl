uniform sampler2D lightMap;
uniform sampler2D texture;
uniform vec2 repeat;

varying vec3 skyLight;
varying vec2 vUV;
varying vec2 vUV2;
varying vec3 vPosition;
varying vec3 vNormal;

void main( void ) {

	// gl_FragColor =
	// 	(lightMap: [0-1][3], 1 = Full hemisphere of skylight) *
	//	(skyLight: skyColor * (skyLum: luminance)) *
	//	(texture: [0-1][3] surface albedo)

	gl_FragColor = vec4( texture2D(lightMap, vUV2).r * skyLight * texture2D(texture, vec2(vUV.x * repeat.x, vUV.y * repeat.y)).rgb, 1.0);

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
