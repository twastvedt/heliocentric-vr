#include "easyBMP/EasyBMP.h"
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "ArHosekSkyModel-1.4a/ArHosekSkyModel.h"

#define num_channels 3 		// RGB

#define size 256

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

typedef struct point {
    double x;
    double y;
	double z;
} Point;

double get_gamma(Point s, Point c){
	double angle = 0; //use formula: cos(gamma) = a*b/|a|*|b|, a,b are 3d vectors

	// do the calculations
	double product = s.x * c.x + s.y * c.y + s.z * c.z;
	double s_magnitude = sqrt (s.x * s.x + s.y * s.y + s.z * s.z);
	double c_magnitude = sqrt (c.x * c.x + c.y * c.y + c.z * c.z);
	double cos_gamma = product / (s_magnitude * c_magnitude);

	return acos(cos_gamma);
}

int main(int argc, char** argv) {

    BMP Output;
    Output.SetSize( size , size );


    Output.SetBitDepth( 24 );

    // take the input for the ArHosekSkyModel
	double turbidity = atof(argv[1]); //double turbidity = (1-10) if you want solar_radiance too (search assert in ArHosekSkyModel.c)
	double albedo[num_channels];
	for ( unsigned int i = 0; i < num_channels; i++ ){
        albedo[i] = atof(argv[2]);
    }
    double solarAzimuthRad = atof(argv[3]) DEGREES;
    double solarZenithRad = atof(argv[4]) DEGREES;

    double theta, gamma; // the angles used in the ArHosekSkyModel
    int xC, yC;
    int radius = size / 2.0;
    double r;

    double maxValues[3] = {0.0, 0.0, 0.0};

    Point sunPoint;
    sunPoint.x = radius * sin(solarZenithRad) * cos(solarAzimuthRad);
    sunPoint.y = radius * sin(solarZenithRad) * sin(solarAzimuthRad);
    sunPoint.z = radius * cos(solarZenithRad);

	ArHosekSkyModelState *skymodel_state[num_channels];
    for ( unsigned int i = 0; i < num_channels; i++ ){
        skymodel_state[i] = arhosek_rgb_skymodelstate_alloc_init(turbidity, albedo[i], PI / 2.0 - solarZenithRad);
    }

    RGBApixel pixel;

    for (int x = 0; x < size; ++x) {

        for (int y = 0; y < size; ++y) {
            Point c{ (double)(x - radius), (double)(y - radius), 0 };

            r = sqrt(pow(c.x, 2.0) + pow(c.y, 2.0));

            if (r < radius) {
                c.z = sqrt(pow(radius, 2.0) - pow(r, 2.0));
                theta = asin( r / radius );
                gamma = get_gamma( sunPoint, c );

                pixel.Red   = arhosek_tristim_skymodel_radiance( skymodel_state[0], theta, gamma, 0 ) * 7.0;
                pixel.Green = arhosek_tristim_skymodel_radiance( skymodel_state[1], theta, gamma, 1 ) * 7.0;
                pixel.Blue  = arhosek_tristim_skymodel_radiance( skymodel_state[2], theta, gamma, 2 ) * 7.0;

                maxValues[0] = maxValues[0] < pixel.Red ? pixel.Red : maxValues[0];
                maxValues[1] = maxValues[1] < pixel.Green ? pixel.Green : maxValues[1];
                maxValues[2] = maxValues[2] < pixel.Blue ? pixel.Blue : maxValues[2];

            } else {
                pixel.Red = pixel.Green = pixel.Blue = 0;
            }

            Output.SetPixel( x, y, pixel );
        }
    }

	for ( unsigned int i = 0; i < num_channels; i++ ) {
        arhosekskymodelstate_free(skymodel_state[i]);
    }

    Output.WriteToFile( "test.bmp" );

    printf("%lf,%lf,%lf,\n",maxValues[0], maxValues[1], maxValues[2]);

    return 0;
}