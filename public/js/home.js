import * as THREE from 'https://threejs.org/build/three.module.js';
import { ReflectorRTT } from 'https://threejs.org/examples/jsm/objects/ReflectorRTT.js';

var scene = new THREE.Scene();
var camera, renderer, canvas;
var sunGeo, sunMat, sun;
var planetGeo, planetTex, planetMat, planet;
var moonGeo, moonTex, moonMat, moon;
var earthGeo, earthTex, earthMat, earth;
var atmo1Geo, atmo1Tex, atmo1Mat, atmo1;
var asteroid = [],
    astHolder;
var clock = new THREE.Clock();
var phase = 0;
var delta;
var windowHalfY = window.innerHeight / 2;
var lastScroll = 0;
var sections, secHolder;
var reflMap, uniforms, matEdge;

var topSec, midSec, bottomSec;

const fragmentShader = `
    #include <common>
    #define TWO_PI 6.28318530718
    uniform vec2 iResolution;
    uniform float iTime;

    //  Function from Iñigo Quiles
    //  https://www.shadertoy.com/view/MsS3Wc
    vec3 hsb2rgb( in vec3 c ){
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                                6.0)-3.0)-1.0,
                        0.0,
                        1.0 );
        rgb = rgb*rgb*(3.0-2.0*rgb);
        return c.z * mix( vec3(1.0), rgb, c.y);
    }

    void main(){
        vec2 st = gl_FragCoord.xy/iResolution;
        vec3 color = vec3(0.0);

        // Use polar coordinates instead of cartesian
        vec2 toCenter = vec2(0.5)-st;
        float angle = atan(toCenter.y,toCenter.x);
        float radius = length(toCenter)*2.0;

        // Map the angle (-PI to PI) to the Hue (from 0 to 1)
        // and the Saturation to the radius
        color = hsb2rgb(vec3((angle/TWO_PI)+0.5+iTime/10.,radius,1.0));

        gl_FragColor = vec4(color,abs(sin(iTime))+0.1);
    }
    `;
const canvasDemo = document.querySelector('#canvDemo')
const canvasDemo2 = document.querySelector('#canvDemo2')
//Initial Values
// var cameraStart = { x: 0, y: 0, z: 0 }; //og - end
// var cameraStart = { x: 17920, y: -2333, z: 21600 }; //mid
var cameraStart = { x: 17920, y: -2333, z: 47600 }; //start

// var asterPosition = { x: -10, y: 0, z: -50 }; //og - end
// var asterPosition = { x: -10, y: 0, z: -30 }; //mid
var asterPosition = { x: -25, y: 0, z: -80 }; //start

// var sunPosition = { x: -33700, y: 0, z: 25000 }; //og - end
// var sunPosition = { x: 33700, y: 0, z: 25000 }; //mid
var sunPosition = { x: 33700, y: 0, z: 45000 }; //start

// var planetPosition = { x: 12000, y: -4000, z: 30000 }; //og - end
// var planetPosition = { x: 28000, y: -4000, z: 30000 }; //mid
var planetPosition = { x: 12000, y: -4000, z: 32000 }; //start

// var moonPosition = { x: 10000, y: -3000, z: 15000 }; //og - end
// var moonPosition = { x: 11000, y: -1700, z: 15000 }; //mid
var moonPosition = { x: 19000, y: -1700, z: 15000 }; //start

// var earthPosition = { x: 900, y: 0, z: -6000 }; //og - end
// var earthPosition = { x: 9000, y: 0, z: -6000 }; //mid
// var earthPosition = { x: 29000, y: 0, z: -20000 }; //start
var earthPosition = { x: -25, y: -50, z: -3250 }; //start

init();

async function init() {
    
    uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2() }
    };
    matEdge = new THREE.ShaderMaterial({
        fragmentShader,
        uniforms,
        side: THREE.DoubleSide,
        // opacity: 0.8,
        // transparency: true
    });

    await loadTextures()
        .then(createMaterials)
        .catch(err => console.log(err));
    // await loadModel();


    
    canvas = document.getElementById('canvas');
    topSec = document.getElementById('topSec');
    midSec = document.getElementById('midSec');
    bottomSec = document.getElementById('lastSec');

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.divicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Camera
    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1000,
        300000
    );

    camera.position.set(cameraStart.x, cameraStart.y, cameraStart.z);

    //Ambient Lighting
    var amb = new THREE.AmbientLight(0xf2e1ed, 0.1);
    scene.add(amb);

    //Create sun
    genSun();

    //Create Gradient
    generateGradient();

    //Create Planets
    createPlanets();

    //Asteroid
    astHolder = new THREE.Mesh();
    asteroid.forEach(i => {
        astHolder.add(i);
    });
    astHolder.position.set(asterPosition.x, asterPosition.y, asterPosition.z);
    scene.add(astHolder);
    // console.log(scene);

    renderer.setClearColor(0x050505, 0);
    // renderer.setClearColor(0x8a8988, 1);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    removeLoad();
    window.addEventListener('scroll', scrolling);
    scrolling();
}


