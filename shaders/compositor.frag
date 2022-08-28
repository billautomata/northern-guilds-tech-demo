varying vec2 vTextureCoord;
uniform sampler2D uEntities;
uniform sampler2D uBackground;
uniform sampler2D uShadow;
uniform sampler2D uFog;
uniform sampler2D uEmission;
uniform sampler2D uLights;
uniform sampler2D uDarkness;
uniform sampler2D uEmissionMask;

uniform float ambientLightStrength;
uniform float emissionStrength;
uniform float glowStrength;

uniform vec3 _lampColor;

uniform sampler2D uSampler; // there is nothing here

void main() {
    vec4 color = vec4(0.0);

    // sample everything
    vec4 backgroundSample = texture2D(uBackground, vTextureCoord);
    vec4 shadowSample = texture2D(uShadow, vTextureCoord);
    vec4 entitiesSample = texture2D(uEntities, vTextureCoord);
    vec4 fogSample = texture2D(uFog, vTextureCoord);
    vec4 emissionSample = texture2D(uEmission, vTextureCoord);
    vec4 lightsSample = texture2D(uLights, vTextureCoord);
    vec4 darknessSample = texture2D(uDarkness, vTextureCoord);
    vec4 emissionMaskSample = texture2D(uEmissionMask, vTextureCoord);

    // add the background value
    color += backgroundSample;

    // make darker from the shadows
    color.rgb *= 1.0 - shadowSample.a;

    // alpha blend in the entities
    color.rgb = mix(color.rgb, entitiesSample.rgb, entitiesSample.a);

    // if the shadow is strong, cut the fog value
    if(shadowSample.a > 0.0) {
        fogSample.a = pow(fogSample.a, 1.5);
    }

    // add the fog
    color.rgb += clamp(vec3(fogSample.a), 0.0, 1.0);

    // cut the value due to ambient light
    color.rgb *= (1.0 - darknessSample.a) * ambientLightStrength;

    float emissionMaskActive = length(emissionMaskSample - entitiesSample);

    // add the emissive layer    
    color.rgb += (emissionStrength * emissionSample.rgb) * emissionSample.a * emissionMaskActive;

    // add the lights layer
    color.rgb += (glowStrength * lightsSample.rgb) * emissionMaskActive * lightsSample.a;

    gl_FragColor = color;

}