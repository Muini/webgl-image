
precision highp float;

varying vec2 texCoords;

uniform sampler2D textureSampler;

uniform float scrollPosition;

float random(vec2 co){
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

float squarePosition(){
    if(scrollPosition<0.0){
        return -scrollPosition*scrollPosition; 
    }else{
        return scrollPosition*scrollPosition;
    }
}

void main() {

    vec2 uv = texCoords.xy;

    vec4 color = texture2D(textureSampler, uv);
    uv.y -= pow(length(1. - color), 2.0) * squarePosition() * 0.1;
    color = texture2D(textureSampler, uv);

    // Desaturate
    vec3 grayXfer = vec3(0.3, 0.59, 0.11);
	vec3 gray = vec3(dot(grayXfer, color.rgb));
    color = vec4(mix(color.rgb, gray, abs(squarePosition())), color.a);
    // color.g = texture2D(textureSampler, uv).g;
    // color.a = texture2D(textureSampler, uv).a;
    // Split RGB
    uv.y -= scrollPosition * 0.01;
    color.b = texture2D(textureSampler, uv).b;
    uv.y += scrollPosition * 0.01;
    color.g = texture2D(textureSampler, uv).g;

    // Brightness
    color.rgb += abs(squarePosition() / 4.0);

    gl_FragColor = color;
}