function render() {
    delta = clock.getDelta();
    var time = clock.elapsedTime;
    switch (phase) {
        case 0:
            break;
        case 1:
            uniforms.iResolution.value.set(canvas.width, canvas.height);
            uniforms.iTime.value = time;
            astHolder.rotation.y += ((2 * Math.PI) / 180) * delta;
            earth.rotation.y += ((1 * Math.PI) / 180) * delta;
            atmo1.rotation.y += ((1 * Math.PI) / 180) * delta;

            moon.rotation.y += ((3 * Math.PI) / 180) * delta;
            planet.rotation.y += ((3 * Math.PI) / 180) * delta;
            break;
        case 2:
            // console.log('Phase 2');
            break;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function scrolling(e) {
    //Get percent scrolled
    var h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    var scrolled =
        ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100; //0 to 100
    var scrolledInv = 100 - scrolled; //100 to 0

    // Detect Scroll Up or Down
    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
    if (st > lastScroll) {
        planet.rotation.y += (1 * Math.PI) / 180;
        // console.log(planet.rotation.y);
        moon.rotation.y += (1 * Math.PI) / 180;
        earth.rotation.y += (1 * Math.PI) / 180;
    } else {
        planet.rotation.y -= (1 * Math.PI) / 180;
        moon.rotation.y -= (1 * Math.PI) / 180;
        earth.rotation.y -= (1 * Math.PI) / 180;
    }
    lastScroll = st <= 0 ? 0 : st; // For Mobile or negative scrolling

    var x = scrolled;
    // Scroll Camera

    //Move Planet
    planet.position.x = 770 * x + 12000;
    
    var test = -20 * scrolled+150;
    var test2 = -20 * scrolled+1150;
    canvasDemo.style.transform = `translate(0,${test}px)`
    canvasDemo2.style.transform = `translate(0,${test2}px)`

    console.log(x);

    
    //Fade Sections
    if (x > 1){
        topSec.style.opacity = 0;
    }else{
        topSec.style.opacity = 1;
    }

    if (x > 33 && x < 52){
        midSec.style.opacity = 1;
    }else{
        midSec.style.opacity = 0;
    }

    if (x > 95) {
        bottomSec.style.opacity = 1;
    } else {
        bottomSec.style.opacity = 0;
    }

    //Move Moon
    moon.position.x = (7 / 5) * Math.pow(x, 2) - 230 * x + 19000;

    //Move earth
    earth.position.x = (119 / 50) * Math.pow(x, 2) - 519 * x + 28100;

    //Move sun
    sun.position.x = (-6740 / 7) * x + 45700;

    camera.position.x = scrolledInv * 25.6 * 7;
    camera.position.y = scrolledInv * -3.33333 * 7;
    camera.position.z = (22 / 25) * Math.pow(x, 2) - (564 / 1) * x + 47600 / 1;

    secHolder.position.x = scrolledInv * 25.6 * 7;
    secHolder.position.y = 487 * scrolled - 14800;
    secHolder.position.z =
        (22 / 25) * Math.pow(x, 2) - (564 / 1) * x + 47600 / 1 - 12025;
    // console.log(secHolder.position.y);

    // cube2.position.x = scrolledInv * 25.6 * 7;
    // cube2.position.y = 487* x -10000;
    // cube2.position.z = ((22 / 25) * Math.pow(x, 2) - (564 / 1) * x + 47600 / 1 )-11025;
}

function generateGradient() {
    
    // matEdge.lights = true;
    // const matEdge = new THREE.MeshStandardMaterial({
    //     color: 0x906094, //purple
    //     // color: 0x171717, //black
    //     roughness: 0.2
    // });
    const matInside = new THREE.MeshStandardMaterial({
        color: 0x000000, //grey
        // color: 0x906094, //purple
        metalness: 0.9,
        roughness: 0.6,
        opacity: 0.95,
        transparent: true,
        map: reflMap
    });
    const matMiddle = new THREE.MeshStandardMaterial({
        color: 0x999999, //grey
        // color: 0x906094, //purple
        metalness: 0.9,
        roughness: 0.1,
        opacity: 0.5,
        transparent: true
        // roughnessMap: reflMap
    });

    var emptyGeo = new THREE.BoxGeometry(10, 10, 10);
    secHolder = new THREE.Mesh(emptyGeo, matInside);
    secHolder.position.set(cameraStart.x, cameraStart.y, cameraStart.z - 150);
    scene.add(secHolder);

    const secGeo = new THREE.Geometry();
    secGeo.vertices.push(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-11, 2, 0),
        new THREE.Vector3(-18, -1, 0),
        new THREE.Vector3(-18, -16, 0),
        new THREE.Vector3(-11, -18, 0),
        new THREE.Vector3(-1, -16, 0),
        new THREE.Vector3(7, -18, 0),
        new THREE.Vector3(17, -16, 0),
        new THREE.Vector3(17, -1, 0),
        new THREE.Vector3(8, 2, 0)
    );

    secGeo.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(2, 3, 4),
        new THREE.Face3(4, 5, 2),
        new THREE.Face3(5, 0, 2),
        new THREE.Face3(6, 0, 5),
        new THREE.Face3(6, 9, 0),
        new THREE.Face3(6, 7, 9),
        new THREE.Face3(8, 9, 7)
    );

    secGeo.scale(470, 420, 500);
    secGeo.computeFaceNormals();
    secGeo.center();

    var insideSecGeo = secGeo.clone();
    insideSecGeo.scale(1, 0.98, 0.98);
    // insideSecGeo.scale(1, 1, 1);
    insideSecGeo.computeFaceNormals();

    function makeInstance(geometry, material, x, y, z, parent) {
        var section = new THREE.Mesh(geometry, material);
        parent.add(section);
        section.position.set(x, y, z);
        // console.log('created');
        return section;
    }

    sections = [
        makeInstance(secGeo, matEdge, 0, 4000, 0, secHolder),
        makeInstance(secGeo, matMiddle, 0, 4000, 2, secHolder),
        makeInstance(insideSecGeo, matInside, 0, 4000, 5, secHolder),
        makeInstance(secGeo, matEdge, 0, -19150, 0, secHolder),
        makeInstance(secGeo, matMiddle, 0, -19150, 2, secHolder),
        makeInstance(insideSecGeo, matInside, 0, -19150, 5, secHolder)
    ];
    // console.log(sections);

    // var geo2 = geometry.clone();
    // geo2.scale(1, 0.97, 0.98);
    // geo2.computeFaceNormals();
    // cube = new THREE.Mesh(geometry, material);
    // cube2 = new THREE.Mesh(geo2, material2);
    // cube.position.set(cameraStart.x, cameraStart.y, cameraStart.z - 150);
    // console.log(cube2);

    // // cube2.position.z = -2;
    // scene.add(cube);
    // cube.add(cube2);

    // var sec2 = geometry.clone();
    // var sec22 = geo2.clone();

    // cube3 = new THREE.Mesh(sec2, material);
    // cube32 = new THREE.Mesh(sec22, material2);

    // cube3.position.set(0,2,0);
    // cube.add(cube3);
    // cube3.add(cube32);

    // console.log(sec2);
}

