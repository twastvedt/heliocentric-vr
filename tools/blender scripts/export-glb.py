##
# # Export glb
# # Author: Trygve Wastvedt (www.trygvewastvedt.com)
# 
# A Blender script which exports all selected objects as separate .glb files using their names.
# Use with this plugin: https://github.com/Kupoman/blendergltf.
#
##


objects = bpy.context.selected_objects
import bpy

exportFolder = 'C:/export/folder/'
for object in objects:
    bpy.ops.object.select_all(action='DESELECT')
    object.select = True
    exportName = exportFolder + object.name + '.glb'
    bpy.ops.export_scene.gltf(
        filepath=exportName,
        axis_forward='-Z', 
        axis_up='Y', 
        draft_prop=False, 
        nodes_export_hidden=False, 
        nodes_selected_only=True, 
        materials_disable=True, 
        meshes_apply_modifiers=True, 
        meshes_interleave_vertex_data=False, 
        animations_object_export='ACTIVE',
        animations_armature_export='ACTIVE', 
        images_data_storage='COPY', 
        images_allow_srgb=False, 
        buffers_embed_data=True, 
        buffers_combine_data=True, 
        asset_version='2.0', 
        asset_profile='WEB', 
        gltf_export_binary=True, 
        pretty_print=True, 
        blocks_prune_unused=True, 
        enable_actions=False, 
        enable_cameras=False, 
        enable_lamps=False, 
        enable_materials=False, 
        enable_meshes=True, 
        enable_textures=False
    )