varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uEntities;
uniform vec2 screenDimensions;
uniform vec2 textureDimensions;
uniform float watts;
uniform float wattsMulti;
uniform vec2 lampPosition;
uniform vec3 lampColor;

uniform sampler2D uLampPosition;

void main() {

    vec3 lightColor = lampColor.xyz;

    // lightColor = vec3(1.0,1.0,1.0);

    vec2 _vTextureCoord = vTextureCoord;
    // vec2 lightPosition = lampPosition;
    // lightPosition /= 4.0;

    vec4 lampSample = texture2D(uLampPosition, vec2(0.0,0.0));
    vec2 lightPosition = lampSample.rg;

    if(lightPosition.x == 0.0 && lightPosition.y == 0.0) {
        gl_FragColor = vec4(1.0 / watts);
    } else {
        float d = distance(lightPosition, _vTextureCoord);
        float brightness = pow(d * wattsMulti, watts);
        // vec4 brightColor = vec4(texture2D(uSampler, vTextureCoord).rgb * lightColor, brightness);
        // gl_FragColor = brightColor;
        gl_FragColor = vec4(vec3(lampColor), brightness);
        // gl_FragColor = vec4(vec3(lampColor), 0.0);
        // gl_FragColor = vec4(lightColor, 1.0);
        // gl_FragColor = vec4(1.0,0.0,0.0,0.0);
    }
}