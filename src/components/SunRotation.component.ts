AFRAME = require('aframe');

import { Sun } from '../systems/Sun.system';

interface SunRotation extends AFrame.Component {
  sunSystem: Sun;
}

export const SunRotationComp: AFrame.ComponentDefinition<SunRotation> = {
  schema: { },

  /**
   * Creates a new THREE.ShaderMaterial using the two shaders imported above.
   */
  init: function() {
    this.sunSystem = <any>document.querySelector('a-scene').systems['sun-system'] as Sun;

    document.querySelector('a-scene').addEventListener('sunTick', (e) => {
      this.el.setAttribute( 'rotation', { x: this.sunSystem.sunPos.altitude / Math.PI * 180, y: this.sunSystem.sunPos.azimuth / Math.PI * 180, z: 0 } );
    });
  }
};
