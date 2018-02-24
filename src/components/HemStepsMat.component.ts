AFRAME = require('aframe');

import { HemStepsMatSysOb } from '../systems/HemStepsMat.system';

interface thisOb {
  data: {
    sun: boolean;
  };
  applyToMesh: (this: AFrame.Component<thisOb, AFrame.System<HemStepsMatSysOb>>) => void;
}

export const HemStepsMatComp: AFrame.ComponentDefinition<thisOb, AFrame.System<HemStepsMatSysOb>> = {
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
