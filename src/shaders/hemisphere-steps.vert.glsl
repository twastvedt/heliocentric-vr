varying vec2 vUv;
varying vec3 fNormal;
uniform float scale;

void main() {

vUv = uv;
fNormal = normal;

//adding the normal scales it outward
//(normal scale equals sphere diameter)
vec3 newPosition = position + normal * scale;

gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}
