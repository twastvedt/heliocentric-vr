uniform float skyLum;
uniform vec3 skyColor;

attribute vec2 uv2;

varying vec3 skyLight;
varying vec2 vUV;
varying vec2 vUV2;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {

	vUV = uv;
	vUV2 = uv2;
	vNormal = normal;
	vPosition = position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	skyLight = skyColor * skyLum;
}
