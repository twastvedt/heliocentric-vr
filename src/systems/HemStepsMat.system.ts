AFRAME = require('aframe');

import glsl = require('glslify');

import { sunSystemOb } from './Sun.system';

const hemStepsVert = glsl.file('../shaders/hemisphere-steps.vert.glsl');
const hemStepsFrag = glsl.file('../shaders/hemisphere-steps.frag.glsl');

interface thisOb extends AFrame.System {
	system: sunSystemOb;
	material: THREE.RawShaderMaterial;
}

let updateMaterial: ((this: thisOb) => void) = function() {
	//this.material.uniforms.sunAngle.value = this.system.sunVec.negate();
	//this.material.uniforms.sunColor.value = this.system.sunColor;
	this.material.uniforms.skyLum.value = this.system.skyLum;
	//this.material.uniforms.skyColor.value = this.system.skyColor;
  this.material.uniforms.sunLux.value = this.system.sunLux;
}

export const HemStepsMatSys: AFrame.SystemDefinition<thisOb> = {
  schema: { },

	init: function () {

		this.system = <any>document.querySelector('a-scene').systems['sun-system'] as sunSystemOb;

    const material = new AFRAME.THREE.ShaderMaterial({
      uniforms: {
        halfSkylightWidth: { value: 60.25 },
        halfSkylightLength: { value: 0.4 },
        sunAngle: { value: this.system.sunVec },
        sunLux: { value: this.system.sunLux },
        sunColor: { value: this.system.sunColor },
        skyLum: { value: this.system.skyLum },
        skyColor: { value: this.system.skyColor }
      },
      vertexShader: hemStepsVert,
      fragmentShader: hemStepsFrag
    });

    material.vertexColors = AFRAME.THREE.VertexColors;

		this.material = material;

		document.querySelector('a-scene').addEventListener('sunTick', updateMaterial.bind(this));
	}
};
