AFRAME = require('aframe');

require('aframe-animation-component');

const extras = require('aframe-extras');

import { SunSystem } from '../systems/Sun.system';

import { HDDComp } from "../components/HDD.component";

import { HemStepsMatComp } from '../components/HemStepsMat.component';
import { HemStepsMatSys } from '../systems/HemStepsMat.system';

import { FlatUnexposedMaterial } from "../components/FlatUnexposedMaterial.component";

import { SunRotationComp } from '../components/SunRotation.component';

import { CopyPositionComp } from '../components/CopyPosition.component';
import { CopyRotationComp } from '../components/CopyRotation.component';
import { ConstantScaleComp } from '../components/ConstantScale.component';
import { LockedPointerComp } from '../components/LockedPointer.component';
import { MovingPointerComp } from '../components/MovingPointer.component';

extras.controls.registerAll();
AFRAME.registerComponent('checkpoint', extras.misc.checkpoint);

AFRAME.registerSystem( 'sun-system', SunSystem );

AFRAME.registerComponent( 'hdd', HDDComp );

AFRAME.registerSystem( 'material-hemisphere-steps', HemStepsMatSys );
AFRAME.registerComponent( 'material-hemisphere-steps', HemStepsMatComp );

AFRAME.registerComponent( 'sun-rotation', SunRotationComp );

AFRAME.registerShader( 'flatUnexposed', FlatUnexposedMaterial )

AFRAME.registerComponent( 'copy-position', CopyPositionComp );
AFRAME.registerComponent( 'copy-rotation', CopyRotationComp );
AFRAME.registerComponent( 'constant-scale', ConstantScaleComp );
AFRAME.registerComponent( 'locked-pointer', LockedPointerComp );
AFRAME.registerComponent( 'moving-pointer', MovingPointerComp );

let scene: AFrame.Scene;

window.onkeyup = function(e) {
	const key = e.keyCode ? e.keyCode : e.which;

	switch (key) {
		case 32:
			// Space: toggle play
			if (scene.isPlaying) {
				scene.pause();
			} else {
				scene.play();
			}
			break;
	}
};

document.addEventListener('DOMContentLoaded', () => {
	scene = document.querySelector('a-scene');

	scene.renderer.toneMappingExposure = 0.001;

	scene.addEventListener('loaded', () => {
		setTimeout(() => {
			document.querySelector('[raycaster]').components.raycaster.refreshObjects();
		}, 2000);

		const checkpoints = (document.querySelectorAll('[mixin="checkpoint"]') as NodeListOf<AFrame.Entity<any>>);

		// Hide current checkpoint.
		document.querySelector('#camera').addEventListener('navigation-end', (e: any) => {

			for (let i = 0; i < checkpoints.length; ++i) {
				checkpoints[i].setAttribute('visible', true);
			}

			e.detail.checkpoint.parentEl.setAttribute('visible', false);

		});

	});

}, false);
