uniform vec3 sunAngle;

varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vPosition;
varying vec2 vCeilingLoc;
varying float fSunBlur;

void main() {

vNormal = normal;
vColor = color;
vPosition = position.xyz;

vec3 vToCeiling = sunAngle / -sunAngle.y * position.y;

vCeilingLoc = position.xz + vToCeiling.xz;

// sunBlur = tan(0.5) * (distance to occluding object) (Sun's disc subtends 0.5 degree arc)
fSunBlur = 0.0087269 * length(vToCeiling);

gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
