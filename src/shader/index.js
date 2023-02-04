var twgl = require("twgl.js")

export const main = (el) => {
  const gl = el.current.getContext('webgl');
  const ext = gl.getExtension('OES_standard_derivatives');
  if (!ext) {
    return alert('need OES_standard_derivatives');
  }

  const m4 = twgl.m4;
  const vs = `
  attribute vec4 position;
  attribute vec2 texcoord;

  uniform sampler2D displacementMap;
  uniform mat4 projection;
  uniform mat4 view;
  uniform mat4 model;

  varying vec3 v_worldPosition;

  void main() {
    float displacementScale = 10.0;
    float displacement = texture2D(displacementMap, texcoord).r * displacementScale;
    vec4 displacedPosition = position + vec4(0, displacement, 0, 0);
    gl_Position = projection * view * model * displacedPosition;
    v_worldPosition = (model * displacedPosition).xyz;
  }
  `;

  const fs = `
  #extension GL_OES_standard_derivatives : enable

  precision highp float;

  varying vec3 v_worldPosition;

  void main() {
    vec3 dx = dFdx(v_worldPosition);
    vec3 dy = dFdy(v_worldPosition);
    vec3 normal = normalize(cross(dy, dx));

    // just hard code lightDir and color
    // to make it easy
    vec3 lightDir = normalize(vec3(1, -2, 3));
    float light = dot(lightDir, normal);
    vec3 color = vec3(0.3, 1, 0.1);

    gl_FragColor = vec4(color * (light * 0.5 + 0.5), 1);
  }
  `;

  // compile shader, link, look up locations
  const programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  // make some vertex data
  // calls gl.createBuffer, gl.bindBuffer, gl.bufferData for each array
  const bufferInfo = twgl.primitives.createPlaneBufferInfo(
      gl,
      96,  // width
      64,  // height
      96,  // quads across
      64,  // quads down
  );

  const tex = twgl.createTexture(gl, {
    src: 'mosss-dpt_swin2_large_384.png',
    minMag: gl.NEAREST,
    wrap: gl.CLAMP_TO_EDGE,
  });

  function render(time) {
    time *= 0.001;  // seconds
    // time = 0.001;

    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    const fov = 60 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const near = 0.1;
    const far = 200;
    const projection = m4.perspective(fov, aspect, near, far);

    const eye = [Math.cos(time) * 30, 10, Math.sin(time) * 30];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    const model = m4.identity();

    gl.useProgram(programInfo.program);

    // calls gl.bindBuffer, gl.enableVertexAttribArray, gl.vertexAttribPointer
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    // calls gl.activeTexture, gl.bindTexture, gl.uniformXXX
    twgl.setUniformsAndBindTextures(programInfo, {
      projection,
      view,
      model,
      displacementMap: tex,
    });

    // calls gl.drawArrays or gl.drawElements
    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
