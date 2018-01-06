##
# # Color Vertices - Ambient
# # Author: Trygve Wastvedt (www.trygvewastvedt.com)
# # Created for: Heliocentric Architecture VR (https://github.com/twastvedt/heliocentric-vr)
# 
# A Blender script which sets the vertex colors of selected meshes to represent the ambient
# light level at that point created by a rectangular skylight centered at (0,0,0). Highly specific
# to a particular geometry. (See link above.)
#
##

import bpy
import mathutils
import math

print('start')

# Half width and length of skylight
shW = 0.4
shL = 60.25

# Calculate solid angle
solidAngleB = True
# Add component for illumination from top windows.
ringB = True
# Add to (True), or replace (False) existing values in the red channel of the vertex colors.
addB = False

skylightRect = [ 
    mathutils.Vector((shL, shW, 0)), 
    mathutils.Vector((shL, -shW, 0)),
    mathutils.Vector((-shL, -shW, 0)), 
    mathutils.Vector((-shL, shW, 0)) 
]

maxV = 0

for obj in bpy.context.selected_objects:
    
    mesh = obj.data 
    scn = bpy.context.scene
    
    # Check if our mesh already has vertex colors and if not add some. 
    # Must be active object.
    scn.objects.active = obj
    obj.select = True
    
    if mesh.vertex_colors:
        vcol_layer = mesh.vertex_colors.active
    else:
        vcol_layer = mesh.vertex_colors.new()

    for poly in mesh.polygons:
        for loop_index in poly.loop_indices:
            loop_vert_index = mesh.loops[loop_index].vertex_index
            v = mesh.vertices[loop_vert_index]
            
            area = 0
            
            if solidAngleB:
                # Calculate solid angle of skylight at this vertex
                
                for i in range(4):
                    v0 = (skylightRect[(i-1) % 4] - v.co).normalized()
                    v1 = (skylightRect[i] - v.co).normalized()
                    v2 = (skylightRect[(i+1) % 4] - v.co).normalized()
                    
                    area += v1.cross(v0).angle(v1.cross(v2))
                
                area -= 2 * math.pi
                
                # If plane of surface comes close to origin, part of the skylight might not be visible from the surface.
                dToOrigin = -(poly.normal.dot(v.co))
                #print("d: ", dToOrigin)
                
                f = 1
                
                if poly.normal.x != 0 and \
                (poly.normal.y == 0 or abs(poly.normal.x / poly.normal.y) > (shW / shL)):
                    x = -dToOrigin / poly.normal.x
                    #print("x: ", x)
                    f = min(max(0, 0.5 + (1 if dToOrigin>0 else -1) * abs(x) / (2*shL)), 1)
                    
                elif poly.normal.y != 0:
                    y = -dToOrigin / poly.normal.y
                    #print("y: ", y)
                    f = min(max(0, 0.5 + (1 if dToOrigin>0 else -1) * abs(y) / (2*shW)), 1)
                    
                #print("f: ", f)
                area *= f
            
            if ringB:
                # Add in a term to represent light coming from windows at top of space. 
                # This is a hack, but is based on observations from path-traced renderings of the space.
                ringF = min(max(0, ((v.co.z + 75) / 75) ** 3), 1)
                
                area += ringF * 0.005
                
            if addB:
                # Add in existing value.
                area += vcol_layer.data[loop_index].color[0]
            
            maxV = max(maxV, area)
            
            # Set red channel of vertex color to solid angle of skylight * 10 .
            # (Based on observations of max, to allow for finer gradations. Shader will divide values by 10.
            vcol_layer.data[loop_index].color[0] = area * 10
            
print("max: ", maxV)