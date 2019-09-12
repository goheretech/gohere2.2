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
var planetPosition = { x: 12000, y: -4000, z: 30000 }; //start

// var moonPosition = { x: 10000, y: -3000, z: 15000 }; //og - end
// var moonPosition = { x: 11000, y: -1700, z: 15000 }; //mid
var moonPosition = { x: 19000, y: -1700, z: 15000 }; //start

// var earthPosition = { x: 900, y: 0, z: -6000 }; //og - end
// var earthPosition = { x: 9000, y: 0, z: -6000 }; //mid
// var earthPosition = { x: 29000, y: 0, z: -20000 }; //start
var earthPosition = { x: -25, y: 0, z: -2780 }; //start

init();

async function init() {
    await loadTextures()
        .then(createMaterials)
        .catch(err => console.log(err));
    // await loadModel();

    canvas = document.getElementById('canvas');
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
    var amb = new THREE.AmbientLight(0xf2e1ed, 0.2);
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
}

function render() {
    delta = clock.getDelta();
    var time = clock.elapsedTime;
    switch (phase) {
        case 0:
            
            break;
        case 1:
            uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
            uniforms.iTime.value = time;
            astHolder.rotation.y += 2 * Math.PI/180 * delta;
            earth.rotation.y += 1 * Math.PI/180 * delta;
            atmo1.rotation.y += 1 * Math.PI/180 * delta;

            moon.rotation.y += 3 * Math.PI/180 * delta;
            planet.rotation.y += 3 * Math.PI/180 * delta;
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
    planet.position.x = 320 * x + 12000;

    //Move Moon
    moon.position.x = (7 / 5) * Math.pow(x, 2) - 230 * x + 19000;

    //Move earth
    // earth.position.x = (119 / 50) * Math.pow(x, 2) - 519 * x + 29000;

    //Move sun
    sun.position.x = (-6740 / 7) * x + 33700;

    camera.position.x = scrolledInv * 25.6 * 7;
    camera.position.y = scrolledInv * -3.33333 * 7;
    camera.position.z = (22 / 25) * Math.pow(x, 2) - (564 / 1) * x + 47600 / 1;

    secHolder.position.x = scrolledInv * 25.6 * 7;
    secHolder.position.y = 487* scrolled -14800;
    secHolder.position.z = ((22 / 25) * Math.pow(x, 2) - (564 / 1) * x + 47600 / 1 )-12025;
    console.log(secHolder.position.y);
    
    // cube2.position.x = scrolledInv * 25.6 * 7;
    // cube2.position.y = 487* x -10000;
    // cube2.position.z = ((22 / 25) * Math.pow(x, 2) - (564 / 1) * x + 47600 / 1 )-11025;
}

function generateGradient() {

    const fragmentShader = `
    #include <common>

    uniform vec3 iResolution;
    uniform float iTime;

    // By iq: https://www.shadertoy.com/user/iq  
    // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = fragCoord/iResolution.xy;

        // Time varying pixel color
        vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

        // Output to screen
        fragColor = vec4(col,1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;
    uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector3() }
        };
    matEdge = new THREE.ShaderMaterial({
            
            fragmentShader,
            uniforms,
        });
    // matEdge.lights = true;
    // const matEdge = new THREE.MeshStandardMaterial({
    //     color: 0x906094, //purple
    //     // color: 0x171717, //black
    //     roughness: 0.2
    // });
    const matInside = new THREE.MeshStandardMaterial({
        color: 0x121212, //grey
        // color: 0x906094, //purple
        metalness: 0.9,
        roughness: 0.6,
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
    insideSecGeo.scale(1, 0.97, 0.98);
    insideSecGeo.computeFaceNormals();

    function makeInstance(geometry, material, x, y, z, parent){
        var section = new THREE.Mesh(geometry, material);
        parent.add(section);
        section.position.set(x,y,z);
        console.log('created');
        return section
        
    }
    
    sections = [
        makeInstance(
            secGeo,
            matEdge,
            0,
            0,
            0,
            secHolder
            ),
        makeInstance(
            insideSecGeo,
            matInside,
            0,
            0,
            5,
            secHolder
            ),
        makeInstance(
            secGeo,
            matEdge,
            0,
            -17150,
            0,
            secHolder
            ),
        makeInstance(
            insideSecGeo,
            matInside,
            0,
            -17150,
            5,
            secHolder
            )
    ];
    console.log(sections);
    
    
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


function removeLoad(){
    var fadeTarget = document.getElementById("loader");
        var fadeEffect = setInterval(function () {
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


function genSun(){
    sunMat = new THREE.MeshStandardMaterial({
        emissiveIntensity: 1,
        emissive: 0xf5e6f0 // darkgrey
    });
    sunGeo = new THREE.IcosahedronGeometry(0.2, 6);
    sun = new THREE.PointLight(0xeee4f5, 1.0, 1500000, 3);
    sun.add(new THREE.Mesh(sunGeo, sunMat));
    sun.position.set(sunPosition.x, sunPosition.y, sunPosition.z);
    scene.add(sun);
}

function createPlanets(){
    planetGeo = new THREE.SphereGeometry(5000, 5000, 25, 25);
    planet = new THREE.Mesh(planetGeo, planetMat);
    moonGeo = new THREE.SphereGeometry(1500, 1500, 25, 25);
    moon = new THREE.Mesh(moonGeo, moonMat);
    earthGeo = new THREE.SphereGeometry(500, 500, 25, 25);
    earth = new THREE.Mesh(earthGeo, earthMat);
    atmo1Geo = new THREE.SphereGeometry(510, 510, 25, 25);
    atmo1 = new THREE.Mesh(atmo1Geo, atmo1Mat);

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
        textureLoader.load('img/Planets/Gaseous2.png', function(map) {
            moonTex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Gaseous4.png', function(map) {
            planetTex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Clouds1.png', function(map) {
            atmo1Tex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('./img/noiseRefl_reflective-map1.png', function(
            map
        ) {
            reflMap = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Terrestrial3.png', function(map) {
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
