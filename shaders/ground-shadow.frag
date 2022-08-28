
#define steps_limit 128.0
precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uEntities;
uniform vec2 screenDimensions;
uniform vec2 textureDimensions;
uniform float watts;
uniform float shadowDistance;
uniform float wattsMulti;
uniform float shadowDarkness;
uniform float shadowFalloff;

uniform vec2 lampPosition;

uniform sampler2D uLampPosition;

void main() {
    vec2 _vTextureCoord = vTextureCoord;

    vec4 lampSample = texture2D(uLampPosition, vec2(0.0,0.0));
    vec2 lightPosition = lampSample.rg;
    // vec2 lightPosition = lampPosition / 4.0;

    if(lightPosition.x == 0.0 && lightPosition.y == 0.0) {
        gl_FragColor = vec4(0.0);       
        return;  
    }

    float d = distance(lightPosition, _vTextureCoord);
    float firstHitPosition = 0.0;

    vec2 testPosition = vec2(0.0);
    int hit = 0;
    for(float i = 0.0; i < steps_limit; i += 1.0) {
        testPosition = mix(lightPosition, _vTextureCoord, i / steps_limit);
        if(texture2D(uEntities, testPosition).a > 0.01) {
            if(hit == 0) {
                firstHitPosition = (i / steps_limit);
            }
            hit += 1;
        }
    }

    float brightness = pow(d * wattsMulti, watts);
    float inverseBrightness = pow(watts, 2.0);

    // TODO, the shadows should fade off when it gets darker
    // hit = int(min(float(hit), (shadowDistance)*1.1));

    vec4 brightColor = vec4(vec3(0.0), brightness);
    if(float(hit) > (steps_limit - shadowDistance)) {
        // gl_FragColor = brightColor + vec4(vec3(0.0), pow(inverseBrightness * float(hit) * shadowDarkness, shadowFalloff));
        gl_FragColor = vec4(vec3(0.0), pow(inverseBrightness * float(hit) * shadowDarkness, shadowFalloff));
    } else {
        gl_FragColor = vec4(0.0);
    }

}