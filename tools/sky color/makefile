CFLAGS = -g

objects = ArHosekSkyModel.o EasyBMP.o SolarRadiance.o ColorSystem.o

skyRadianceGradient: skyRadianceGradient.cpp $(objects)
	g++ $(CFLAGS) -I . $(objects) skyRadianceGradient.cpp -o skyRadianceGradient

solarRadianceGradient: solarRadianceGradient.cpp $(objects)
	g++ $(CFLAGS) -I . $(objects) solarRadianceGradient.cpp -o solarRadianceGradient

hwBitmap: hwBitmap.cpp $(objects)
	g++ $(CFLAGS) $(objects) hwBitmap.cpp -o hwBitmap

EasyBMP.o: easyBMP/EasyBMP.cpp easyBMP/EasyBMP*.h
	g++ $(CFLAGS) -c easyBMP/EasyBMP.cpp -o EasyBMP.o

ArHosekSkyModel.o: ArHosekSkyModel-1.4a/ArHosekSkyModel.c ArHosekSkyModel-1.4a/ArHosekSkyModel.h
	g++ $(CFLAGS) -std=c99 -c ArHosekSkyModel-1.4a/ArHosekSkyModel.c -o ArHosekSkyModel.o

SolarRadiance.o: SolarRadiance.cpp SolarRadiance.h
	g++ $(CFLAGS) -c SolarRadiance.cpp -o SolarRadiance.o

ColorSystem.o: ColorSystem.cpp ColorSystem.h
	g++ $(CFLAGS) -c -I . ColorSystem.cpp -o ColorSystem.o

clean:
	rm -f $(objects)
	rm -f hwBitmap.exe
	rm -f solarRadianceGradient.exe
