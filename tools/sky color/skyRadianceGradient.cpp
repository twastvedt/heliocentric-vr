#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#include "Eigen/Dense"
#include "easyBMP/EasyBMP.h"
#include "ArHosekSkyModel-1.4a/ArHosekSkyModel.h"
#include "SolarRadiance.h"
#include "ColorSystem.h"


#ifndef PI
#define PI		3.141592653589793
#endif
#ifndef MATH_DEG_TO_RAD
#define MATH_DEG_TO_RAD             ( PI / 180.0 )
#endif
// use the below to change degrees to radians
#ifndef DEGREES
#define DEGREES                     * MATH_DEG_TO_RAD
#endif

#define MAX_SAMPLE_THETA 45 DEGREES

using namespace std;

int main(int argc, char** argv) {

	// take the input for the ArHosekSkyModel
	double turbidity = atof(argv[1]); //double turbidity = (1-10) if you want solar_radiance too (search assert in ArHosekSkyModel.c)
	double albedo = atof(argv[2]);
	int steps = atof(argv[3]);
	int size = atof(argv[4]);
	int samples = atof(argv[5]);

	BMP Output;
	Output.SetSize( size * steps , size );

	Output.SetBitDepth( 24 );

	map<int, double> skyRadiance;
	RGBApixel pixel;
	Eigen::Vector3d sunVector;
	Eigen::Vector3d sampleVector;
	double sunElevation;
	double sampleGamma;
	double samplePhiStep;

	double sampleDistance = MAX_SAMPLE_THETA / (samples - 1);
	double solarStep = (PI / 2.0 - 0.25 DEGREES) / (steps - 1);

	int sampleCount;

	for (int i = 0; i < steps; ++i) {

		sampleCount = 0;

		sunElevation = solarStep * i + 0.25 DEGREES;

		sunVector << cos(sunElevation), 0, sin(sunElevation);

		ArHosekSkyModelState* skyState = arhosekskymodelstate_alloc_init( sunElevation, turbidity, albedo );

		for (double sampleTheta = 0; sampleTheta <= MAX_SAMPLE_THETA; sampleTheta += sampleDistance) {

			if (sampleTheta == 0.0) {
				samplePhiStep = 2.0 * PI;
			} else {
				samplePhiStep = 2.0 * PI * sin(sampleTheta) / round(2.0 * PI * sin(sampleTheta) / sampleDistance);
			}

			for (double samplePhi = 0; samplePhi < 2.0 * PI; samplePhi += samplePhiStep ) {

				sampleVector << sin(sampleTheta) * cos(samplePhi), sin(sampleTheta) * sin(samplePhi), cos(sampleTheta);

				sampleGamma = acos(sunVector.dot(sampleVector));

				for(int lambda = 380; lambda <= 720; lambda += 5) {

					// initialize
					if (!skyRadiance.count(lambda)) {
						skyRadiance[lambda] = 0;
					}

					skyRadiance[lambda] += arhosekskymodel_radiance( skyState, sampleTheta, sampleGamma, lambda );

				}

				sampleCount += 1;
			}
		}

		for(int lambda = 380; lambda <= 720; lambda += 5) {
			skyRadiance[lambda] /= sampleCount;
		}

		ColorSystem colorSystem( ColorData::shared().cs_srgb, ColorData::shared().illuminant_D65 );

		Eigen::Vector3d skyRadXYZ = colorSystem.spec_to_xyz( skyRadiance );
		Eigen::Vector3d skyRadRGB = colorSystem.rgb_to_srgb( colorSystem.rgb_to_srgb( colorSystem.xyz_to_rgb( skyRadXYZ ) ) );

		// Convert Y channel to luminance.
		double luminance = skyRadXYZ[1] * 683.0;

		pixel.Red = skyRadRGB[0] * 255.0;
		pixel.Green = skyRadRGB[1] * 255.0;
		pixel.Blue = skyRadRGB[2] * 255.0;

		//printf("[%lf,%lf,%lf],\n", skyRadRGB[0], skyRadRGB[1], skyRadRGB[2]);
		printf("%lf,\n", luminance);

		for (int x = i * size; x < (i+1) * size; ++x) {
			for (int y = 0; y < size; ++y) {

				Output.SetPixel( x, y, pixel );
			}
		}
	}

	Output.WriteToFile( "skyRadianceGradient.bmp" );

	return 0;
}
