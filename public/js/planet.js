

var scene, camera, composer, renderer, canvas;
var sunMat, planetMat, atmoMat, atmo, atmo2, atmo3, sunLight;

var planetHolder, planetHolder1, planetHolder2, planetHolder3;
var planet, planet2, planet3, planGeo, atmoGeo, space, bck;
var mouseX = 0,
  mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var windProp = window.innerWidth / window.innerHeight;
var clock = new THREE.Clock();
var cameraAttr = {
  startAngleX: (3 * Math.PI) / 180,
  startAngleY: 0,
  startAngleZ: (-15 * Math.PI) / 180,
  boundX: (1.5 * Math.PI) / 180,
  boundY: (1.5 * Math.PI) / 180
};
var delta, deltaPrime;

init();

///////////////////////////////////////////////////////////////////Initialize//////////////////////
function init() {
  //Setup Renderer
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
    30000
  );
  camera.position.set(12, -3, 45);
  //camera.rotation.x = -15 * Math.PI/180;
  //cameraAttr.startAngleY += ((windProp/-95)+14.5) * Math.PI/180;

  //Ambient Light

  var amb = new THREE.AmbientLight(0x404040, 0.75);
  scene.add(amb);

  spaceMaker();

  //Build Scene
  canvas.addEventListener('mousemove', onMouseM, false);
  renderer.setClearColor(0x050505, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
///////////////////////////////////////////////////////////////////Animate//////////////////////
function render() {
  delta = clock.getDelta() * deltaPrime;
  //sunLight.rotation.y += 180 * Math.PI/180 * delta;
  //console.log(sunLight.rotation.x);

  //planetHolder.rotation.y -= 1.5 * Math.PI/180 * delta;
  planetHolder1.rotation.y -= ((2 * Math.PI) / 180) * delta;
  planetHolder2.rotation.y += ((10 * Math.PI) / 180) * delta;

  //planetHolder.rotation.y += mouseX*delta/20;
  //planetHolder1.rotation.y += Math.abs(mouseY*delta/20);

  camera.rotation.x += mouseY * delta;
  camera.rotation.y += mouseX * delta;

  //console.log(180 * camera.rotation.y / Math.PI + " degrees");

  if (camera.rotation.x >= cameraAttr.startAngleX + cameraAttr.boundX) {
    camera.rotation.x = cameraAttr.startAngleX + cameraAttr.boundX;
  }
  if (camera.rotation.x <= cameraAttr.startAngleX - cameraAttr.boundX) {
    camera.rotation.x = cameraAttr.startAngleX - cameraAttr.boundX;
  }

  if (camera.rotation.y >= cameraAttr.startAngleY + cameraAttr.boundY) {
    camera.rotation.y = cameraAttr.startAngleY + cameraAttr.boundY;
  }
  if (camera.rotation.y <= cameraAttr.startAngleY - cameraAttr.boundY) {
    camera.rotation.y = cameraAttr.startAngleY - cameraAttr.boundY;
  }

  if (planet2 && planet3) {
    planet.rotation.y -= ((8 * Math.PI) / 180) * delta * 2;
    planet2.rotation.y -= ((5 * Math.PI) / 180) * delta * 6;
    planet3.rotation.y -= ((15 * Math.PI) / 180) * delta * 8;

    atmo.rotation.y += ((9 * Math.PI) / 180) * delta * 2;
    //atmo2.rotation.y += 9 * Math.PI/180 * delta;
    //atmo3.rotation.y += 9 * Math.PI/180 * delta;

    //if(planetHolder.rotation.y > 4.7) {	planetHolder.rotation.y -= 8 * Math.PI/180 * delta	};

    //space.rotation.z -= 80 * Math.PI/180 * delta
    //if(camera.position.y > 7.8) {camera.position.y -= 1 * delta };
    //if(camera.rotation.x < -8 * Math.PI/180) {camera.rotation.x += 1.29 * delta * Math.PI/180 * 1.75};
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function spaceMaker() {
  ///Generate Sun

  sunMat = new THREE.MeshStandardMaterial({
    emissiveIntensity: 1,
    emissive: 0xf2c157 // darkgrey
  });

  //Background-Flat
  var backLoader = new THREE.TextureLoader();
  backLoader.load('textures/Planets/space.jpg', function(map) {
    var bckGeo = new THREE.PlaneGeometry(1300, 900, 100);
    var bckMat = new THREE.MeshBasicMaterial({
      map: map
    });
    bck = new THREE.Mesh(bckGeo, bckMat);
    bck.position.z = -800;
    //camera.add(bck);
  });

  var sunGeo = new THREE.IcosahedronGeometry(0.2, 6);
  sunLight = new THREE.PointLight(0xdfb3e3, 3, 3000, 2);
  sunLight.add(new THREE.Mesh(sunGeo, sunMat));

  //Planet Holders
  var planetHolderGeo = new THREE.SphereGeometry(0.02, 1, 1);
  planetHolder = new THREE.Mesh(planetHolderGeo, sunMat);
  planetHolder.position.set(-980, 0, 0);

  planetHolder1 = planetHolder.clone();
  planetHolder1.position.set(0, 0, 0);

  planetHolder2 = planetHolder.clone();
  planetHolder2.position.set(26, 0, 0);

  planetHolder3 = planetHolder.clone();
  planetHolder3.position.set(0, 0, 3);

  scene.add(sunLight);
  sunLight.add(planetHolder);

  planetHolder.add(planetHolder1);
  planetHolder.add(camera);
  planetHolder1.add(planetHolder2);
  planetHolder2.add(planetHolder3);

  //makeBackground();
  generatePlanets();
}

function generatePlanets() {
  ///////Planet 1//////////////////////////
  var planet1Loader = new THREE.TextureLoader();
  planet1Loader.load('textures/Planets/Gaseous2.png', function(map) {
    planGeo = new THREE.SphereGeometry(8, 60, 60);
    planetMat = new THREE.MeshStandardMaterial({
      map: map,
      metalness: 0.2,
      roughness: 0.6
    });

    planet = new THREE.Mesh(planGeo, planetMat);

    var atmo1Loader = new THREE.TextureLoader();
    atmo1Loader.load('textures/Planets/Gaseous4.png', function(map) {
      atmoGeo = new THREE.SphereGeometry(8.1, 60, 60);
      atmoMat = new THREE.MeshStandardMaterial({
        opacity: 0.75,
        map: map,
        metalness: 0.2,
        roughness: 0.6,
        transparent: true
      });

      atmo = new THREE.Mesh(atmoGeo, atmoMat);
      planet.add(atmo);
      planetHolder.add(planet);

      ///Planet 2

      var planet2Loader = new THREE.TextureLoader();
      planet2Loader.load('textures/Planets/Gaseous1.png', function(map) {
        var planGeo2 = new THREE.SphereGeometry(1, 60, 60);
        var planetMat2 = new THREE.MeshStandardMaterial({
          map: map,
          metalness: 0.2,
          roughness: 0.6
        });

        planet2 = new THREE.Mesh(planGeo2, planetMat2);

        planetHolder2.add(planet2);
      });

      ///Planet 3

      var planet3Loader = new THREE.TextureLoader();
      planet3Loader.load('textures/Planets/Terrestrial1.png', function(map) {
        var planGeo3 = new THREE.SphereGeometry(0.07, 60, 60);
        var planetMat3 = new THREE.MeshStandardMaterial({
          map: map,
          metalness: 0.2,
          roughness: 0.6
        });

        planet3 = new THREE.Mesh(planGeo3, planetMat3);
        planetHolder3.add(planet3);
      });

      planetHolder1.rotation.y = (-45 * Math.PI) / 180;
      planetHolder2.rotation.y = (25 * Math.PI) / 180;
      planetHolder.rotation.y = (-30 * Math.PI) / 180;

      calcRatio();
    });
  });
}

function calcRatio() {
  var x = windProp;
  cameraAttr.startAngleY = ((-12.24 * x + 20.35) * Math.PI) / 180;
  deltaPrime = 0.17 * x + 0.65;
  planetHolder1.rotation.y = ((13.99 * x - 52.83) * Math.PI) / 180;
  planetHolder2.rotation.y = ((69.93 * x - 14.16) * Math.PI) / 180;
  planetHolder.rotation.y = ((6.99 * x - 33.92) * Math.PI) / 180;
  camera.rotation.set(
    cameraAttr.startAngleX,
    cameraAttr.startAngleY,
    cameraAttr.startAngleZ
  );
}

function makeBackground() {
  //////////Background
  var spaceTextures = new THREE.TextureLoader();
  var textureEquirec = spaceTextures.load('textures/Planets/space.jpg');
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  var equirectShader = THREE.ShaderLib['equirect'];
  var equirectMaterial = new THREE.ShaderMaterial({
    fragmentShader: equirectShader.fragmentShader,
    vertexShader: equirectShader.vertexShader,
    uniforms: equirectShader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
  });
  equirectMaterial.uniforms['tEquirect'].value = textureEquirec;
  // enable code injection for non-built-in material
  Object.defineProperty(equirectMaterial, 'map', {
    get: function() {
      return this.uniforms.tEquirect.value;
    }
  });

  var params = {
    Equirectangular: function() {
      cubeMesh.material = equirectMaterial;
      cubeMesh.visible = true;
      sphereMaterial.envMap = textureEquirec;
      sphereMaterial.needsUpdate = true;
    }
  };

  space = new THREE.Mesh(
    new THREE.SphereBufferGeometry(100, 100, 100),
    equirectMaterial
  );
  planetHolder.add(space);
}

function onMouseM(event) {
  mouseX = (event.clientX - windowHalfX) / 60000;
  mouseY = (event.clientY - windowHalfY) / 60000;
}
