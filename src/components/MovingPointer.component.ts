AFRAME = require('aframe');

let camera: THREE.Object3D;
let camPos = new AFRAME.THREE.Vector3();
let targetPos = new AFRAME.THREE.Vector3();
let curTarget: THREE.Object3D;

/**
 * A pointer which sets its Z position when fusing to match the target object.
 */
export const MovingPointerComp: AFrame.ComponentDefinition = {

	schema: { },

	init: function() {
		camera = document.querySelector('#camera').object3D;
		camPos = camera.position;

		this.el.addEventListener('raycaster-intersection', (e: any) => {
			if (e.srcElement.id === 'pointer-checkpoint-near' && e.detail.els[0].object3D !== curTarget) {
				curTarget = e.detail.els[0].object3D;

				targetPos.setFromMatrixPosition( curTarget.matrixWorld );
				console.log(-0.8 * camPos.distanceTo( targetPos ));
				this.el.object3D.position.setZ( -0.8 * camPos.distanceTo( targetPos ) );
			}
		});
	},
};
