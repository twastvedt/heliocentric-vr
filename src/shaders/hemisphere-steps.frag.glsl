uniform float halfSkylightLength;
uniform float halfSkylightWidth;
uniform float sunLux;
uniform vec3 sunColor;
uniform float skyLum;
uniform vec3 skyColor;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;
varying vec2 vCeilingLoc;
varying float fSunBlur;

#pragma glslify: orenNayar = require(glsl-diffuse-oren-nayar)

void main( void ) {

float fDirect = 0.0;

if (sunLux > 0.0) {
	// Sun is shining

	float xDist = abs(vCeilingLoc.x);
	float zDist = abs(vCeilingLoc.y);

	if ((xDist < halfSkylightWidth + fSunBlur) && (zDist < halfSkylightLength + fSunBlur)) {
		if (xDist < halfSkylightWidth) {
			fDirect = 1.0;
		} else {
			fDirect = 1.0 - (xDist - halfSkylightWidth) / fSunBlur;
		}

		if (zDist < halfSkylightLength) {
			fDirect *= 1.0;
		} else {
			fDirect *= 1.0 - (zDist - halfSkylightLength) / fSunBlur;
		}
	}
}

// orenNayar( lightDir, viewDir, surfaceNormal, roughness (0 - pi/2?), albedo)
//float ambientViewStrength = orenNayar( normalize(vPosition), normalize(cameraPosition - vPosition), vNormal, 0.6, vColor.r * skyLum * 10.0 );
float ambientViewStrength = orenNayar( -normalize(vPosition), normalize(cameraPosition - vPosition), vNormal, 0.6, vColor.r * skyLum * 3.0 );

float aoStrength = vColor.g > 0.95 ? vColor.g * 20.0 - 19.0 : 0.0;

// gl_FragColor = vec4( (skyColor * ambientViewStrength) + (sunColor * sunLux * fDirect) - (aoStrength * 0.05), 1.0 );
gl_FragColor = vec4( sunColor * sunLux * fDirect, 1.0 );


#include <tonemapping_fragment>
#include <encodings_fragment>
#include <fog_fragment>

}
