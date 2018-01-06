#include <stdlib.h>
#include <math.h>
#include <iostream>
#include <string>
#include <fstream>
#include <map>

#include "Eigen/Dense"

/*
Converted from the Python code at https://scipython.com/blog/converting-a-spectrum-to-a-colour/
Using explanation and some alternate math from http://www.ryanjuckett.com/programming/rgb-color-space-conversion/
*/

Eigen::Vector3d xyz_from_xy(double x, double y);

class ColorData {

	ColorData() {
		std::ifstream file("cie-cmf.txt");

		if (file.is_open()) {

			int lambda;
			double x, y, z;

			while (file >> lambda >> x >> y >> z) {
				cmfData[lambda] = { x, y, z };
			}
		}
	};

public:
	std::map<int, Eigen::Vector3d> cmfData;

	static const Eigen::Vector3d illuminant_D65;

	static const Eigen::Matrix3d cs_hdtv;
	static const Eigen::Matrix3d cs_smpte;
	static const Eigen::Matrix3d cs_srgb;

	static ColorData &shared() {static ColorData data; return data;}
};

class ColorSystem {
	// A class representing a color system.

	// A color system defined by the CIE x, y and z=1-x-y coordinates of
	// its three primary illuminants and its "white point".

	// The CIE color matching function for 380 - 780 nm in 5 nm intervals


	Eigen::Matrix3d M;
	Eigen::Matrix3d MI;
	Eigen::Vector3d wscale;
	Eigen::Matrix3d T;

public:

	ColorSystem ( const Eigen::Vector3d &, const Eigen::Vector3d &, const  Eigen::Vector3d &, const Eigen::Vector3d & );

	ColorSystem ( const Eigen::Matrix3d &, const Eigen::Vector3d & );

	Eigen::Vector3d xyz_to_rgb( const Eigen::Vector3d &, double maxValue = 0.0 );

	Eigen::Vector3d spec_to_xyz( const std::map<int, double> & );

	Eigen::Vector3d spec_to_rgb( const std::map<int, double> & );

	Eigen::Vector3d rgb_to_srgb( const Eigen::Vector3d & );
};
