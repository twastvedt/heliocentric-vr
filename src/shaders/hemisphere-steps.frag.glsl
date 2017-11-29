uniform float halfSkylightLength;
uniform float halfSkylightWidth;

varying vec3 sunLight;
varying vec3 ambientLight;
varying vec2 vCeilingLoc;
varying float fSunBlur;
varying vec3 vColor;

void main( void ) {

	float fDirect = 0.0;

	if (sunLight.r > 0.0) {
		// Sun is shining

		float xDist = abs(vCeilingLoc.x);
		float zDist = abs(vCeilingLoc.y);

		if ((xDist < halfSkylightWidth + fSunBlur) && (zDist < halfSkylightLength + fSunBlur)) {
			if (xDist < halfSkylightWidth) {
				fDirect = 1.0;
			} else {
				fDirect = 1.0 - (xDist - halfSkylightWidth) / fSunBlur;
			}

			if (zDist > halfSkylightLength) {
				fDirect *= 1.0 - (zDist - halfSkylightLength) / fSunBlur;
			}
		}
	}

	// Remap 0.9-1 to 1-0.5.
	float aoStrength = vColor.g >= 230.0 ? 5.0 * -vColor.g / 50.0 + 5.6 : 1.0;

	gl_FragColor = vec4( ambientLight * aoStrength + (sunLight * fDirect * fDirect * fDirect), 1.0 );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