function removeLoad() {
    var fadeTarget = document.getElementById('loader');
    var fadeEffect = setInterval(function() {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.2;
        } else {
            clearInterval(fadeEffect);
            fadeTarget.style.display = 'none';
        }
    }, 100);
}

function genSun() {
    sunMat = new THREE.MeshStandardMaterial({
        emissiveIntensity: 1,
        emissive: 0xf5e6f0 // darkgrey
    });
    sunGeo = new THREE.IcosahedronGeometry(0.2, 6);
    sun = new THREE.PointLight(0xeee4f5, 1.0, 1500000, 1);
    sun.add(new THREE.Mesh(sunGeo, sunMat));
    sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
    scene.add(sun);
}

function createPlanets() {
    
    planetGeo = new THREE.SphereGeometry(5000, 5000, 20, 20);
    planet = new THREE.Mesh(planetGeo, planetMat);
    moonGeo = new THREE.SphereGeometry(1500, 1500, 20, 20);
    moon = new THREE.Mesh(moonGeo, moonMat);
    earthGeo = new THREE.SphereGeometry(500, 500, 20, 20);
    earth = new THREE.Mesh(earthGeo, earthMat);
    atmo1Geo = new THREE.SphereGeometry(510, 510, 20, 20);
    atmo1 = new THREE.Mesh(atmo1Geo, atmo1Mat);
    
    moon.rotation.z = (15 * Math.PI) / 180;
    var rings = [
        createRing(2190, 20, 0xdec868, 1),
        createRing(2350, 25, 0x95deb9, 3),
        createRing(2250, 40, 0xd44468, -2),
        // createRing(2250, 40, 0xdec868, -1),
        createRing(2400, 10, 0x6bccd1, 4),
        // createRing(2265, 10, 0x8bdb88, 1),
        // createRing(2250, 10, 0x95deb9, 4),
        createRing(2050, 40, 0xdec868, 1),
        createRing(2150, 25, 0xd44468, -2),
        createRing(2100, 10, 0x6bccd1, -3),
        // createRing(1900, 600, 0xd1a7ce, 100)
    ];
    // console.log(rings);

    function createRing(innerW, width, color, z) {

        var random = Math.floor(Math.random() * Math.floor(4))/10;
        console.log(random);
        
        var uniformsRing = {
            iTime: { value: random },
            iResolution: { value: new THREE.Vector2() }
        };

        var ringMat = new THREE.ShaderMaterial({
            fragmentShader,
            uniforms,
            side: THREE.DoubleSide,
            // opacity: 0.8,
            // transparency: true
        });

        // const ringMat = new THREE.MeshStandardMaterial({
        //     color: color, //purple
        //     // color: 0x171717, //black
        //     roughness: 0.8,
        //     opacity: 0.8,
        //     transparent: true,
        //     side: THREE.DoubleSide
        // });
        var ringGeo = new THREE.RingGeometry(innerW, innerW+width, 90);
        var ring = new THREE.Mesh(ringGeo, ringMat);
        if (z){
            ring.position.z = z;
            console.log('set z: '+ z);            
        }
        ring.rotation.x = (-90 * Math.PI) / 180;
        moon.add(ring);
        return ring;
    }

    earth.position.set(earthPosition.x, earthPosition.y, earthPosition.z);
    moon.position.set(moonPosition.x, moonPosition.y, moonPosition.z);
    planet.position.set(planetPosition.x, planetPosition.y, planetPosition.z);

    scene.add(earth);
    scene.add(planet);
    scene.add(moon);
    earth.add(atmo1);
    scene.add(sun);
    phase = 1;
}

