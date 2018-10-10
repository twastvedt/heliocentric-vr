AFRAME = require('aframe');

let dateFormat: DateFormatStatic = require("dateformat");

import { Sun, SunSystem } from '../systems/Sun.system';

interface HDD extends AFrame.Component {
  sunSystem: Sun;
  children: AFrame.Entity[];
  dateTime: AFrame.Entity;

  setChildrenOpacity: (this: this, opacity: number ) => void;
}

let pointerFuse: AFrame.Entity;

const pointerScale = {x: 0.001, y: 0.001, z: 0.001};

let fuseScale = AFRAME.anime({
	targets: pointerScale,
	autoplay: false,
	x: [0.001, 1],
	y: [0.001, 1],
	z: [0.001, 1],
	duration: 1000,
	update: (anim) => {
		pointerFuse.setAttribute('scale', pointerScale)
	}
});

export const HDDComp: AFrame.ComponentDefinition<HDD> = {
  schema: { },

  /**
   * Creates a new THREE.ShaderMaterial using the two shaders imported above.
   */
  init: function() {
    this.sunSystem = <any>document.querySelector('a-scene').systems['sun-system'] as Sun;

    this.children = [].slice.call(this.el.children);

    this.dateTime = this.el.querySelector('#hdd-dateTime');

    pointerFuse = document.querySelector('#pointer-hdd-fuse');

    this.setChildrenOpacity(0.2);

    let that = this;
    document.querySelector('a-scene').addEventListener('sunTick', (e) => {
      that.dateTime.setAttribute( 'value', dateFormat(that.sunSystem.data.dateTime, 'HH:MM:ss\nyyyy-mm-dd', true) );
    });

    document.querySelector('#camera').addEventListener('componentchanged', function (evt) {
      // Set 'lookingDown' state on the HDD entity if the camera is looking down more than 55 degrees. Fades in HDD.
      // Set 'focus' state if the camera is looking at the HDD (currently <= -63 degrees). Locks rotation of controls.
      if (evt.detail.name === 'rotation') {

        if ( evt.target.getAttribute('rotation').x < -63 ) {
          if ( !that.el.is('focus') ) {

            that.el.addState('focus');

            document.querySelector('#pointer-hdd').object3D.visible = true;

            that.el.querySelector<AFrame.Entity>('#hdd-follow').components['copy-rotation'].pause();
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

          document.querySelector('#pointer-hdd').object3D.visible = false;

          that.el.querySelector<AFrame.Entity>('#hdd-follow').components['copy-rotation'].play();
        }
      }
    });

    pointerFuse.addEventListener('raycaster-intersection', (e: any) => {
      fuseScale.play();
    });

    pointerFuse.addEventListener('raycaster-intersection-cleared', (e: any) => {
      fuseScale.pause();
      fuseScale.seek(0);
    });

    // Control speed by clicking on the gauge target mesh.
    this.el.querySelector('#hdd-speedTarget').addEventListener('click', () => {
      const rotation = document.querySelector('#camera').components['rotation'].data.y;

      const relRot = that.el.querySelector<AFrame.Entity>('#hdd-follow').components['rotation'].data.y;

      const speedFraction = Math.min( Math.max( 0, (-(rotation - relRot) + 90) / 180), 1 );

      that.el.querySelector<AFrame.Entity>('#hdd-speedMarker').setAttribute( 'rotation', 'z', -(speedFraction * 174.6 + 2.7 - 90) );

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
