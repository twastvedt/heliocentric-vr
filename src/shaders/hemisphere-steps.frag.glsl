uniform float halfSkylightLength;
uniform float halfSkylightWidth;

varying vec3 sunLight;
varying vec3 ambientLight;
varying vec2 vCeilingLoc;
varying float fSunBlur;

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

	gl_FragColor = vec4( ambientLight + (sunLight * fDirect * fDirect * fDirect), 1.0 );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
