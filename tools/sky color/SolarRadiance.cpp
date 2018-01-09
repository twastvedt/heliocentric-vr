/**
 * Solar Radiance
 * Author: Trygve Wastvedt (trygvewastvedt.com)
 *
 * Uses the Hosek-Wilkie sky model to calculate the radiance of the visible sunlight for a given solar elevation.
 * */

#include "easyBMP/EasyBMP.h"
#include "ArHosekSkyModel-1.4a/ArHosekSkyModel.h"

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <assert.h>
#include <vector>
#include <map>

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

using namespace std;

typedef struct point {
    double x;
    double y;
	double z;
} Point;

const double SunSize = 0.254 DEGREES;  // Angular radius of the sun from Earth

Point SquareToConcentricDiskMapping(double x, double y)
{
    double phi = 0.0f;
    double r = 0.0f;

    // -- (a,b) is now on [-1,1]ˆ2
    double a = 2.0f * x - 1.0f;
    double b = 2.0f * y - 1.0f;

    if(a > -b)                      // region 1 or 2
    {
        if(a > b)                   // region 1, also |a| > |b|
        {
            r = a;
            phi = (PI / 4.0f) * (b / a);
        }
        else                        // region 2, also |b| > |a|
        {
            r = b;
            phi = (PI / 4.0f) * (2.0f - (a / b));
        }
    }
    else                            // region 3 or 4
    {
        if(a < b)                   // region 3, also |a| >= |b|, a != 0
        {
            r = -a;
            phi = (PI / 4.0f) * (4.0f + (b / a));
        }
        else                        // region 4, |b| >= |a|, but a==0 and b==0 could occur.
        {
            r = -b;
            if(b != 0)
                phi = (PI / 4.0f) * (6.0f - (a / b));
            else
                phi = 0;
        }
    }

    Point result{ r * cos(phi), r * sin(phi), 0};
    return result;
}


map<int, double> SolarRadiance(double elevation, double turbidity, double albedo, int nDiscSamples) {

    map<int, double> solarRadiance;

    ArHosekSkyModelState* skyState = arhosekskymodelstate_alloc_init(elevation, turbidity, albedo);

    for(int x = 0; x < nDiscSamples; ++x) {
        for(int y = 0; y < nDiscSamples; ++y) {

            double u = (x + 0.5f) / nDiscSamples;
            double v = (y + 0.5f) / nDiscSamples;
            Point discSamplePos = SquareToConcentricDiskMapping(u, v);

            double theta = (PI / 2.0f) - elevation + discSamplePos.y * SunSize;
            double gamma = sqrt( pow(discSamplePos.x, 2) + pow(discSamplePos.y, 2) ) * SunSize;

            if (theta > PI / 2.0) {
                theta = (PI / 2.0f) - elevation - discSamplePos.y * SunSize;
            }

            for(int lambda = 380; lambda <= 720; lambda += 5) {

                // initialize
                if (!solarRadiance.count(lambda)) {
                    solarRadiance[lambda] = 0;
                }

                solarRadiance[lambda] += arhosekskymodel_solar_radiance(skyState, theta, gamma, lambda) / pow( nDiscSamples, 2.0 );

            }
        }
    }

    arhosekskymodelstate_free(skyState);

    return solarRadiance;
}