function loadTextures() {
    return new Promise((resolve, reject) => {
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Gaseous2-2.png', function(map) {
            moonTex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Gaseous4.png', function(map) {
            planetTex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Clouds4.png', function(map) {
            atmo1Tex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('./img/noiseRefl_reflective-map1.png', function(
            map
        ) {
            reflMap = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Volcanic.png', function(map) {
            earthTex = map;
            if (earthTex && moonTex && atmo1Tex && planetTex && reflMap) {
                resolve();
            } else {
                reject('Didnt work');
            }
        });
    });
}

function createMaterials() {
    earthMat = new THREE.MeshStandardMaterial({
        map: earthTex,
        metalness: 0.1,
        roughness: 0.5
    });

    moonMat = new THREE.MeshStandardMaterial({
        map: moonTex,
        metalness: 0.1,
        roughness: 0.5
    });

    atmo1Mat = new THREE.MeshStandardMaterial({
        map: atmo1Tex,
        metalness: 0.2,
        roughness: 0.6,
        transparent: true,
        opacity: 0.95
    });

    planetMat = new THREE.MeshStandardMaterial({
        map: planetTex,
        metalness: 0.1,
        roughness: 0.5
    });

    asterMat = [
        new THREE.MeshPhysicalMaterial({
            metalness: 1.0,
            roughness: 0,
            transparent: true,
            opacity: 0.05,
            color: 0x17bbd1
            //displacementMap: astDMap,
            // normalMap: gemMap,
            // normalScale: new THREE.Vector2(.20, .20)
        }),
        new THREE.MeshPhysicalMaterial({
            // map:astTex,
            // normalMap:astNMap,
            // displacementMap:astDMap,
            metalness: 0.06,
            roughness: 0.65,
            color: 0x373842
            //displacementMap: astMap,
            //displacementScale: new THREE.Vector2(.2, -.2)
        })
    ];
}
