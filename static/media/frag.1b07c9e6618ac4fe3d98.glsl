#version 300 es
precision highp float;


in vec2 vTextureCoord;

uniform sampler2D uSampler;

layout(location = 0) out vec4 out_0;

void main(void){
   out_0 = vec4(texture(uSampler, vTextureCoord));
//    out_0 = vec4(1.0);
}