const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL not supported");
    throw new Error("WebGL not supported");
}

const program = initShaders(gl, "vertex-shader", "fragment-shader");
if (!program) {
    throw new Error("Shader initialization failed");
}

gl.useProgram(program);

//--------------------------------------------------
// Cube Data
//--------------------------------------------------

const vertices = new Float32Array([
   -1, -1,  1,
    1, -1,  1,
    1,  1,  1,
   -1,  1,  1,

   -1, -1, -1,
    1, -1, -1,
    1,  1, -1,
   -1,  1, -1
]);

const normals = new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1
]);

const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3,

    4, 5, 6,
    4, 6, 7,

    0, 3, 7,
    0, 7, 4,

    1, 5, 6,
    1, 6, 2,

    3, 2, 6,
    3, 6, 7,

    0, 1, 5,
    0, 5, 4
]);

//--------------------------------------------------
// Buffers
//--------------------------------------------------

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const posLoc = gl.getAttribLocation(program, "aPosition");
gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posLoc);

const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

const normalLoc = gl.getAttribLocation(program, "aNormal");
gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(normalLoc);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

//--------------------------------------------------
// Matrices
//--------------------------------------------------

const model = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]);

const view = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, -6, 1
]);

const projection = new Float32Array([
    1.3, 0, 0, 0,
    0, 1.7, 0, 0,
    0, 0, -1, -1,
    0, 0, -0.2, 0
]);

gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model);
gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), false, view);
gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), false, projection);

//--------------------------------------------------
// Light
//--------------------------------------------------

gl.uniform3f(gl.getUniformLocation(program, "uLightPos"), 4, 4, 4);
gl.uniform3f(gl.getUniformLocation(program, "uSpecularLightPos"), 0, 0, 4);
gl.uniform3f(gl.getUniformLocation(program, "uViewPos"), 0, 0, 6);

//--------------------------------------------------
// Controls
//--------------------------------------------------

const ambientBox = document.getElementById("ambient");
const diffuseBox = document.getElementById("diffuse");
const specularBox = document.getElementById("specular");
const showLightBox = document.getElementById("showLight");
const showSpecularLightBox = document.getElementById("showSpecularLight");
const ambientColorInput = document.getElementById("ambientColor");
const diffuseColorInput = document.getElementById("diffuseColor");
const specularColorInput = document.getElementById("specularColor");
const specularLightX = document.getElementById("specularLightX");
const specularLightY = document.getElementById("specularLightY");
const specularLightZ = document.getElementById("specularLightZ");
const desc = document.getElementById("description");

function hexToRgb(hex) {
    const value = hex.replace("#", "");
    const num = parseInt(value, 16);
    return [
        ((num >> 16) & 255) / 255,
        ((num >> 8) & 255) / 255,
        (num & 255) / 255
    ];
}

function updateText() {
    let text = "<h3>Current Lighting</h3>";

    if (ambientBox.checked) {
        text += "<b>Ambient:</b> Entire object receives a base level of light.<br><br>";
    }

    if (diffuseBox.checked) {
        text += "<b>Diffuse:</b> Surfaces facing the light become brighter.<br><br>";
        if (showLightBox.checked) {
            text += "<b>Diffuse Light Marker:</b> Visible point light source shown as a cube.<br><br>";
        } else {
            text += "<b>Diffuse Light Marker:</b> Hidden.<br><br>";
        }
    }

    if (specularBox.checked) {
        text += "<b>Specular:</b> Creates shiny highlights that move as the object rotates.<br><br>";
        if (showSpecularLightBox.checked) {
            text += "<b>Specular Light Marker:</b> Visible point light source shown as a cube.<br><br>";
        } else {
            text += "<b>Specular Light Marker:</b> Hidden.<br><br>";
        }
    }

    if (!ambientBox.checked && !diffuseBox.checked && !specularBox.checked) {
        text += "All lighting is disabled.";
    }

    desc.innerHTML = text;
}

ambientBox.onchange = diffuseBox.onchange = specularBox.onchange = showLightBox.onchange = showSpecularLightBox.onchange = updateText;
ambientColorInput.oninput = diffuseColorInput.oninput = specularColorInput.oninput = updateText;
specularLightX.oninput = specularLightY.oninput = specularLightZ.oninput = updateText;
updateText();

function multiplyMat4(a, b) {
    const out = new Float32Array(16);

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            out[row * 4 + col] =
                a[row * 4 + 0] * b[0 * 4 + col] +
                a[row * 4 + 1] * b[1 * 4 + col] +
                a[row * 4 + 2] * b[2 * 4 + col] +
                a[row * 4 + 3] * b[3 * 4 + col];
        }
    }

    return out;
}

function translationMatrix(tx, ty, tz) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ]);
}

function scaleMatrix(sx, sy, sz) {
    return new Float32Array([
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
    ]);
}

//--------------------------------------------------
// Render Loop
//--------------------------------------------------

let angle = 0;

function render() {
    angle += 0.01;

    model[0] = Math.cos(angle);
    model[2] = Math.sin(angle);
    model[8] = -Math.sin(angle);
    model[10] = Math.cos(angle);

    const ambientColor = hexToRgb(ambientColorInput.value);
    const diffuseColor = hexToRgb(diffuseColorInput.value);
    const specularColor = hexToRgb(specularColorInput.value);
    const specularLightPos = [
        parseFloat(specularLightX.value),
        parseFloat(specularLightY.value),
        parseFloat(specularLightZ.value)
    ];

    gl.uniform3fv(gl.getUniformLocation(program, "uAmbientColor"), ambientColor);
    gl.uniform3fv(gl.getUniformLocation(program, "uDiffuseColor"), diffuseColor);
    gl.uniform3fv(gl.getUniformLocation(program, "uSpecularColor"), specularColor);
    gl.uniform3fv(gl.getUniformLocation(program, "uSpecularLightPos"), specularLightPos);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model);
    gl.uniform1i(gl.getUniformLocation(program, "uAmbientOn"), ambientBox.checked);
    gl.uniform1i(gl.getUniformLocation(program, "uDiffuseOn"), diffuseBox.checked);
    gl.uniform1i(gl.getUniformLocation(program, "uSpecularOn"), specularBox.checked);
    gl.uniform1i(gl.getUniformLocation(program, "uIsLightSource"), false);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    if (showLightBox.checked) {
        const lightPos = [4, 4, 4];
        const lightModel = multiplyMat4(
            translationMatrix(lightPos[0], lightPos[1], lightPos[2]),
            scaleMatrix(0.18, 0.18, 0.18)
        );

        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, lightModel);
        gl.uniform1i(gl.getUniformLocation(program, "uIsLightSource"), true);
        gl.uniform3fv(gl.getUniformLocation(program, "uLightSourceColor"), diffuseColor);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    if (showSpecularLightBox.checked) {
        const specularLightModel = multiplyMat4(
            translationMatrix(specularLightPos[0], specularLightPos[1], specularLightPos[2]),
            scaleMatrix(0.18, 0.18, 0.18)
        );

        gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, specularLightModel);
        gl.uniform1i(gl.getUniformLocation(program, "uIsLightSource"), true);
        gl.uniform3fv(gl.getUniformLocation(program, "uLightSourceColor"), specularColor);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    requestAnimationFrame(render);
}

render();