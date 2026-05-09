import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh, Vec2 } from 'ogl';

const fragmentShader = `
precision mediump float;
uniform float iTime;
uniform vec2  iResolution;
uniform vec2  uMouse;
uniform vec2  uOffset;
uniform float uRotation;
uniform float focalLength;
uniform float speed1;
uniform float speed2;
uniform float dir2;
uniform float bend1;
uniform float bend2;
uniform float bendAdj1;
uniform float bendAdj2;
uniform float uOpacity;

const float lt   = 0.3;
const float pi   = 3.14159;
const float pi2  = 6.28318;
const float pi_2 = 1.5708;
#define MAX_STEPS 16

void mainImage(out vec4 C, in vec2 U) {
  float t = iTime * pi;
  float s = 1.0;
  float d = 0.0;
  vec2  R = iResolution;

  vec3 o = vec3(0.0, 0.0, -7.0);
  vec3 u = normalize(vec3((U - 0.5 * R) / R.y, focalLength));
  
  // Static View - Mouse influence removed for stability
  // u.xy += (uMouse - 0.5) * 0.1;

  vec2 k = vec2(0.0);
  vec3 p;

  float t1 = t * 0.7;
  float t2 = t * 0.9;
  float tSpeed1 = t * speed1;
  float tSpeed2 = t * speed2 * dir2;
  float wob1Base = bend1 + bendAdj1;
  float wob2Base = bend2 + bendAdj2;

  for (int i = 0; i < MAX_STEPS; ++i) {
    p = o + u * d;
    p.x -= 15.0;

    float px = p.x;
    float wob1 = wob1Base + sin(t1 + px * 0.8) * 0.1;
    float wob2 = wob2Base + cos(t2 + px * 1.1) * 0.1;

    float px2 = px + pi_2;
    vec2 sinOffset = sin(vec2(px, px2) + tSpeed1) * wob1;
    vec2 cosOffset = cos(vec2(px, px2) + tSpeed2) * wob2;

    vec2 yz = p.yz;
    float pxLt = px + lt;
    
    // Smooth distance fields for the two ribbons
    k.x = max(pxLt, length(yz - sinOffset) - lt);
    k.y = max(pxLt, length(yz - cosOffset) - lt);

    float current = min(k.x, k.y);
    s = min(s, current);
    if (s < 0.001 || d > 300.0) break;
    d += s * 0.7;
  }

  // Same-to-Same color mapping from reference
  float sqrtD = sqrt(d);
  vec3 c = max(cos(d * pi2) - s * sqrtD - vec3(k, 0.0), 0.0);
  
  // IRIDESCENT COLOR SHIFT (Reference Logic: c = c * 0.4 + c.brg * 0.6 + c * c)
  c = c * 0.4 + c.brg * 0.6 + c * c;
  
  // Final color boost to match neon vibrancy
  c.gb += 0.05; 
  C = vec4(c, uOpacity);
}

void main() {
  vec2 coord = gl_FragCoord.xy + uOffset;
  coord -= 0.5 * iResolution;
  float cr = cos(uRotation), sr = sin(uRotation);
  coord = mat2(cr, -sr, sr, cr) * coord;
  coord += 0.5 * iResolution;

  vec4 color;
  mainImage(color, coord);
  gl_FragColor = color;
}
`;

const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const HeroBackground = () => {
    const containerRef = useRef();
    const mouseRef = useRef(new Vec2(0.5, 0.5));

    useEffect(() => {
        if (!containerRef.current) return;

        const renderer = new Renderer({ alpha: true, antialias: false, dpr: 1 });
        const gl = renderer.gl;
        
        gl.canvas.style.position = 'absolute';
        gl.canvas.style.top = '0';
        gl.canvas.style.left = '0';
        gl.canvas.style.width = '100%';
        gl.canvas.style.height = '100%';
        
        containerRef.current.appendChild(gl.canvas);

        const camera = new Camera(gl);
        camera.position.z = 5;

        const geometry = new Geometry(gl, {
            position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
        });

        const program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
                uMouse: { value: mouseRef.current },
                uOffset: { value: new Vec2(40, 0) },
                uRotation: { value: -0.785398 },
                focalLength: { value: 0.8 },
                speed1: { value: 0.02 },
                speed2: { value: 0.02 },
                dir2: { value: 1.0 },
                bend1: { value: 1.0 },
                bend2: { value: 0.5 },
                bendAdj1: { value: 0.0 },
                bendAdj2: { value: 0.0 },
                uOpacity: { value: 0 },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });

        let animationFrameId;
        let startTime = performance.now();

        const resize = () => {
            if (!gl.canvas) return;
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            program.uniforms.iResolution.value.set(width, height);
        };

        const handleMouseMove = (e) => {
            mouseRef.current.set(e.clientX / window.innerWidth, 1.0 - (e.clientY / window.innerHeight));
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();

        const update = (t) => {
            animationFrameId = requestAnimationFrame(update);

            const elapsed = (t - startTime) / 1000;
            program.uniforms.iTime.value = elapsed;
            program.uniforms.uMouse.value = mouseRef.current;
            
            // Fade in to 0.7 opacity (Reference look)
            if (program.uniforms.uOpacity.value < 0.7) {
                program.uniforms.uOpacity.value = Math.min(0.7, elapsed / 2);
            }

            renderer.render({ scene: mesh });
        };

        animationFrameId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (containerRef.current && gl.canvas.parentNode) {
                containerRef.current.removeChild(gl.canvas);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden z-0 bg-[#030014]">
            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-10 bg-white/5">
            </div>

            {/* Deep Vignette with subtle central darkening for readability */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(3,0,20,0.75)_0%,transparent_60%,#030014_95%)] z-20 pointer-events-none"></div>
            
            {/* Luxury Linear Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030014]/60 z-30 pointer-events-none"></div>
        </div>
    );
};

export default HeroBackground;
