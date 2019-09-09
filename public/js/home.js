import * as THREE from 'https://threejs.org/build/three.module.js';
import { FBXLoader } from 'https://threejs.org/examples/jsm/loaders/FBXLoader.js';

var scene = new THREE.Scene();
var camera, renderer, canvas;
var sunGeo, sunMat, sun;
var planetGeo, planetTex, planetMat, planet;
var moonGeo, moonTex, moonMat, moon;
var earthGeo, earthTex, earthMat, earth;
var atmo1Geo, atmo1Tex, atmo1Mat, atmo1;
var asteroid = [],
    astHolder,
    insideAst,
    asterMat;
var clock = new THREE.Clock();
var phase = 0;
var delta;
var windowHalfY = window.innerHeight / 2;

//Initial Values
// var cameraStart = { x: 0, y: 0, z: 0 }; //og - end
// var cameraStart = { x: 17920, y: -2333, z: 21600 }; //mid
var cameraStart = { x: 17920, y: -2333, z: 47600 }; //start

// var asterPosition = { x: -10, y: 0, z: -50 }; //og - end
// var asterPosition = { x: -10, y: 0, z: -30 }; //mid
var asterPosition = { x: -10, y: 0, z: -50 }; //start

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
var earthPosition = { x: 29000, y: 0, z: -6000 }; //start

init();

async function init() {
    await loadTextures()
        .then(createMaterials)
        .catch(err => console.log(err));
    await loadModel();

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
        0.1,
        300000
    );

    camera.position.set(cameraStart.x, cameraStart.y, cameraStart.z);

    //Ambient Lighting
    var amb = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(amb);

    //Create sun
    genSun();

    //Create Planets
    createPlanets();

    //Asteroid
    astHolder = new THREE.Mesh();
    asteroid.forEach(i => {
        astHolder.add(i);
    });
    astHolder.position.set(asterPosition.x, asterPosition.y, asterPosition.z);
    scene.add(astHolder);
    console.log(scene);

    renderer.setClearColor(0x050505, 1);
    // renderer.setClearColor(0x8a8988, 1);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    window.addEventListener('scroll', scrolling);
}

function render() {
    delta = clock.getDelta();
    switch (phase) {
        case 0:
            
            break;
        case 1:
            insideAst.intensity = Math.abs(
                Math.sin(clock.elapsedTime / 4) * 20
            );
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
        ((h[st] || b[st]) /
            ((h[sh] || b[sh]) - h.clientHeight)) *
        100; //0 to 100
    var scrolledInv = 100 - scrolled; //100 to 0

    console.log(camera.position);
    
    var x = scrolled;
    // Scroll Camera    
    camera.position.z = (22/25)*Math.pow(x,2)-(564/1)*x+(47600/1);

    //Move Planet
    planet.position.x = 320*x+12000

    //Move Moon
    moon.position.x = (7 / 5) * Math.pow(x, 2) - 230 * x + 19000;

    //Move earth
    earth.position.x = (119 / 50) * Math.pow(x, 2) - 519 * x + 29000;

    //Move sun
    sun.position.x = (-6740 / 10)  * x + 33700;


    camera.position.x = scrolledInv * 25.6 * 7;
    camera.position.y = scrolledInv * -3.33333 * 7;
}


function genSun(){
    sunMat = new THREE.MeshStandardMaterial({
        emissiveIntensity: 1,
        emissive: 0xf5ebdf // darkgrey
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
}

function loadTextures() {
    return new Promise((resolve, reject) => {
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Gaseous4.png', function(map) {
            moonTex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Gaseous2.png', function(map) {
            planetTex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Clouds1.png', function(map) {
            atmo1Tex = map;
        });
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Terrestrial3.png', function(map) {
            earthTex = map;
            if (earthTex && moonTex && atmo1Tex && planetTex) {
                resolve();
            } else {
                reject('Didnt work');
            }
        });
    });
}

function loadModel() {
    return new Promise((resolve, reject) => {
        var loader = new FBXLoader();
        loader.load('models/Small_0010.fbx', function(object) {
            object.traverse(function(child) {
                
                if (child.isMesh) {
                    asteroid.push(child);
                }
            });
            insideAst = new THREE.PointLight(0x17bbd1, 1200.38, 300, 0.1);
            asteroid.push(insideAst);
            asteroid[0].material = asterMat[1];
            asteroid[1].material = asterMat[0];
            if (asteroid.length >= 3) {
                phase = 1;
                resolve();
            } else {
                reject('wtf?');
            }
        });
    });
}

function createMaterials() {
    earthMat = new THREE.MeshStandardMaterial({
        map: earthTex,
        metalness: 0.0,
        roughness: 0.5
    });

    moonMat = new THREE.MeshStandardMaterial({
        map: moonTex,
        metalness: 0.0,
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
        metalness: 0.0,
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
