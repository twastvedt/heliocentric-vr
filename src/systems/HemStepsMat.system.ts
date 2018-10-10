AFRAME = require('aframe');

const glsl = require('glslify');

import { Sun } from './Sun.system';

const hemStepsVert = glsl.file('../shaders/hemisphere-steps.vert.glsl');
const hemStepsFrag = glsl.file('../shaders/hemisphere-steps.frag.glsl');

const vertexColorsVert = glsl.file('../shaders/vertexColors.vert.glsl');
const vertexColorsFrag = glsl.file('../shaders/vertexColors.frag.glsl');

const lightMapVert = glsl.file('../shaders/lightMap.vert.glsl');
const lightMapFrag = glsl.file('../shaders/lightMap.frag.glsl');

export interface HemStepsMatSys extends AFrame.System {
	sunSystem: Sun;
	material: THREE.ShaderMaterial;
	sunMaterial: THREE.ShaderMaterial;
	lightMapMaterial: THREE.ShaderMaterial;
}

let updateMaterial: ((this: HemStepsMatSys) => void) = function() {
	// this.material.uniforms.skyLum.value = this.sunSystem.skyLum;
  this.sunMaterial.uniforms.skyLum.value = this.sunSystem.skyLum;
  this.lightMapMaterial.uniforms.skyLum.value = this.sunSystem.skyLum;

  this.sunMaterial.uniforms.sunLux.value = this.sunSystem.sunLux;
}

export const HemStepsMatSys: AFrame.SystemDefinition<HemStepsMatSys> = {
  schema: { },

	init: function () {

    this.sunSystem = <any>document.querySelector('a-scene').systems['sun-system'] as Sun;

    const loader = new AFRAME.THREE.TextureLoader();
    const concreteTexture = loader.load( './assets/hemisphere/concrete-19-2048.png' );
    // const concreteTexture = loader.load( './assets/hemisphere/uv_checker_large.png' );
    const lightMap = loader.load( './assets/hemisphere/lightMap.png' );

    //UVs are getting flipped in the blender export. flipY defaults to true, but setting it to false fixes this.
    lightMap.flipY = false;
    concreteTexture.wrapS = concreteTexture.wrapT = AFRAME.THREE.RepeatWrapping;

    const sunMaterial = new AFRAME.THREE.ShaderMaterial({
      uniforms: {
        halfSkylightWidth: { value: 60.25 },
        halfSkylightLength: { value: 0.4 },
        sunAngle: { value: this.sunSystem.sunVec },
        sunLux: { value: this.sunSystem.sunLux },
        sunColor: { value: this.sunSystem.sunColor },
        skyLum: { value: this.sunSystem.skyLum },
        skyColor: { value: this.sunSystem.skyColor },
        texture: { value: concreteTexture },
        repeat: { value: new AFRAME.THREE.Vector2( 0.1666, 0.1666 ) }
      },
      vertexShader: hemStepsVert,
      fragmentShader: hemStepsFrag
    });

    // const material = new AFRAME.THREE.ShaderMaterial({
    //   uniforms: {
    //     skyLum: { value: this.sunSystem.skyLum },
    //     skyColor: { value: this.sunSystem.skyColor }
    //   },
    //   vertexShader: vertexColorsVert,
    //   fragmentShader: vertexColorsFrag
    // });

    const lightMapMaterial = new AFRAME.THREE.ShaderMaterial({
      uniforms: {
        skyLum: { value: this.sunSystem.skyLum },
        skyColor: { value: this.sunSystem.skyColor },
        lightMap: { value: lightMap },
        texture: { value: concreteTexture },
        repeat: { value: new AFRAME.THREE.Vector2( 0.1666, 0.1666 ) }
      },
      vertexShader: lightMapVert,
      fragmentShader: lightMapFrag
    });

    // material.vertexColors = AFRAME.THREE.VertexColors;
    sunMaterial.vertexColors = AFRAME.THREE.VertexColors;

    // this.material = material;
    this.lightMapMaterial = lightMapMaterial;
    this.sunMaterial = sunMaterial;

		document.querySelector('a-scene').addEventListener('sunTick', updateMaterial.bind(this));
	}
};
