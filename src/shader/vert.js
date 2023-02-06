const vert = `
uniform sampler2D texture2;
uniform float scale;
uniform float speed;
uniform float frequency;
uniform float amplitude;

varying vec2 vUv;
varying float noise;
varying vec3 fNormal;

void main() {
  vUv = uv;
  fNormal = normal;

  vec4 noiseTex = texture2D( texture2, vUv );

  noise = noiseTex.r;

  //adding the normal scales it outward
  //(normal scale equals sphere diameter)
  vec3 newPosition = position + normal * noise * scale;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
`

export default vert
