/**
 * Solar Radiance Gradient
 * Author: Trygve Wastvedt (trygvewastvedt.com)
 *
 * Uses the Hosek-Wilkie sky model to calculate the radiance of the visible sunlight for a range of solar elevations.
 * */

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

using namespace std;

int main(int argc, char** argv) {

  if ( argc != 5 ) { // argc should be 5 for correct execution
    // We print argv[0] assuming it is the program name
    printf("usage: %s <turbidity (1-10)> <albedo (0-1)> <solar elevation steps> <size of bitmap>\n", argv[0]);

    return 1;
  }

  // take the input for the ArHosekSkyModel
  double turbidity = atof(argv[1]); //double turbidity = (1-10) if you want solar_radiance too (search assert in ArHosekSkyModel.c)
  double albedo = atof(argv[2]);
  int steps = atof(argv[3]);
  int size = atof(argv[4]);

  BMP Output;
  Output.SetSize( size * steps , size );

  Output.SetBitDepth( 24 );

  double solarStep = (PI / 2.0 - 0.25 DEGREES) / (steps - 1);

  map<int, double> solarRadiance;
    RGBApixel pixel;

  for (int i = 0; i < steps; ++i) {

    solarRadiance = SolarRadiance( solarStep * i + 0.25 DEGREES, turbidity, albedo, 8 );

    ColorSystem colorSystem( ColorData::shared().cs_srgb, ColorData::shared().illuminant_D65 );

    Eigen::Vector3d solarRadXYZ = colorSystem.spec_to_xyz( solarRadiance );
    Eigen::Vector3d solarRadRGB = colorSystem.rgb_to_srgb( colorSystem.rgb_to_srgb( colorSystem.xyz_to_rgb( solarRadXYZ ) ) );

    // Convert Y channel to luminance.
    double luminance = solarRadXYZ[1] * 683.0;
    // Multiply by solid angle of sun to get lux.
    double lux = luminance * 0.000069;

    pixel.Red = solarRadRGB[0] * 255.0;
    pixel.Green = solarRadRGB[1] * 255.0;
    pixel.Blue = solarRadRGB[2] * 255.0;

    //printf("%lf,\n", lux);
    printf("[%lf,%lf,%lf],\n", solarRadRGB[0], solarRadRGB[1], solarRadRGB[2]);

    for (int x = i * size; x < (i+1) * size; ++x) {
      for (int y = 0; y < size; ++y) {

        Output.SetPixel( x, y, pixel );
      }
    }
  }

  Output.WriteToFile( "solarRadianceGradient.bmp" );

  return 0;
}
