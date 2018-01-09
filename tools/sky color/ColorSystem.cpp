/**
 * Color System
 * Author: Trygve Wastvedt (trygvewastvedt.com)
 *
 * A Color System object to facilitate conversion among RGB, XYZ, and spectral radiance.
 * Converted from the Python code at https://scipython.com/blog/converting-a-spectrum-to-a-colour/
 * Using explanation and some alternate math from http://www.ryanjuckett.com/programming/rgb-color-space-conversion/
 * */

#include <stdlib.h>
#include <math.h>
#include <iostream>
#include <string>
#include <fstream>
#include <map>

#include "Eigen/Dense"
#include "ColorSystem.h"


using namespace std;
using namespace Eigen;

Vector3d xyz_from_xy(double x, double y) {
	// Return the vector (x, y, 1-x-y).
	return { x, y, 1 - x - y };
}

const Vector3d ColorData::illuminant_D65 = xyz_from_xy( 0.3127, 0.3291 );

const Matrix3d ColorData::cs_hdtv = (Matrix3d() << xyz_from_xy(0.67, 0.33), xyz_from_xy(0.21, 0.71), xyz_from_xy(0.15, 0.06)).finished();

const Matrix3d ColorData::cs_smpte = (Matrix3d() << xyz_from_xy(0.63, 0.34), xyz_from_xy(0.31, 0.595), xyz_from_xy(0.155, 0.070)).finished();

const Matrix3d ColorData::cs_srgb = (Matrix3d() << xyz_from_xy(0.64, 0.33), xyz_from_xy(0.30, 0.60), xyz_from_xy(0.15, 0.06)).finished();

ColorSystem::ColorSystem ( const Vector3d &red, const Vector3d &green, const Vector3d &blue, const Vector3d &white ) {

	// The chromaticity matrix (rgb -> xyz) and its inverse
	M << red, green, blue;

	MI = M.inverse();

	// White scaling array
	wscale = MI * white;

	Matrix3d wscaleM;

	wscaleM << wscale, wscale, wscale;

	// xyz -> rgb transformation matrix
	T = MI.cwiseQuotient(wscaleM);
};

ColorSystem::ColorSystem ( const Matrix3d &conversionMatrix, const Vector3d &white )
	: M ( conversionMatrix ) {

	MI = M.inverse();

	// Convert white from xyz to XYZ
	Vector3d wXYZ = 1.0 / white[1] * white;

	// White scaling array
	wscale = MI * wXYZ;

	// // xyz -> rgb transformation matrix
	T = wscale.asDiagonal().inverse() * MI;
};


Vector3d ColorSystem::xyz_to_rgb( const Vector3d &xyz, double maxValue ) {
	// Transform from xyz to rgb representation of colour.

	// The output rgb components are normalized on maxValue, or their maximum
	// value if maxValue is 0. If xyz is out the rgb gamut, it is desaturated until it
	// comes into gamut.

	Vector3d rgb = T * xyz;

	if (rgb[0] < 0.0 || rgb[1] < 0.0 || rgb[2] < 0.0) {
		// We're not in the RGB gamut: approximate by desaturating

		double w = rgb.minCoeff();

		rgb[0] -= w;
		rgb[1] -= w;
		rgb[2] -= w;
	}

	if ( !(rgb[0] == 0.0 && rgb[1] == 0.0 && rgb[2] == 0.0) ) {
		if (maxValue == 0.0) {
			maxValue = rgb.maxCoeff();
		}

		rgb /= maxValue;
	}

	return rgb;
};

Vector3d ColorSystem::spec_to_xyz( const map<int, double> &spec ) {
	// Convert a spectrum to an xyz point.

	Vector3d XYZ = { 0, 0, 0};

	for(auto& x : spec) {
		Vector3d factor = x.second * ColorData::shared().cmfData[x.first];
		XYZ += factor;
	}

	// 5: spacing between wavelength measurements.
	return XYZ * 5.0;
};

Vector3d ColorSystem::spec_to_rgb( const map<int, double> &spec ) {
	// Convert a spectrum to an rgb value.

	Vector3d xyz = spec_to_xyz( spec );

	return xyz_to_rgb( xyz );
};

Vector3d ColorSystem::rgb_to_srgb( const Vector3d &rgb ) {
	// Convert rgb color to a gamma corrected srgb value.

	Vector3d srgb = {0, 0, 0};

	for (int c = 0; c < 3; ++c) {
		srgb[c] = (rgb[c] <= 0.0031308) ? 12.92 * rgb[c] : 1.055 * pow( rgb[c], 1.0 / 2.4 ) - 0.055;
	}

	return srgb;
};
