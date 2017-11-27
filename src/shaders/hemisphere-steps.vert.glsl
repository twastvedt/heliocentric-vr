uniform vec3 sunAngle;
uniform float skyLum;
uniform float sunLux;
uniform vec3 sunColor;
uniform vec3 skyColor;

varying vec2 vCeilingLoc;
varying float fSunBlur;
varying vec3 ambientLight;
varying vec3 sunLight;

#pragma glslify: orenNayar = require(glsl-diffuse-oren-nayar)

void main() {

	vec3 vToCeiling = sunAngle / sunAngle.z * position.y;

	vCeilingLoc = position.xz + vToCeiling.xy;

	// sunBlur = tan(0.5) * (distance to occluding object) (Sun's disc subtends 0.5 degree arc)
	//fSunBlur = 0.0087269 * length(vToCeiling);
	fSunBlur = 0.0087269 * length(vToCeiling);

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	// Divide color.r by 10 to compensate for inflated values in vertex colors (allows for smoother transitions).

	// orenNayar( lightDir, viewDir, surfaceNormal, roughness (0 - pi/2?), albedo)
	float ambientStrength = orenNayar( -normalize(position.xyz), normalize(cameraPosition - position.xyz), normal, 0.6, color.r * skyLum / 2550.0 );

	// Remap 0.9-1 to 1-0.5.
	float aoStrength = color.g >= 230.0 ? 5.0 * -color.g / 50.0 + 5.6 : 1.0;

	ambientLight = skyColor * ambientStrength * aoStrength;

	sunLight = sunColor * sunLux;
}
