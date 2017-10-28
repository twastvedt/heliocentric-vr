- Light level
Vertex colors (red channel) calculated in Blender, interpolated in fragment shader.

- AO
Vertex colors (blue channel) calculated in Blender. Vary high points based on distance to low points so that AO shading distance remains constant.

- Diffuse (?)
Use light level as point light at (0,0,0) with orenNayar to calculate brightness.

- Direct
Calculate x,y position on z=0 plane, projected along light direction, in vertex shader. Use projected position to brighten color in fragment shader.