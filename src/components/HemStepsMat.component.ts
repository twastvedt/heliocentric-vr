AFRAME = require('aframe');

import { HemStepsMatSys } from '../systems/HemStepsMat.system';

interface HemStepsMat extends AFrame.Component {
  data: {
    sun: boolean;
  };
  system: HemStepsMatSys;

  applyToMesh: (this: HemStepsMat) => void;
}

export const HemStepsMatComp: AFrame.ComponentDefinition<HemStepsMat> = {
  schema: {
    sun: { default: true }
  },

  init: function() {

    this.applyToMesh();
    this.el.addEventListener('model-loaded', () => this.applyToMesh());
  },

  applyToMesh: function() {
    const mesh = this.el.getObject3D('mesh'),
      that = this;

    if (mesh) {
      mesh.traverse((node: any) => {
        if (node.isMesh) {
          if (that.data.sun) {
            node.material = that.system.sunMaterial;
          } else {
            node.material = that.system.lightMapMaterial;
          }
        }
      });
    }
  }
};
