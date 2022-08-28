// todo, attach the fog output and do a shadow check on that texture

#define screenWidth 1024.0
#define PI 3.141592653589793

varying vec2 vTextureCoord; 
uniform sampler2D uSampler; 

float sizeMultiplier = 1.0;

uniform float time;
uniform float bend;

float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
	float unit = screenWidth/freq;
    unit *= sizeMultiplier;
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

void main () 
{  
    float reducer = 1.0;
    float colorReduction = 6.0;
    float expand = 8.0;
    vec2 coords = vTextureCoord;
    float size = 200.0;
    coords *= 1024.0 / reducer;
    coords = floor(coords);
    coords /= 1024.0 / reducer;
    float v = pNoise(vec2((time + (coords.x+(coords.y*bend))*size),0.0),5) -
        (0.1 * pNoise(vec2(((4.0*time) + (coords.x+(coords.y*bend))*size),10240.0),6));
    
    v *= expand;
    v *= colorReduction;
    v = floor(v);
    v /= colorReduction;
    v /= expand;
    gl_FragColor = vec4(vec3(v,v,v),0.25-v);
}  