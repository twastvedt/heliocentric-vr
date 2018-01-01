uniform float halfSkylightLength;
uniform float halfSkylightWidth;
uniform sampler2D texture;
uniform vec3 skyColor;
uniform vec2 repeat;

varying vec3 sunLight;
varying float albedo;
varying vec2 vCeilingLoc;
varying float fSunBlur;
//varying vec3 vColor;
varying vec2 vUV;
varying vec3 vPosition;
varying vec3 vNormal;

#pragma glslify: orenNayar = require(glsl-diffuse-oren-nayar)

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
	//float aoStrength = vColor.g >= 0.9 ? -5.0 * vColor.g + 5.5 : 1.0;

	// orenNayar( lightDir, viewDir, surfaceNormal, roughness (0 - pi/2?), albedo)
	float ambientStrength = orenNayar( -normalize(vPosition), normalize(cameraPosition - vPosition), vNormal, 0.6, albedo );

	gl_FragColor = vec4( ambientStrength * skyColor * texture2D(texture, vec2(vUV.x * repeat.x, vUV.y * repeat.y)).rgb + (sunLight * fDirect * fDirect * fDirect), 1.0 );

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
}
