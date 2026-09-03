# WebGL Lighting Basic

This project is a WebGL teaching example for real-time 3D lighting. It starts with basic shaded sphere demos and then includes a more interactive comprehensive demo where the user can explore ambient, diffuse, and specular lighting with live controls.

The project is intended to teach the fundamentals of:

- shader programming
- lighting models in computer graphics
- surface normals
- point lights and view transforms
- per-vertex versus per-fragment shading
- interactive visual experimentation in WebGL

## What the samples teach

### 1. Basic sphere lighting
The files [shadedSphere1.html](shadedSphere1.html) and [shadedSphere1.js](shadedSphere1.js) demonstrate a classic shaded sphere using true normals and per-vertex lighting.

This teaches how a surface is lit based on:

- the light direction
- the normal vector
- the view direction
- ambient, diffuse, and specular contributions

### 2. Fragment-based lighting
The files [shadedSphere4.html](shadedSphere4.html) and [shadedSphere4.js](shadedSphere4.js) compute the lighting in the fragment shader.

This illustrates the difference between:

- per-vertex shading
- per-fragment shading

Per-fragment shading often produces smoother and more accurate lighting results.

### 3. Interactive lighting comparison
The file [Comprehensive.html](Comprehensive.html) and [Comprehensive.js](Comprehensive.js) show a single cube with independently controlled lighting components.

The demo allows the viewer to:

- enable or disable ambient, diffuse, and specular lighting
- change the color of each lighting component
- show or hide the diffuse light marker
- move the specular light source in X, Y, and Z
- show or hide the specular light marker

This makes it easy to see how each lighting term affects the appearance of a 3D object.

## Core graphics concepts

The project uses a Phong-style lighting model:

- Ambient: a constant base light level
- Diffuse: depends on the angle between the light and surface normal
- Specular: creates bright highlights based on the viewer and reflection direction

The lighting equation is roughly:

- ambient = uAmbientColor
- diffuse = max(dot(L, N), 0) * uDiffuseColor
- specular = pow(max(dot(V, R), 0), shininess) * uSpecularColor

where:

- L is the direction to the light
- N is the surface normal
- V is the direction to the viewer
- R is the reflected light vector

## Sphere generation

The sphere examples are not created from a standard latitude-longitude grid. Instead, they start with a tetrahedron and repeatedly subdivide it.

Each subdivision creates more triangles, and the vertices are normalized to lie on a spherical surface. This is a common teaching technique for generating smooth sphere meshes from a simple primitive.

## Files in this project

- [shadedSphere1.html](shadedSphere1.html) and [shadedSphere1.js](shadedSphere1.js)
  - classic per-vertex shaded sphere

- [shadedSphere4.html](shadedSphere4.html) and [shadedSphere4.js](shadedSphere4.js)
  - per-fragment phong lighting example

- [Comprehensive.html](Comprehensive.html) and [Comprehensive.js](Comprehensive.js)
  - interactive lighting demo with independent controls

- [Common/](Common/)
  - helper files for shader setup and matrix/vector math

## How to run it

Because these are browser-based WebGL demos, serve the folder with a local HTTP server.

### Option 1: Python

```bash
cd /workspaces/WebGLLightingBasic
python3 -m http.server 8000
```

Then open one of these pages in a browser:

- http://localhost:8000/shadedSphere1.html
- http://localhost:8000/shadedSphere4.html
- http://localhost:8000/Comprehensive.html

## Main learning takeaway

This project teaches the basic rendering pipeline behind 3D lighting in real-time graphics:

1. Build geometry
2. Compute normals
3. Transform vertices into view space
4. Apply lighting in a shader
5. Display the final shaded image

The examples together show how ambient, diffuse, and specular lighting combine to produce realistic-looking 3D surfaces, and how interactive controls help explain the effect of each lighting component.
