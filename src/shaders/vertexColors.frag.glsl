varying vec3 ambientLight;
varying vec3 vColor;

void main( void ) {

	// Remap 0.9-1 to 1-0.5.
	float aoFactor = vColor.g >= 230.0 ? 5.0 * -vColor.g / 50.0 + 5.6 : 1.0;

	gl_FragColor = vec4( ambientLight * aoFactor, 1.0);

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
