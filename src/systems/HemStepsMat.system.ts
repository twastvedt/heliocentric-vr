AFRAME = require('aframe');

import glsl = require('glslify');

import { sunSystemOb } from './Sun.system';

const hemStepsVert = glsl.file('../shaders/hemisphere-steps.vert.glsl');
const hemStepsFrag = glsl.file('../shaders/hemisphere-steps.frag.glsl');

const vertexColorsVert = glsl.file('../shaders/vertexColors.vert.glsl');
const vertexColorsFrag = glsl.file('../shaders/vertexColors.frag.glsl');

export interface HemStepsMatSysOb extends AFrame.System {
	sunSystem: sunSystemOb;
	material: THREE.RawShaderMaterial;
	sunMaterial: THREE.RawShaderMaterial;
}

let updateMaterial: ((this: HemStepsMatSysOb) => void) = function() {
	this.material.uniforms.skyLum.value = this.sunSystem.skyLum;
  this.sunMaterial.uniforms.skyLum.value = this.sunSystem.skyLum;

  this.sunMaterial.uniforms.sunLux.value = this.sunSystem.sunLux;
}

export const HemStepsMatSys: AFrame.SystemDefinition<HemStepsMatSysOb> = {
  schema: { },

	init: function () {

		this.sunSystem = <any>document.querySelector('a-scene').systems['sun-system'] as sunSystemOb;

    const sunMaterial = new AFRAME.THREE.ShaderMaterial({
      uniforms: {
        halfSkylightWidth: { value: 60.25 },
        halfSkylightLength: { value: 0.4 },
        sunAngle: { value: this.sunSystem.sunVec },
        sunLux: { value: this.sunSystem.sunLux },
        sunColor: { value: this.sunSystem.sunColor },
        skyLum: { value: this.sunSystem.skyLum },
        skyColor: { value: this.sunSystem.skyColor }
      },
      vertexShader: hemStepsVert,
      fragmentShader: hemStepsFrag
    });

    const material = new AFRAME.THREE.ShaderMaterial({
      uniforms: {
        skyLum: { value: this.sunSystem.skyLum },
        skyColor: { value: this.sunSystem.skyColor }
      },
      vertexShader: vertexColorsVert,
      fragmentShader: vertexColorsFrag
    });

    material.vertexColors = AFRAME.THREE.VertexColors;
    sunMaterial.vertexColors = AFRAME.THREE.VertexColors;

    this.material = material;
    this.sunMaterial = sunMaterial;

		document.querySelector('a-scene').addEventListener('sunTick', updateMaterial.bind(this));
	}
};
