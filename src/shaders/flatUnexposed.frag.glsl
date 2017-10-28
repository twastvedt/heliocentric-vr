uniform sampler2D src;
uniform float opacity;
uniform vec3 color;
uniform vec2 offset;
uniform int useTex;
uniform vec2 repeat;
varying vec2 vUV;

void main() {
	if (useTex == 1) {
		gl_FragColor = texture2D(src, vec2(vUV.x / repeat.x + offset.x, vUV.y / repeat.y + offset.y)) * vec4(color, opacity);
	} else {
		gl_FragColor = vec4(color, opacity);
	}
}
