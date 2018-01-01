uniform float skyLum;
uniform vec3 skyColor;

varying vec3 ambientLight;
varying vec3 vColor;

void main() {

	vColor = color;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	// Divide color.r by 2 to compensate for inflated values in vertex colors (allows for smoother transitions).
	// 0.6: albedo of concrete material everything is made of.

	ambientLight = skyColor * ( 0.6 * color.r * skyLum / 510.0 );

}
