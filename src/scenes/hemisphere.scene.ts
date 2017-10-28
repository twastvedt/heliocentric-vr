AFRAME = require('aframe');

require('aframe-animation-component');

const extras = require('aframe-extras');

import 'aframe-orbit-controls-component-2';

import { SunSystem } from '../systems/Sun.system';

import { HDDComp } from "../components/HDD.component";

import { HemStepsMatComp } from '../components/HemStepsMat.component';
import { HemStepsMatSys } from '../systems/HemStepsMat.system';

import { FlatUnexposedMaterial } from "../components/FlatUnexposedMaterial.component";

import { SunRotationComp } from '../components/SunRotation.component';

import { CopyPositionComp } from '../components/CopyPosition.component';
import { CopyRotationComp } from '../components/CopyRotation.component';

extras.controls.registerAll();

AFRAME.registerSystem( 'sun-system', SunSystem );

AFRAME.registerComponent( 'hdd', HDDComp );

AFRAME.registerSystem( 'material-hemisphere-steps', HemStepsMatSys );
AFRAME.registerComponent( 'material-hemisphere-steps', HemStepsMatComp );

AFRAME.registerComponent( 'sun-rotation', SunRotationComp );

AFRAME.registerShader( 'flatUnexposed', FlatUnexposedMaterial )

AFRAME.registerComponent( 'copy-position', CopyPositionComp );
AFRAME.registerComponent( 'copy-rotation', CopyRotationComp );

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

	scene.renderer.toneMappingExposure = 1;
}, false);
