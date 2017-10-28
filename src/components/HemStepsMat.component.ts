AFRAME = require('aframe');

interface thisOb extends AFrame.Component {
  applyToMesh: () => void;
}

export const HemStepsMatComp: AFrame.ComponentDefinition<thisOb> = {
  schema: { },

  /**
   * Creates a new THREE.ShaderMaterial using the two shaders imported above.
   */
  init: function() {

    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());
  },


  /**
   * Update the ShaderMaterial when component data changes.
   */
  update: function() {
  },

  /**
   * Apply the material to the current entity.
   */
  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.traverse((node: any) => {
        if (node.isMesh) node.material = this.system.material;
      });
    }
  }
};
