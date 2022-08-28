#define screenWidth 1024.0
#define PI 3.141592653589793

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;
uniform vec2 windTime;

uniform vec2 dimensions;
uniform vec2 offset;

uniform float pixelSize;
uniform float pixelSizeReducer;
uniform float colorReductionSteps;

uniform float sizeMultiplier;

uniform float thickness;
uniform vec2 windSpeed;

float rand(vec2 c) {
    return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p, float freq) {
    float unit = screenWidth / freq;
    unit *= sizeMultiplier;
    vec2 ij = floor(p / unit);
    vec2 xy = mod(p, unit) / unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
    xy = .5 * (1. - cos(PI * xy));
    float a = rand((ij + vec2(0., 0.)));
    float b = rand((ij + vec2(1., 0.)));
    float c = rand((ij + vec2(0., 1.)));
    float d = rand((ij + vec2(1., 1.)));
    float x1 = mix(a, b, xy.x);
    float x2 = mix(c, d, xy.x);
    return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res) {
    float persistance = .5;
    float n = 0.;
    float normK = 0.;
    float f = 4.;
    float amp = 1.;
    int iCount = 0;
    for(int i = 0; i < 50; i++) {
        n += amp * noise(p, f);
        f *= 2.;
        normK += amp;
        amp *= persistance;
        if(iCount == res)
            break;
        iCount++;
    }
    float nf = n / normK;
    return nf * nf * nf * nf;
}

void main() {
    vec2 coords = vTextureCoord;
    coords *= vec2(dimensions.x / (pixelSize * pixelSizeReducer));
    coords.x = floor(coords.x);
    coords.y = floor(coords.y);
    coords /= vec2(dimensions.x / (pixelSize * pixelSizeReducer));

    vec2 _offset = -offset;
    vec2 _time = vec2(-1.0 * windTime);

    float v = 1.0 * pNoise(_offset + _time + (coords * dimensions * vec2(1.0 / pixelSize)), 4);
    float v_ = 1.0 * pNoise(vec2(5120.0, 5120.0) + _offset + (_time * 1.5) + (coords * dimensions * vec2(1.0 / pixelSize)), 6);
    float _v = 1.0 * pNoise(vec2(512.0, 512.0) + _offset + (_time * 2.0) + (coords * dimensions * vec2(1.0 / pixelSize)), 8);

  // layering
    v += v_;
    v -= _v;

    v *= colorReductionSteps * 2.0;
    v = floor(v);
    v /= colorReductionSteps * 2.0;

    // vec4 shadowColor = texture2D(uShadows, vTextureCoord).rgba;
    // v *= pow(v, shadowColor.r);
    // v = clamp(v, 0.0, 1.0);
    v *= thickness;

    // gl_FragColor = vec4(shadowColor,1.0);
    // gl_FragColor = vec4(color, 1.0);
    gl_FragColor = vec4(v);
}