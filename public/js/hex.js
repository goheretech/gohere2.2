import * as THREE from 'https://threejs.org/build/three.module.js';

var scene, camera, composer, renderer, mat, canvas, light;
var mouseX = 0,
  mouseY = 0;
var touchX = 0,
  touchY = 0;
var rows = 100,
  cols = 100;
var items;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var clock = new THREE.Clock();
var delta;

var hexSide = 0.5;

var hexV = {
  a: hexSide / 2,
  b: Math.sin(60) * hexSide,
  c: hexSide
};

var colors = [
  0xf542a1, //red
  0xd687d6 //purple
  /*0x65bbe6,	//lightblue
    0x67eb65,	//green
    0xeba865,	//orange
    */
];

var curCol = 0;

init();

///////////////////////////////////////////////////////////////////Initialize//////////////////////
function init() {
  items = rows * cols;
  //Setup Renderer
  canvas = document.getElementById('canvasHex');
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  renderer.setPixelRatio(window.divicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene = new THREE.Scene();

  //Camera
  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    30000
  );
  camera.position.set(0, 0, 40);

  ///Lights
  light = new THREE.PointLight(colors[curCol], 1.5, 100);
  light.position.set(0, 0, 50);
  scene.add(light);

  //Materials
  mat = new THREE.MeshStandardMaterial({
    metalness: 0.4,
    roughness: 0.6,
    color: 0x323133 // darkgrey
  });

  var backMat = new THREE.MeshStandardMaterial({
    metalness: 0.5,
    roughness: 0.3,
    color: 0x171617 // darkgrey
  });

  createHexs();

  var backGeo = new THREE.PlaneGeometry(1000, 1000, 1000);
  var background = new THREE.Mesh(backGeo, backMat);
  background.position.z = -1;
  scene.add(background);

  document.addEventListener('mousemove', onMouseMo, false);
  document.addEventListener('touchstart', onTouch, false);
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('click', changeColor);

  //Build Scene
  renderer.setClearColor(0x1f1e1e, 1);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
///////////////////////////////////////////////////////////////////Animate//////////////////////
function render() {
  delta = clock.getDelta();
  light.color = new THREE.Color(colors[curCol]);
  light.intensity = Math.abs(Math.sin(clock.elapsedTime / 2)) + 0.5;
  light.position.x = mouseX / 15;
  light.position.y = -mouseY / 15;
  //light.position.x = touchX;
  //light.position.y = touchY;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function createHexs() {
  for (var x = 0; x < cols; x++) {
    for (var y = 0; y < rows; y++) {
      var geo = new THREE.CircleGeometry(1, 6);
      var mesh = new THREE.Mesh(geo, mat);
      if (y % 2 == 1) {
        mesh.position.x = 3 * x + 1.5 - cols / 2;
      } else {
        mesh.position.x = 3 * x - cols / 2;
      }

      mesh.position.y = y * 0.9 - rows / 2;
      scene.add(mesh);
    }
  }
}

function changeColor() {
  curCol += 1;
  if (curCol >= colors.length) {
    curCol = 0;
  }
}

function onMouseMo(event) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.updateProjectionMatrix();
}

function onTouch(evt) {
  evt.preventDefault();

  if (
    evt.touches.length > 1 ||
    (evt.type == 'touchend' && evt.touches.length > 0)
  )
    //... if more than 1 touch detected then ignore.
    return;

  //------------------------------------------------------------------------------------

  var reaction_type = null;
  var touch = null;

  switch (evt.type) {
    case 'touchstart':
      touch = evt.changedTouches[0]; //... specify which touch for later extraction of XY position values.
      reaction_type = 'onclick';
      break;
    case 'touchmove': // I don't use this
      reaction_type = 'mousemove';
      touch = evt.changedTouches[0];
      break;
    case 'touchend': // I don't use this
      reaction_type = 'mouseup';
      touch = evt.changedTouches[0];
      break;
  }

  if (reaction_type == 'onclick') {
    touchX = (touch.clientX / window.innerWidth) * 2 - 1;
    touchY = -(touch.clientY / window.innerHeight) * 2 + 1;
  }
}