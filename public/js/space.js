import * as THREE from 'https://threejs.org/build/three.module.js';
import { FBXLoader } from 'https://threejs.org/examples/jsm/loaders/FBXLoader.js';

var scene, camera, renderer, canvas;
var sunGeo, sunMat, sun;
var insideAster;
var planet, planetGeo, planetMat, planetTex;
var moon, moonGeo, moonMat, moonTex;
var atmo1, atmo1Geo, atmo1Mat, atmo1Tex;
var earth, earthGeo, earthMat, earthTex;
var pivotMat, pivotGeo, empty;
var clock = new THREE.Clock();
var phase = 0;
var delta;
var windowHalfY = (window.innerHeight / 2);

init();

function init() {
    canvas = document.getElementById('canvasSpace');
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.divicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    scene = new THREE.Scene();

    //Camera
    camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        300000
    );
    camera.position.set(-15, 0, 40);
    empty = new THREE.Mesh();

    generateSpace();

    renderer.setClearColor(0x050505, 1);
    renderer.render(scene, camera);
    //empty.add(camera);
    requestAnimationFrame(render);

    window.addEventListener('scroll', (e) =>{

        //Get percent scrolled
        var h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        var scrolled = ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100; //0 to 100
        var scrolledInv = 100-scrolled; //100 to 0

        var v1 = document.querySelector(".left");
        var v2 = document.querySelector(".right");
        //console.log(windowHalfY, window.innerHeight, scrolled);
        
        // console.log(scrolled, scrolledD);
        
        // Fade Sections

        if (scrolled > 10){
                v2.style.opacity = 0.0;
            if (scrolled > 90) {
                v2.style.opacity = 1.0;
            }else{
                v1.style.opacity = 0.0;
            }
        }else{
            v1.style.opacity = 1.0;
        }

        // Scroll Camera
        camera.position.z = scrolledInv * 32 * 7 ;
        camera.position.x = scrolledInv * 10.6 * 7;
        camera.position.y = scrolledInv * -3.33333 * 7;
        if (
            camera.position.z <= 1
        ) {
            camera.position.set(0, 0, 0);
        }
        sun.position.x = scrolledInv * -94.67 * 7 + 60000;
        
        
        
    })
}

function render() {
    delta = clock.getDelta();
    scene.updateMatrixWorld();
    if (insideAster) {
        insideAster.intensity = Math.abs(Math.sin(clock.elapsedTime / 4) * 20);
        //console.log(insideAster.intensity);
    }
    if (moon) {
        earth.rotation.y -= ((10 * Math.PI) / 180) * delta;
        atmo1.rotation.y -= ((3 * Math.PI) / 180) * delta;
        moon.rotation.y -= ((3 * Math.PI) / 180) * delta;
    }
    empty.rotation.y += ((4 * Math.PI) / 180) * delta;
    empty.rotation.y;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function generateSpace() {
    //Sun Initial
    sunMat = new THREE.MeshStandardMaterial({
        emissiveIntensity: 1,
        emissive: 0xf5ebdf // darkgrey
    });
    var amb = new THREE.AmbientLight(0x656d8a, 0.3);
    sunGeo = new THREE.IcosahedronGeometry(0.2, 6);
    sun = new THREE.PointLight(0xeee4f5, 1.0, 1500000, 1);
    scene.add(amb);
    sun.add(new THREE.Mesh(sunGeo, sunMat));

    //Pivot Initial
    pivotMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    pivotGeo = new THREE.IcosahedronGeometry(0.2, 0);
    var markerGeo = new THREE.CylinderGeometry(0.2, 0.2, 200, 0);

    generatePlanets();
    createAsteroid();
    //setupSpace();
}



function generatePlanets() {
    //Create Textures
    var textureLoader = new THREE.TextureLoader();
    // textureLoader.load('img/Planets/Gaseous2.png', function(map) {
    //     planetTex = map;
        // planetTex.anisotropy = 16;
        var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Gaseous4.png', function(map) {
            moonTex = map;
            var textureLoader = new THREE.TextureLoader();
        textureLoader.load('img/Planets/Terrestrial3.png', function(map) {
            earthTex = map;
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load('img/Planets/Clouds1.png', function(map) {
            atmo1Tex = map;
            setupSpace();
            //             console.log(scene);
            });
        });
        });
    // });
}

function setupSpace() {
    

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
    // planetMat = new THREE.MeshStandardMaterial({
    //     map: planetTex,
    //     metalness: 0.0,
    //     roughness: 0.5
    // });

    atmo1Mat = new THREE.MeshStandardMaterial({
        map: atmo1Tex,
        metalness: 0.2,
        roughness: 0.6,
        transparent: true,
        opacity: 0.95
    });


    // createEarth
    // planetGeo = new THREE.SphereGeometry(500, 500, 1000, 1000);
    // planet = new THREE.Mesh(planetGeo, planetMat);
    moonGeo = new THREE.SphereGeometry(1500, 1500, 100, 100);
    moon = new THREE.Mesh(moonGeo, moonMat);
    earthGeo = new THREE.SphereGeometry(500, 500, 100, 100);
    earth = new THREE.Mesh(earthGeo, earthMat);
    atmo1Geo = new THREE.SphereGeometry(510, 510, 100, 100);
    atmo1 = new THREE.Mesh(atmo1Geo, atmo1Mat);
    earth.position.set(800, 0, -8000);

    moon.position.set(10000, -3000, 15000);
    camera.position.set(9000, -2500, 20000);
    
    scene.add(earth);
    //scene.add(planet);
    scene.add(moon);
    earth.add(atmo1);
    scene.add(sun);
}

function createAsteroid(params) {
    var astDMap,astNMap, astTex;
    

    var asterMat = [
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
    var loader = new FBXLoader();
    loader.load('models/Small_0010.fbx', function(object) {
        // console.log(object);
        var i = 1;
        object.traverse(function(child) {
            if (child.isMesh) {
                // console.log(child.material, i);
                if (i == 0) {
                    insideAster = new THREE.PointLight(0x17bbd1, 1200.38, 300, .1);
                    child.add(insideAster);
                }
                child.material = asterMat[i];
                //child.castShadow = true;
                //child.receiveShadow = true;
                i--;
            }
        });

        empty.position.set(-15,0,-50);

        empty.add(object);
        scene.add(empty);
    });
}
