##
# # Beautify Tris
# # Author: Trygve Wastvedt (www.trygvewastvedt.com)
# 
# A Blender script which rotates edges on a mesh of triangles to minimize their length.
# Maintains sharp edges and ignores quads and n-gons. 
#
##

import bpy
import mathutils
import math
import bmesh


mesh = bpy.context.object.data 

bm = bmesh.from_edit_mesh(mesh)

count = 0

for edge in bm.edges:
    edge.select = False
    
    if edge.smooth:
        altVerts = []
        for face in edge.link_faces:
            for vert in face.verts:
                if vert not in edge.verts:
                    #only one of these per connected face, unless there are quads.
                    altVerts.append(vert)
                
        if len(altVerts) == 2:
            altDist = (altVerts[1].co - altVerts[0].co).length
            
            if altDist < edge.calc_length():
                #this edge crosses its quad the long way. Rotate!
                
                testPtRel = (altVerts[0].co + altVerts[1].co) / 2 - edge.verts[0].co
                edgeVec = edge.verts[1].co - edge.verts[0].co
                factor = edgeVec.dot(testPtRel) / edgeVec.dot(edgeVec)
                
                if (factor > 0.15 and factor < 0.85):
                    newEdge = bmesh.utils.edge_rotate(edge, True)
                    if newEdge:
                        newEdge.select = True
                        count += 1
        else:
            print(len(altVerts))

bmesh.update_edit_mesh(mesh, True, True)
print("Rotated edges: " + str(count))