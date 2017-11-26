AFRAME = require('aframe');

interface thisOb extends AFrame.Component {
  applyToMesh: () => void;
}

export const HemStepsMatComp: AFrame.ComponentDefinition<thisOb> = {
  schema: { },

  init: function() {

    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());
  },

  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh');
    if (mesh) {
      mesh.traverse((node: any) => {
        if (node.isMesh) node.material = this.system.material;
      });
    }
  }
};
