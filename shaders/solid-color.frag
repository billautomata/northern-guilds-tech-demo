varying vec2 vTextureCoord; 
uniform sampler2D uSampler; 

uniform float r;
uniform float g;
uniform float b;
uniform float a;

void main () 
{  
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = texture2D(uSampler, vTextureCoord) + vec4(r,g,b,a);
//   gl_FragColor = vec4(r,g,b,a);
}  