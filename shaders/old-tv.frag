// borrowed stuff from https://www.shadertoy.com/view/MtdXWl

#define PI 3.141592653589793

varying vec2 vTextureCoord; 
uniform sampler2D uSampler; 

uniform float time;

uniform vec2 screenDimensions;

const float maskStr			= 0.0125;		// 0.0 - 1.0
const float vignetteStr		= 0.10;			// 0.0 - 1.0
const float crtBend			= 3.8;
const float crtOverscan		= 0.1;			// 0.0 - 1.0			

float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
	float unit = 1.0 * (screenDimensions.x/freq);
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noise(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}

vec4 alphaBlend(vec4 top, vec4 bottom)
{
	vec4 result;
    result.a = top.a + bottom.a * (1.0 - top.a);
    result.rgb = (top.rgb * top.aaa + bottom.rgb * bottom.aaa * (vec3(1.0, 1.0, 1.0) - top.aaa)) / result.aaa;
    
    return result;
}

vec3 vignette(vec2 uv)
{
    float OuterVig = 1.0; // Position for the Outer vignette
	float InnerVig = 0.65; // Position for the inner Vignette Ring
	
	//vec2 uv = fragCoord.xy / iResolution.xy;
	
	vec2 center = vec2(0.5,0.5); // Center of Screen
	
	float dist  = distance(center,uv )*1.414213; // Distance  between center and the current Uv. Multiplyed by 1.414213 to fit in the range of 0.0 to 1.0 	
	float vig = clamp((OuterVig-dist) / (OuterVig-InnerVig),0.0,1.0); // Generate the Vignette with Clamp which go from outer Viggnet ring to inner vignette ring with smooth steps
    
    return vec3(vig, vig, vig);
}

vec2 crt(vec2 coord, float bend)
{
	// put in symmetrical coords
	coord = (coord - 0.5) * 2.0 / (crtOverscan + 1.0);

	coord *= 1.1;	

	// deform coords
	coord.x *= 1.0 + pow((abs(coord.y) / bend), 2.0);
	coord.y *= 1.0 + pow((abs(coord.x) / bend), 2.0);

	// transform back to 0.0 - 1.0 space
	coord  = (coord / 2.0) + 0.5;

	return coord;
}


float modulo (float a, float b) {
    return a - (b * floor(a/b));
}

void main () 
{
    vec2 shiftedCoords = vec2(0.0);
    vec2 coords = vTextureCoord * screenDimensions;
    vec2 crtCoords = crt(vTextureCoord, crtBend);
    float multi = 1.0;
    float size = 3.0;
    float limit = 1.0;
    float mod_x = mod(coords.x,size);
    float mod_y = mod(coords.y,size);
    // if(mod_x <= limit || mod_y <= limit) {
    if(mod_y <= limit) {
        multi = 0.75;
        shiftedCoords.x += (3.0/screenDimensions.x);
    } else {
    }
    float r = texture2D(uSampler, crtCoords).r;
    float g = texture2D(uSampler, crtCoords - shiftedCoords).g;
    float b = texture2D(uSampler, crtCoords).b;

    multi += 1.0 * pNoise(coords.yy + vec2(0.0,time*500.0), 5);

    if(crtCoords.x < 0.0 || crtCoords.x > 1.0 || crtCoords.y < 0.0 || crtCoords.y > 1.0) {
    	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(vec3(r,g,b) * multi * vignette(crtCoords), 1.0);
    }

}  
