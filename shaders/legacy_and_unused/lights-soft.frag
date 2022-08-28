#define steps 196.0

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uEntities;
uniform vec2 screenDimensions;
uniform vec2 textureDimensions;
uniform float watts;
// uniform vec2 lightPosition;

void main() {
    vec2 _vTextureCoord = vTextureCoord;

    vec2 lightPosition = vec2(0.5, 0.25);
    lightPosition /= (textureDimensions / screenDimensions);

    float d = distance(lightPosition, _vTextureCoord);

    vec2 testPosition = vec2(0.0);
    int hit = 0;
    for(float i = 0.0; i < steps; i += 1.0) {

        if(false && i < steps * 0.25) {
            float x = _vTextureCoord.x;
            float y = _vTextureCoord.y;
            float theta = pow(d,((i)/steps));
            float cs = cos(theta);
            float sn = sin(theta);

            float px = x * cs - y * sn;
            float py = x * sn + y * cs;
            testPosition = mix(lightPosition, vec2(px,py), i / steps);
            if(texture2D(uEntities, testPosition).r > 0.01) {
                hit = 1;
                break;
            }
        } else {
            testPosition = mix(lightPosition, _vTextureCoord, i / steps);
            if(texture2D(uEntities, testPosition).r > 0.01) {
                hit = 1;
                break;
            }
        }

    }

    // float watts = 1.0;
    float brightness = pow(d, watts);
    float gamma = pow(d,2.0);
    vec4 brightColor = vec4(vec3(0.0), brightness);
    // hit = 0;
    if(hit == 1) {
        // gl_FragColor = vec4(vec3(0.0), pow(d, 0.5) * pow(5.0,brightness));
        gl_FragColor = vec4(vec3(0.0), pow(brightness,0.8));
    } else {
        // gl_FragColor = vec4(vec3(0.0),gamma*5.0);
        gl_FragColor = brightColor;
        if(d < 0.005) {
            gl_FragColor = vec4(1.0);
        }
    }

    // gl_FragColor = vec4(vec3(0.0),gamma*5.0);
}