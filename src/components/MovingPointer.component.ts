AFRAME = require('aframe');

let camera: THREE.Object3D;
let camPos = new AFRAME.THREE.Vector3();
let targetPos = new AFRAME.THREE.Vector3();
let curNear: THREE.Object3D;
let curFuse: THREE.Object3D;

let pointerScale = {x: 0.001, y: 0.001, z: 0.001}

let circleNear: AFrame.Entity;
let circleFuse: AFrame.Entity;

let nearFadeIn = AFRAME.anime({
	targets: '#pointer-circle-near',
	autoplay: false,
	duration: 1500,
	update: (anim) => {
		circleNear.setAttribute('material', 'opacity', anim.progress * 0.002);
	}
});

let fuseScale = AFRAME.anime({
	targets: pointerScale,
	autoplay: false,
	x: [0.001, 1],
	y: [0.001, 1],
	z: [0.001, 1],
	duration: 1000,
	update: (anim) => {
		circleFuse.setAttribute('scale', pointerScale)
	}
});

/**
 * A pointer which sets its Z position when fusing to match the target object.
 */
export const MovingPointerComp: AFrame.ComponentDefinition = {

	schema: { },

	init: function() {
		camera = document.querySelector('#camera').object3D;
		camPos = camera.position;

		circleNear = document.querySelector('#pointer-circle-near');
		circleFuse = document.querySelector('#pointer-circle-fuse');

		this.el.addEventListener('raycaster-intersection', (e: any) => {
			if (e.srcElement.id === 'pointer-raycaster-near' && (!curNear || e.detail.els[0].object3D.uuid !== curNear.uuid)) {
				// Near a new checkpoint

				if (!curNear) {
					nearFadeIn.reversed = false;
					nearFadeIn.play();
				}

				curNear = e.detail.els[0].object3D;

				targetPos.setFromMatrixPosition( curNear.matrixWorld );

				const dist = 0.7 * camPos.distanceTo( targetPos );
				this.el.querySelector<AFrame.Entity>('#pointer-cursor').object3D.position.setZ( -dist );

			} else if (e.srcElement.id === 'pointer-raycaster-fuse' && (!curFuse || e.detail.els[0].object3D.uuid !== curFuse.uuid)) {
				// Moving onto a checkpoint

				if (!curFuse) {
					fuseScale.restart();
				}

				curFuse = e.detail.els[0].object3D;
			}
		});

		this.el.addEventListener('raycaster-intersection-cleared', (e: any) => {
			if (e.srcElement.id === 'pointer-raycaster-near') {
				// Moving far away from a checkpoint

				curNear = undefined;

				nearFadeIn.reversed = true;
				nearFadeIn.play();

				fuseScale.pause();
				fuseScale.seek(0);

			} else if (e.srcElement.id === 'pointer-raycaster-fuse') {
				// Moving off of a checkpoint

				curFuse = undefined;

				fuseScale.pause();
				fuseScale.seek(0);

			}
		});
	},
};
