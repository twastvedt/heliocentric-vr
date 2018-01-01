uniform vec3 sunAngle;
uniform float skyLum;
uniform float sunLux;
uniform vec3 sunColor;

varying vec2 vCeilingLoc;
varying float fSunBlur;
varying float albedo;
varying vec3 sunLight;
//varying vec3 vColor;
varying vec2 vUV;
varying vec3 vPosition;
varying vec3 vNormal;


void main() {

	vUV = uv;
	//vColor = color;
	vNormal = normal;
	vPosition = position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	vec3 vToCeiling = sunAngle / sunAngle.z * position.y;

	vCeilingLoc = position.xz + vToCeiling.xy;

	// sunBlur = tan(0.5) * (distance to occluding object) (Sun's disc subtends 0.5 degree arc)
	//fSunBlur = 0.0087269 * length(vToCeiling);
	fSunBlur = 0.0087269 * length(vToCeiling);

	// albedo = (color.r: Fraction of visible hemisphere covered by sky [0-2*pi], 2*pi = Full hemisphere of skylight))
	// Divide color.r by 10 to compensate for inflated values in vertex colors (allows for smoother transitions, since all values are very low).
	albedo = color.r * skyLum / 10.0;

	sunLight = sunColor * sunLux;
}
