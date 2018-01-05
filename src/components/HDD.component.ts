AFRAME = require('aframe');

let dateFormat: DateFormatStatic = require("dateformat");

import { sunSystemOb, SunSystem } from '../systems/Sun.system';

interface thisOb {
  sunSystem: sunSystemOb;
  children: AFrame.Entity[];
  dateTime: AFrame.Entity;

  setChildrenOpacity: (this: AFrame.Component<thisOb>, opacity: number ) => void;
}

export const HDDComp: AFrame.ComponentDefinition<thisOb> = {
  schema: { },

  /**
   * Creates a new THREE.ShaderMaterial using the two shaders imported above.
   */
  init: function() {
    this.sunSystem = <any>document.querySelector('a-scene').systems['sun-system'] as sunSystemOb;

    this.children = [].slice.call(this.el.children);

    this.dateTime = this.el.querySelector('#hdd-dateTime');

    this.setChildrenOpacity(0.2);

    let that = this;
    document.querySelector('a-scene').addEventListener('sunTick', (e) => {
      that.dateTime.setAttribute( 'value', dateFormat(that.sunSystem.data.dateTime, 'HH:MM:ss\nyyyy-mm-dd', true) );
    });

    document.querySelector('#camera').addEventListener('componentchanged', function (evt) {
      // Set 'lookingDown' state on the HDD entity if the camera is looking down more than 45 degrees. Fades in HDD.
      // Set 'focus' state if the camera is looking at the HDD (currently <= -63 degrees). Locks rotation of controls.
      if (evt.detail.name === 'rotation') {

        if ( evt.target.getAttribute('rotation').x < -63 ) {
          if ( !that.el.is('focus') ) {

            that.el.addState('focus');

            document.querySelector('#pointer-hdd').object3D.visible = true;

            that.el.querySelector('#hdd-follow').components['copy-rotation'].pause();
          }

        } else if (evt.target.getAttribute('rotation').x < -55 ) {
          if ( !that.el.is('lookingDown') ) {

            that.el.addState('lookingDown');

            that.setChildrenOpacity(0.75);
          }

          if (that.el.is('focus')) {
            that.el.removeState('focus');

            document.querySelector('#pointer-hdd').object3D.visible = false;
          }

        } else if (that.el.is('lookingDown')) {
          that.el.removeState('lookingDown');

          that.setChildrenOpacity(0.2);

          that.el.querySelector('#hdd-follow').components['copy-rotation'].play();
        }
      }
    });

    // Control speed by clicking on the gauge target mesh.
    this.el.querySelector('#hdd-speedTarget').addEventListener('click', (e) => {
      const rotation = document.querySelector('#camera').components['rotation'].data.y;

      const relRot = that.el.querySelector('#hdd-follow').components['rotation'].data.y;

      const speedFraction = Math.min( Math.max( 0, (-(rotation - relRot) + 90) / 180), 1 );

      that.el.querySelector('#hdd-speedMarker').setAttribute( 'rotation', 'z', -(speedFraction * 174.6 + 2.7 - 90) );

      that.sunSystem.data.speed = Math.max(1, speedFraction * 1000);
    });

    // Reset time by clicking on reset icon.
    this.el.querySelector('#hdd-resetTarget').addEventListener('click', () => {
      that.sunSystem.data.dateTime = new Date((SunSystem.schema as any).dateTime.default);
    });
  },

  setChildrenOpacity(opacity) {
    let children = this.el.querySelectorAll<AFrame.Entity>('.hdd-display');

    for (let i = 0; i < children.length; ++i) {
      let child = children[i];

      if ( child.getAttribute('opacity') !== null ) {
        child.setAttribute('opacity', opacity);

      } else if ( child.components.material ) {
        child.setAttribute('material', 'opacity', opacity);
      }
    }
  }
};
