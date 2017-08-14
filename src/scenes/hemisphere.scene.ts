import AFRAME = require('aframe');

import glsl = require('glslify');

const extras = require('aframe-extras');

//import ('aframe-physics-system/src/components/math/velocity');
import ('aframe-orbit-controls-component-2');

//const keyboardControls = require('aframe-keyboard-controls');

//AFRAME.registerComponent('keyboard-controls', keyboardControls);
//AFRAME.registerComponent('keyboard-controls', extras.controls['keyboard-controls']);
//AFRAME.registerComponent('universal-controls', extras.controls['universal-controls']);



AFRAME.registerComponent('gltf-model-next', extras.loaders['gltf-model-next']);

const hemisphereStepsVert = glsl.file('../shaders/hemisphere-steps.vert.glsl');
const hemisphereStepsFrag = glsl.file('../shaders/hemisphere-steps.frag.glsl');

AFRAME.registerComponent('material-hemisphere-steps', {
  schema: {
    scale: {type: 'number'}
  },

  /**
   * Creates a new THREE.ShaderMaterial using the two shaders imported above.
   */
  init: function() {

    this.material  = new AFRAME.THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        scale: { value: this.data.scale }
      },
      vertexShader: hemisphereStepsVert,
      fragmentShader: hemisphereStepsFrag
		});

    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());
  },


  /**
   * Update the ShaderMaterial when component data changes.
   */
  update: function() {
    this.material.uniforms.scale.value = this.data.scale;
  },

  /**
   * Apply the material to the current entity.
   */
  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.material = this.material;
    }
  },

  /**
   * On each frame, update the 'time' uniform in the shaders.
   */
  tick: function(t: number) {
    this.material.uniforms.time.value = t / 1000;
  }

})
