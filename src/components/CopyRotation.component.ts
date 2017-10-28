AFRAME = require('aframe');

let parentRot = {x: 0, y: 0, z: 0};
let tempRot = {x: 0, y: 0, z: 0};

interface thisOb extends AFrame.Component {
	data: {
		parent: AFrame.Entity;

		/**
		 * Rotation values to add to parent rotation, in degrees.
		 */
		offset: { x: number, y: number, z: number };

		/**
		 * Control which rotation axes are copied. 1: copy, 0: don't copy.
		 */
		mask: { x: number, y: number, z: number }
	}
}

export const CopyRotationComp: AFrame.ComponentDefinition<thisOb> = {
  schema: {
		parent: { type: 'selector' },
		offset: { type: 'vec3' },
		mask: { type: 'vec3', default: { x: 1, y: 1, z: 1 } }
	},

	tick: function() {
		tempRot = this.el.components.rotation.data;
		parentRot = this.data.parent.components.rotation.data;

		if (this.data.mask.x) {
			tempRot.x = parentRot.x + this.data.offset.x;
		}

		if (this.data.mask.y) {
			tempRot.y = parentRot.y + this.data.offset.y;
		}

		if (this.data.mask.z) {
			tempRot.z = parentRot.z + this.data.offset.z;
		}

		this.el.setAttribute('rotation', tempRot);
	}
};
