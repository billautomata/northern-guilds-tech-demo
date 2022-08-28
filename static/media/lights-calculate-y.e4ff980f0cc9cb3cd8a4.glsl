#define samples 128.0

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uEmission;

void main() {
    vec3 sample = vec3(0.0);
    vec4 _tempSample = vec4(0.0);
    for(float i = 0.0; i < samples; i += (1.0 / samples)) {
        _tempSample = texture2D(uEmission, vec2(0.0, vTextureCoord.y) + vec2(i, 0.0));
        sample += _tempSample.rgb * _tempSample.a;
    }
    sample /= samples;
    gl_FragColor = vec4(vec3(length(sample)), 1.0);

}