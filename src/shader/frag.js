const frag = `
uniform sampler2D texture1;
uniform float speed;
uniform float frequency;
uniform float amplitude;
uniform bool animation;

varying vec2 vUv;
varying float noise;
varying vec3 fNormal;

float rando (vec2 st) {
  return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float nois (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners in 2D of a tile
  float a = rando(i);
  float b = rando(i + vec2(1.0, 0.0));
  float c = rando(i + vec2(0.0, 1.0));
  float d = rando(i + vec2(1.0, 1.0));

  // Smooth Interpolation

  // Cubic Hermine Curve.  Same as SmoothStep()
  vec2 u = f*f*(3.0-2.0*f);
  // u = smoothstep(0.,1.,f);

  // Mix 4 coorners percentages
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}


void main() {
  // vec4 color1 = texture2D(texture1, vUv);

  vec2 distort = vec2(0.0,0.0);

  if(animation) {
    float x = sin(nois(vUv) * frequency + speed) * amplitude;
    distort = vec2(x,0.0);
  }

  vec4 texColor = texture2D(texture1, mod(vUv + (distort*(0.8-noise)), 1.0));

  // whatever is heightened by the noise is lighter
  gl_FragColor = vec4( texColor * noise );
}
`

export default frag
