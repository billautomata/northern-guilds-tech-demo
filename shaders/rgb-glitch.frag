varying vec2 vTextureCoord; 
uniform sampler2D uSampler; 

uniform float offset;

void main () 
{
    vec4 sample = texture2D(uSampler, vTextureCoord);
    vec4 sample0 = texture2D(uSampler, vTextureCoord + vec2(offset, 0.0));
    vec4 sample1 = texture2D(uSampler, vTextureCoord + vec2(-offset, 0.0));
    vec4 sample2 = texture2D(uSampler, vTextureCoord + vec2(0.0, offset));   
    gl_FragColor = vec4(sample0.r, sample1.g, sample2.b, sample.a);
}  