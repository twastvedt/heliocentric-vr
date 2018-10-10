AFRAME = require('aframe');

const SunCalc = require('suncalc');

let tempColor = [0, 0, 0];

export interface Sun extends AFrame.System {
	data: {
		dateTime: Date;
		longitude: number;
		latitude: number;
		speed: number;
		accuracy: number;
	};
	paused: boolean;
	scene: AFrame.ANode;
	sunVec: THREE.Vector3;
	sunSpherical: THREE.Spherical;
	sunPos: SunCalc.SunPosition;
	sunLux: number;
	sunColor: [number, number, number];
	skyLum: number;
	skyColor: [number, number, number];
	sunSky: AFrame.Entity;
	throttledTick: (this: this, t: number, dt: number) => void;
	interpolate: (this: this, value: number, list: number[]) => number;
	interpolateList: (this: this, value: number, list: number[][], dest: number[]) => number[];
}

export const SunSystem: AFrame.SystemDefinition<Sun> = {
  schema: {
		dateTime: {
			default: new Date( Date.UTC( 2017, 6, 22, 0, 0, 0, 0 ) ),
			parse: function(value) {
				return new Date(value);
			}
		},
		longitude: { default: 0 },
		latitude: { default: 78 },
		// Multiplier to increase simulation speed.
		speed: { default: 1000 },
		// Update frequency, in (actual time) seconds.
		accuracy: { default: 1 }
	},

	init: function () {
		this.scene = document.querySelector('a-scene');

		this.sunSky = this.scene.querySelector('a-sun-sky');

		this.sunVec = new AFRAME.THREE.Vector3( 0, -1, 0 );
		this.sunSpherical = new AFRAME.THREE.Spherical();
		this.sunPos = SunCalc.getPosition( this.data.dateTime, this.data.latitude, this.data.longitude );
		this.sunLux = 0;
		this.sunColor = [0, 0, 0];
		this.skyLum = 0;
		this.skyColor = [0, 0, 0];

		this.tick = AFRAME.utils.throttleTick(this.throttledTick, this.data.accuracy * 1000 / this.data.speed, this);

		const that = this;
		this.scene.addEventListener('pause', () => {
			that.paused = true;
		});
	},

  /**
   * Tick function that will be wrapped to be throttled.
   */
  throttledTick: function(t: number, dt: number) {
		if (this.paused) {
			this.paused = false;
		} else {
			this.data.dateTime.setTime(this.data.dateTime.getTime() + dt * this.data.speed);

			this.sunPos = SunCalc.getPosition( this.data.dateTime, this.data.latitude, this.data.longitude );

			this.sunSpherical.set( 1, Math.PI / 2 - this.sunPos.altitude, -this.sunPos.azimuth );

			this.sunVec.setFromSpherical( this.sunSpherical );

			if (this.sunSpherical.phi < Math.PI / 2) {
				// Sun is above the horizon.

				this.sunLux = this.interpolate( 1 - this.sunSpherical.phi / (Math.PI / 2), sunLuxValues );

				this.interpolateList( 1 - this.sunSpherical.phi / (Math.PI / 2), sunRGBValues, this.sunColor );

				this.skyLum = this.interpolate( 1 - this.sunSpherical.phi / (Math.PI / 2), skyLuminanceValues );

				this.interpolateList( 1 - this.sunSpherical.phi / (Math.PI / 2), skyRGBValues, this.skyColor );

			} else if (this.sunSpherical.phi < 1.884955592153876) {
				// Twilight: up to 18 degrees below horizon (phi < 108 degrees).

				let twilightFactor = 1 - (this.sunSpherical.phi - (Math.PI / 2)) / 0.3141592653589793;

				this.sunLux = 0;

				this.skyLum = skyLuminanceValues[0] * twilightFactor;

				this.skyColor = skyRGBValues[0];

			} else {
				this.sunLux = this.skyLum = 0;
			}

			// this.sunSky.setAttribute( 'material', 'sunPosition', { x: this.sunVec.x, y: this.sunVec.y, z: this.sunVec.z } );

			// Create an event on the scene element which can be listened to by other components.
			this.scene.emit('sunTick', {}, false);
		}
	},

	/**
	 * Evaluate list of lists with decimal number by interpolation.
	 * @param value [0-1]: Point to evaluate in list.
	 * @param list List of lists of values to interpolate.
	 */
	interpolateList: function(value: number, list: number[][], dest: number[]){
		const n = (list.length - 1),
			i = Math.floor( value * n ),
			f = value * n - i;

		for (let j = 0; j < list[0].length; j += 1) {
			dest[j] = (list[i+1][j] - list[i][j]) * f + list[i][j];
		}

		return dest;
	},

	interpolate: function(value: number, list: number[]){
		const n = (list.length - 1),
		i = Math.floor( value * n ),
		f = value * n - i;

		return (list[i+1] - list[i]) * f + list[i];
	}
};


