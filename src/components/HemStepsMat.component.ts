AFRAME = require('aframe');

import { HemStepsMatSysOb } from '../systems/HemStepsMat.system';

interface thisOb extends AFrame.Component {
  applyToMesh: () => void;
}

export const HemStepsMatComp: AFrame.ComponentDefinition<thisOb, HemStepsMatSysOb> = {
  schema: {
    sun: { default: true }
  },

  init: function() {

    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());
  },

  applyToMesh: function(this: AFrame.Component<thisOb, HemStepsMatSysOb>) {
    const mesh = this.el.getObject3D('mesh'),
      that = this;

    if (mesh) {
      mesh.traverse((node: any) => {
        if (node.isMesh) {
          if (that.data.sun) {
            node.material = that.system.sunMaterial;
          } else {
            node.material = that.system.material;
          }
        }
      });
    }
  }
};
