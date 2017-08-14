varying vec2 vUv;
varying vec3 fNormal;

void main( void ) {

// compose the colour using the normals then
// whatever is heightened by the noise is lighter
gl_FragColor = vec4( fNormal, 1. );

}
