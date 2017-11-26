AFRAME = require('aframe');

import glsl = require('glslify');

const flatUnexposedVert = glsl.file('../shaders/flatUnexposed.vert.glsl');
const flatUnexposedFrag = glsl.file('../shaders/flatUnexposed.frag.glsl');

const textureLoader = new AFRAME.THREE.TextureLoader();

interface thisOb extends AFrame.Component {
  applyToMesh: () => void;
}

export const FlatUnexposedMaterial: AFrame.ComponentDefinition<thisOb> = {
  schema: {
    // the texture source
    src: {type: 'map'},
    opacity: {type: 'number', default: 1},
    useTex: {type: 'int', default: 1},
    color: {type: 'color', default: 'white'},
    // texture parameters
    offset: {type: 'vec2', default: {x: 0, y: 0}},
    repeat: {type: 'vec2', default: {x: 1, y: 1}}
  },

  init: function() {
    const data = this.data;
    this.material  = new AFRAME.THREE.ShaderMaterial({
      uniforms: {
        src: { type: 't', value: textureLoader.load( data.src ) },
        opacity: { value: data.opacity },
        useTex: { value: data.useTex },
        color: { value: new AFRAME.THREE.Color(data.color) },
        offset: { value: data.offset },
        repeat: { value: data.repeat }
      },
      vertexShader: flatUnexposedVert,
      fragmentShader: flatUnexposedFrag
    });

    if ( data.opacity < 1 || data.useTex === 1 ) {
      this.material.transparent = true;
    }

    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());
  },

  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.traverse((node: any) => {
        if (node.isMesh) node.material = this.material;
      });
    }
  }
};
