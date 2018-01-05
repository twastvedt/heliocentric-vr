AFRAME = require('aframe');

let camera: THREE.Object3D;
let lookVec = new AFRAME.THREE.Vector3();
let camPos = new AFRAME.THREE.Vector3();
let tempPos = { x: 0, y: 0, z: 0 };
let yFac = 0;

export const LockedPointerComp: AFrame.ComponentDefinition = {
	/**
	 * Eventually this could be a full locked track solution with position and rotation.
	 * For now, it's only what we need, which is to lock the Y coordinate relative to the camera.
	 * */

	schema: { default: -1 },

	init: function() {
		camera = document.querySelector('#camera').object3D;
		camPos = camera.position;
	},

	tick: function() {
		camera.getWorldDirection(lookVec);

		yFac = this.data / lookVec.y;

		tempPos.x = lookVec.x * yFac + camPos.x;
		tempPos.y = lookVec.y * yFac + camPos.y;
		tempPos.z = lookVec.z * yFac + camPos.z;

		this.el.setAttribute('position', tempPos);
	}
};
