/**
 * Probably can delete. I think this is the same as the built-in setting `material:"shader: flat"`
 */

AFRAME = require('aframe');

interface thisOb {
  applyToMesh: () => void;
  material?: THREE.MeshBasicMaterial;
  data: string;
}

export const FlatMaterial: AFrame.ComponentDefinition<thisOb> = {
  schema: {type: 'color'},

  /**
   * Creates a new THREE.ShaderMaterial using the two shaders imported above.
   */
  init: function() {

    const material = new AFRAME.THREE.MeshBasicMaterial({
      color: this.data
    });

    this.material = material;

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
        if (node.isMesh) node.material = this.material;
      });
    }
  }

};
