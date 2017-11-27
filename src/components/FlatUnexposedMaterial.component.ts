AFRAME = require('aframe');

import glsl = require('glslify');

const flatUnexposedVert = glsl.file('../shaders/flatUnexposed.vert.glsl');
const flatUnexposedFrag = glsl.file('../shaders/flatUnexposed.frag.glsl');

export const FlatUnexposedMaterial: AFrame.ShaderDefinition = {
  schema: {
    // the texture source
    src: {type: 'map', is: 'uniform'},
    opacity: {type: 'number', default: 1, is: 'uniform'},
    useTex: {type: 'int', default: 0, is: 'uniform'},
    color: {type: 'color', default: 'white', is: 'uniform'},
    // texture parameters
    offset: {type: 'vec2', default: {x: 0, y: 0}, is: 'uniform'},
    repeat: {type: 'vec2', default: {x: 1, y: 1}, is: 'uniform'}
  },
  vertexShader: flatUnexposedVert,
  fragmentShader: flatUnexposedFrag
};
