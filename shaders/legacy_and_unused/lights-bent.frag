#define steps_limit 128.0

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uEntities;
uniform vec2 screenDimensions;
uniform vec2 textureDimensions;
uniform float watts;
uniform float hitsThreshold;
uniform float wattsMulti;
uniform float shadowDarkness;

// uniform vec2 lightPosition;

void main() {
    vec2 _vTextureCoord = vTextureCoord;

    vec2 lightPosition = vec2(0.5, 0.5);
    lightPosition /= (textureDimensions / screenDimensions);

    float d = distance(lightPosition, _vTextureCoord);

    vec2 testPosition = vec2(0.0);
    int hit = 0;
    for(float i = 0.0; i < steps_limit; i += 1.0) {
        testPosition = mix(lightPosition, _vTextureCoord, i / steps_limit);
        if(texture2D(uEntities, testPosition).a > 0.01) {
            hit += 1;
        }
    }

    float brightness = pow(d*wattsMulti, watts);
    vec4 brightColor = vec4(vec3(0.0), brightness);
    if(float(hit) > hitsThreshold) {        
        gl_FragColor = brightColor + vec4(vec3(0.0), pow(brightness*float(hit)*shadowDarkness,1.0));
    } else {
        gl_FragColor = brightColor;
        if(d < 0.005) {
            gl_FragColor = vec4(1.0);
        }
    }

}