AFRAME = require('aframe');

let parentPos = {x: 0, y: 0, z: 0};
let tempPos = {x: 0, y: 0, z: 0};

interface thisOb {
	data?: {
		parent: AFrame.Entity;
		offset: { x: number, y: number, z: number };
	}
}

export const CopyPositionComp: AFrame.ComponentDefinition<thisOb> = {
  schema: {
		parent: { type: 'selector' },
		offset: { type: 'vec3' }
	},

	tick: function() {
		parentPos = this.data.parent.components.position.data;

		tempPos.x = parentPos.x + this.data.offset.x;
		tempPos.y = parentPos.y + this.data.offset.y;
		tempPos.z = parentPos.z + this.data.offset.z;

		this.el.setAttribute('position', tempPos);
	}
};
