import * as THREE from 'https://threejs.org/build/three.module.js';


function main() {
    const canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({ canvas });

    renderer.setPixelRatio(window.divicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 25;

    const scene = new THREE.Scene();

    {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    const geometry = new THREE.Geometry();
    geometry.vertices.push(
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

    geometry.faces.push(
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(2, 3, 4),
        new THREE.Face3(4, 5, 2),
        new THREE.Face3(5, 0, 2),
        new THREE.Face3(6, 0, 5),
        new THREE.Face3(6, 9, 0),
        new THREE.Face3(6, 7, 9),
        new THREE.Face3(8, 9, 7)
    );

    const material = new THREE.MeshBasicMaterial({ color: 0x44ff44 });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

        renderer.render(scene, camera);

    
}

main();
