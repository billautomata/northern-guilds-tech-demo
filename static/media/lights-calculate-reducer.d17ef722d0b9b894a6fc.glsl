#define steps 128

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

uniform sampler2D uLightsX;
uniform sampler2D uLightsY;
uniform vec2 dimensions;

void main() {
    vec2 maxPositions = vec2(0.0);
    vec2 maxValues = vec2(0.0);
    float colorX;
    float colorY;
    for(int i = 0; i < steps; i++) {
        colorX = length(texture2D(uLightsX, vec2(float(i) / float(steps), 0.0)).rgb);
        colorY = length(texture2D(uLightsY, vec2(0.0, float(i) / float(steps))).rgb);
        if(colorX > maxValues.x) {
            maxValues.x = colorX;
            maxPositions.x = float(i) / float(steps);
        }
        if(colorY > maxValues.y) {
            maxValues.y = colorY;
            maxPositions.y = float(i) / float(steps);
        }
    }
    gl_FragColor = vec4(maxPositions.x, maxPositions.y, 0.0, 1.0);
}