AFRAME = require('aframe');

let parentPos = new AFRAME.THREE.Vector3();
let tempPos = {x: 0, y: 0, z: 0};

interface CopyPosition extends AFrame.Component {
	data: {
		parent: AFrame.Entity;
		offset: { x: number, y: number, z: number };
	}
}

export const CopyPositionComp: AFrame.ComponentDefinition<CopyPosition> = {
  schema: {
		parent: { type: 'selector' },
		offset: { type: 'vec3' }
	},

	tick: function(this: CopyPosition) {
		parentPos = this.data.parent.object3D.getWorldPosition();

		tempPos.x = parentPos.x + this.data.offset.x;
		tempPos.y = parentPos.y + this.data.offset.y;
		tempPos.z = parentPos.z + this.data.offset.z;

		this.el.setAttribute('position', tempPos);
	}
};