// Generated from Hosek-Wilkie sky model. Turbidity 1.0, Albedo 0.5.
const sunRGBValues: [number, number, number][] = [
	[1.000000,0.712447,0.000000],
	[1.000000,0.818249,0.389460],
	[1.000000,0.871649,0.627118],
	[1.000000,0.899718,0.717218],
	[1.000000,0.916498,0.769018],
	[1.000000,0.927502,0.802737],
	[1.000000,0.935168,0.826451],
	[1.000000,0.940847,0.843924],
	[1.000000,0.945105,0.857339],
	[1.000000,0.948472,0.867827],
	[1.000000,0.951175,0.876323],
	[1.000000,0.953385,0.883302],
	[1.000000,0.955234,0.889084],
	[1.000000,0.956734,0.893927],
	[1.000000,0.958025,0.898083],
	[1.000000,0.959128,0.901622],
	[1.000000,0.960062,0.904632],
	[1.000000,0.960870,0.907238],
	[1.000000,0.961576,0.909519],
	[1.000000,0.962188,0.911502],
	[1.000000,0.962720,0.913226],
	[1.000000,0.963188,0.914737],
	[1.000000,0.963586,0.916033],
	[1.000000,0.963919,0.917130],
	[1.000000,0.964202,0.918064],
	[1.000000,0.964444,0.918862],
	[1.000000,0.964647,0.919519],
	[1.000000,0.964811,0.920043],
	[1.000000,0.964937,0.920428],
	[1.000000,0.965021,0.920697],
	[1.000000,0.965067,0.920875],
	[1.000000,0.965092,0.920967]
];

const sunLuxValues = [
	4945.356737,
	21485.800587,
	38082.299975,
	50635.946538,
	59746.939758,
	66485.869491,
	71594.788999,
	75589.753827,
	78760.234599,
	81335.695709,
	83469.785088,
	85240.901814,
	86739.721566,
	88018.323561,
	89114.256875,
	90057.936976,
	90876.709234,
	91595.476326,
	92216.794799,
	92760.713570,
	93240.902436,
	93653.895005,
	94010.376992,
	94319.700818,
	94580.748799,
	94802.208662,
	94985.252847,
	95133.056849,
	95249.365022,
	95325.633383,
	95363.738810,
	95381.338817
];

const skyRGBValues: [number, number, number][] = [
	[0.979509,0.998359,1.000000],
	[0.840754,0.928285,1.000000],
	[0.798561,0.904705,1.000000],
	[0.779818,0.893416,1.000000],
	[0.769774,0.885691,1.000000],
	[0.764713,0.879293,1.000000],
	[0.763022,0.873831,1.000000],
	[0.763777,0.869621,1.000000],
	[0.766285,0.867043,1.000000],
	[0.769796,0.866301,1.000000],
	[0.773995,0.867644,1.000000],
	[0.777204,0.870396,1.000000],
	[0.779618,0.874642,1.000000],
	[0.779368,0.879321,1.000000],
	[0.774490,0.883369,1.000000],
	[0.764588,0.886143,1.000000]
];

const skyLuminanceValues = [
	528.053357,
	1325.278173,
	1830.730977,
	2236.130145,
	2593.860549,
	2918.727009,
	3215.451867,
	3488.685453,
	3742.285214,
	3979.614256,
	4208.992708,
	4421.000229,
	4624.210929,
	4799.485053,
	4924.092118,
	4986.641369
];

