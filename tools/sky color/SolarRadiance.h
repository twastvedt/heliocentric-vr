#include "easyBMP/EasyBMP.h"
#include "ArHosekSkyModel-1.4a/ArHosekSkyModel.h"

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <assert.h>
#include <vector>
#include <map>

typedef struct point {
    double x;
    double y;
	double z;
} Point;

Point SquareToConcentricDiskMapping(double x, double y);

std::map<int, double> SolarRadiance(double elevation, double turbidity, double albedo, int nDiscSamples);
