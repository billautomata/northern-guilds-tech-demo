#define steps 196.0

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uEntities;
uniform vec2 screenDimensions;
uniform vec2 textureDimensions;
// uniform vec2 lightPosition;

void main() {
    vec2 _vTextureCoord = vTextureCoord;

    vec2 lightPosition = vec2(0.5, 0.25);
    lightPosition /= (textureDimensions / screenDimensions);

    float d = distance(lightPosition, _vTextureCoord);

    vec2 testPosition = vec2(0.0);
    int hit = 0;
    for(float i = 0.0; i < steps; i += 1.0) {
        testPosition = mix(lightPosition, _vTextureCoord, i / steps);
        if(texture2D(uEntities, testPosition).r > 0.01) {
            hit = 1;
            break;
        }
    }

    if(hit == 1) {
        gl_FragColor = vec4(vec3(0.0), pow(d, 0.5));
    } else {
        gl_FragColor = vec4(vec3(0.0), d);
        if(d < 0.005) {
            gl_FragColor = vec4(1.0);
        }
    }
}