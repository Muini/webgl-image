import InView from './vendors/in-view';

//Fast Image Processing by Corentin Flach

export default class FIP extends InView {
    constructor(opt){

        super(opt);

        // console.log('FIP creation', this)

        this.url = opt.url;

        this.image = new Image();

        this.image.crossOrigin = "Anonymous";

        this.onLoaded = this.onLoaded.bind(this);
        this.image.onload = this.onLoaded;

        this.image.src = this.url;

        // this.update = this.update.bind(this);
        // this.scroll.loop.add(this.update);
    }

    onLoaded(){
        
        this.canvas = document.createElement('canvas');
        this.elem.el.appendChild(this.canvas);

        this.canvas.width = this.image.naturalWidth;
        this.canvas.height = this.image.naturalHeight;

        this.gl = this.canvas.getContext('webgl');

        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.gl.clearColor(1.0, 0.8, 0.1, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        const vertShaderSource = `
            attribute vec2 position;

            varying vec2 texCoords;

            void main() {
                texCoords = (position + 1.0) / 2.0;
                texCoords.y = 1.0 - texCoords.y;
                gl_Position = vec4(position, 0, 1.0);
            }
        `;

        const fragShaderSource = require('../shaders/fip/simple.frag');

        const vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        this.gl.shaderSource(vertShader, vertShaderSource);
        this.gl.shaderSource(fragShader, fragShaderSource);

        this.gl.compileShader(vertShader);
        this.gl.compileShader(fragShader);

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertShader);
        this.gl.attachShader(program, fragShader);

        this.gl.linkProgram(program);

        this.gl.useProgram(program);

        const vertices = new Float32Array([
            -1, -1,
            -1, 1,
            1, 1,

            -1, -1,
            1, 1,
            1, -1,
        ]);

        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

        const positionLocation = this.gl.getAttribLocation(program, 'position');

        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(positionLocation);

        const texture = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

        // Uniforms
        this.floatUniformLoc = this.gl.getUniformLocation(program, "scrollPosition");
        // this.gl.uniform1f(this.floatUniformLoc, this.scroll.posY);

        // this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        // this.updateValues();
        // this.check();
        // this.updateClasses();

        let event = new CustomEvent('smoothscroll-resize');;
        window.dispatchEvent(event);
    }

    setUniform(name, value){
        // this.gl
    }

    check() {
        if(!this.gl) return;

        super.check();

        // if (!this.elem.inView) return;

        const scrollPosRelativeToRatio = (this.scroll.posY + (this.scroll.height * this.ratio));
        const elemPosRelativeToRatio = (this.elem.top + (this.elem.height * this.ratio));
        const positionRelativeToScroll = (scrollPosRelativeToRatio - elemPosRelativeToRatio) / (this.scroll.height - this.elem.height);

        this.gl.uniform1f(this.floatUniformLoc, positionRelativeToScroll);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }


}