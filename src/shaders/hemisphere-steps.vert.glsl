uniform vec3 sunAngle;
uniform float skyLum;
uniform float sunLux;
uniform vec3 sunColor;
uniform vec3 skyColor;

varying vec2 vCeilingLoc;
varying float fSunBlur;
varying vec3 ambientLight;
varying vec3 sunLight;
varying vec3 vColor;

#pragma glslify: orenNayar = require(glsl-diffuse-oren-nayar)

void main() {

	vColor = color;

	vec3 vToCeiling = sunAngle / sunAngle.z * position.y;

	vCeilingLoc = position.xz + vToCeiling.xy;

	// sunBlur = tan(0.5) * (distance to occluding object) (Sun's disc subtends 0.5 degree arc)
	//fSunBlur = 0.0087269 * length(vToCeiling);
	fSunBlur = 0.0087269 * length(vToCeiling);

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	// Divide color.r by 10 to compensate for inflated values in vertex colors (allows for smoother transitions).

	// orenNayar( lightDir, viewDir, surfaceNormal, roughness (0 - pi/2?), albedo)
	float ambientStrength = orenNayar( -normalize(position.xyz), normalize(cameraPosition - position.xyz), normal, 0.6, color.r * skyLum / 2550.0 );
	//float ambientStrength = dot(-normalize(position.xyz), normal) * 0.6 * color.r * skyLum / 2550.0;

	ambientLight = skyColor * ambientStrength;

	sunLight = sunColor * sunLux;
}
