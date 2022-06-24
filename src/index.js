import "./assets/index.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  CameraRig,
  FreeMovementControls,
  CameraHelper,
  ScrollControls,
  ThreeDOFControls,
} from "three-story-controls";
import * as dat from "dat.gui";
import "./js/vue-init";
import greensockInit from "./js/greensock";
import { TOUCH, WebGLRenderer } from "three";
const body = document.querySelector("body");
const kyrosElem = document.querySelector("#kyros");
const incubateElem = document.querySelector("#incubate");
const loadingScreen = document.querySelector("#loading");
const redColor = new THREE.Color("rgb(255, 0, 0)");
const circleColor = new THREE.Color(0x101010);
loadingScreen.style.display = "flex";
let isLoadedModel = false;
window.scrollTo({ top: 0, behavior: "smooth" });
const models = {
  /*  globle: {
    dot: null,
    VN: null,
    world: null,
  }, */
  globle: null,
  redCircle: null,
  hand: null,
  key: null,
  cubes: [],
  logo: null,
  circle: [],
  threeKeys: [],
};
const vietNameRad = 3.1;
let sceneReady = false;
let isWheeling = false;
const PI = Math.PI;

const barInner = document.querySelector(".bar-inner");
let loadingInterval;
let barInnerWidth = 30;

barInner.style.width = `30%`;
setTimeout(() => {
  barInner.style.transition = "none";
  loadingInterval = setInterval(() => {
    barInnerWidth -= 0.01;
    barInner.style.width = `${barInnerWidth}%`;
    if (barInnerWidth <= 10) clearInterval(loadingInterval);
  }, 10);
}, 1400);

/* --------------------------------------------- */
// Debug
//hinh cau
//const gui = new dat.GUI();
/* const globeFolder = gui.addFolder("Globe");
const globePos = globeFolder.addFolder("Globe POS");
const globeRotate = globeFolder.addFolder("Globe Rotate");
const globleScale = globeFolder.addFolder("Globe Scale");

//vong tron cham do
const redCircleForder = gui.addFolder("redCircle");
const redCirclePos = redCircleForder.addFolder("redCircle POS");
const redCircleRotate = redCircleForder.addFolder("redCircle Rotate");
const redCircleScale = redCircleForder.addFolder("redCircle Scale");

//logo
const logoFolder = gui.addFolder("Logo");
const logoPos = logoFolder.addFolder("Logo POS");
const logoScale = logoFolder.addFolder("Logo Scale");
const logoRotate = logoFolder.addFolder("Logo Rotate");

// key

const keyFolder = gui.addFolder("Key");
const keyPos = keyFolder.addFolder("Key POS");
const keyRotate = keyFolder.addFolder("Key Rotate");
const keyScale = keyFolder.addFolder("Key Scale"); */

// Scene
const scene = new THREE.Scene();

const debugObject = {};
/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      //child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    let isRunIntro = false;
    sceneReady = true;
    const keyHole = loadingScreen.querySelector(".key-hole");
    const flashLight = document.querySelector(".flash-light");
    //create text enter
    if (loadingInterval) {
      clearInterval(loadingInterval);
      barInner.style.cssText = `
        transition: width 2s linear;
        width: 0%;
      `;

      setTimeout(() => {
        setTimeout(() => {
          keyHole.addEventListener("click", () => {
            if (isRunIntro) return;
            isRunIntro = true;
            setTimeout(() => {
              loadingScreen.style.display = "none";
            }, 300);
            flashLight.classList.add("boom");
            setTimeout(() => {
              intro();
              greensockInit();
            }, 1400);
          });
        });
        keyHole.classList.add("done");

        document.querySelector(".bar").style.opacity = 0;
      }, 2000);
    }
  }
);

const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const canvasParent = document.querySelector(".canvas-parent");
const scrollElement = document.querySelector(".scroller");

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x600000, 0);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight);

canvasParent.appendChild(renderer.domElement);

updateAllMaterials();

gltfLoader.load("/models/traidatfix.gltf", (gltf) => {
  models.globle = gltf.scene.children[0];

  models.globle.position.set(0, 0.047, 5.9);
  models.globle.rotation.set(0.33, 0, 0.02);
  models.globle.scale.set(0, 0, 0);

  models.globle.children.forEach((item) => {
    item.material.transparent = true;
  });

  //models.globle.children[0].material.opacity = 0;
  models.globle.children[1].material.opacity = -3;
  scene.add(gltf.scene);
  updateAllMaterials();
});
// vong tron cham do
gltfLoader.load("/models/circle.gltf", (gltf) => {
  models.redCircle = gltf.scene.children[0];
  models.redCircle.scale.set(0, 0, 0);
  models.redCircle.position.set(0, 0.11, 4.4);
  models.redCircle.rotation.set(0, 0.01, 0);
  models.redCircle.material.transparent = true;
  models.redCircle.material.color = circleColor;
  models.redCircle.material.emissive = circleColor;
  models.redCircle.material.opacity = 0.2;

  scene.add(gltf.scene);
  /*   redCirclePos.add(models.redCircle.position, "x").min(-10).max(10).step(0.01);
  redCirclePos.add(models.redCircle.position, "y").min(-10).max(10).step(0.01);
  redCirclePos.add(models.redCircle.position, "z").min(-10).max(10).step(0.01);
  redCircleScale.add(models.redCircle.scale, "x").min(0.1).max(10).step(0.01);
  redCircleScale.add(models.redCircle.scale, "y").min(0.1).max(10).step(0.01);
  redCircleScale.add(models.redCircle.scale, "z").min(0.1).max(10).step(0.01);
  redCircleRotate.add(models.redCircle.rotation, "x").min(-5).max(5).step(0.01);
  redCircleRotate.add(models.redCircle.rotation, "y").min(-5).max(5).step(0.01);
  redCircleRotate.add(models.redCircle.rotation, "z").min(-5).max(5).step(0.01); */
  updateAllMaterials();
});
// vong tron
for (let i = 0; i < 8; i++) {
  gltfLoader.load("/models/circle.gltf", (gltf) => {
    gltf.scene.children[0].position.set(0, 0, -20);
    gltf.scene.children[0].material.transparent = true;
    gltf.scene.children[0].material.color = circleColor;
    gltf.scene.children[0].material.emissive = circleColor;
    gltf.scene.children[0].scale.set(0, 0, 0);
    models.circle.push(gltf.scene.children[0]);
    scene.add(gltf.scene);

    updateAllMaterials();
  });
}

//logo
gltfLoader.load("/models/logo.gltf", (gltf) => {
  models.logo = gltf.scene.children[0];
  models.logo.position.set(0.3, 0.6, 4);
  models.logo.scale.set(0, 0, 0);
  models.logo.rotation.set(0.21, 0.6, -0.05);
  models.logo.material.emissive = redColor;
  models.logo.material.color = redColor;
  scene.add(gltf.scene);

  /*   logoPos.add(models.logo.position, "x").min(-100).max(100).step(0.1);
  logoPos.add(models.logo.position, "y").min(-100).max(100).step(0.1);
  logoPos.add(models.logo.position, "z").min(-100).max(100).step(0.1);
  logoScale.add(models.logo.scale, "x").min(0).max(2).step(0.001);
  logoScale.add(models.logo.scale, "y").min(0).max(2).step(0.001);
  logoScale.add(models.logo.scale, "z").min(0).max(2).step(0.001);
  logoRotate.add(models.logo.rotation, "x").min(-10).max(10).step(0.01);
  logoRotate.add(models.logo.rotation, "y").min(-10).max(10).step(0.01);
  logoRotate.add(models.logo.rotation, "z").min(-10).max(10).step(0.01); */
  updateAllMaterials();
});

// cubes
const initCubesPos = [
  { x: -5.3, y: 3.7, z: -0.6 },
  { x: -1.2, y: 5.6, z: -6.2 },
  { x: 6.4, y: 9.1, z: -15.7 },
  { x: 5.9, y: 3.4, z: -0.1 },
  { x: -6.5, y: -3.6, z: -2.5 },
  { x: -4.8, y: -8.6, z: -24.9 },
  { x: 4.9, y: -3, z: 0.1 },
];

const initCubesRotate = [
  { x: -0.9, y: 0.58, z: -0.3 },
  { x: -0.02, y: 0.1, z: 1.18 },
  { x: -1.89, y: 0.67, z: -2.14 },
  { x: -1.08, y: -0.98, z: -0.85 },
  { x: 0.49, y: -0.38, z: -1.75 },
  { x: -1.18, y: 1.03, z: 0.07 },
  { x: -1.34, y: 0.21, z: 0.27 },
];

initCubesPos.forEach((item) => {
  item.z -= 6.4;
});

const initCubesTimeStart = [0.2, 0.5, 0.75, 0.4, 0.3, 0.75, 0];
const initCubesTimeEnd = [0.7, 0.8, 1, 0.7, 0.7, 1, 0.6];
for (let i = 0; i < 7; i++) {
  gltfLoader.load("/models/cube-small.gltf", (gltf) => {
    scene.add(gltf.scene);
    gltf.scene.children[0].position.set(
      initCubesPos[i].x,
      initCubesPos[i].y,
      initCubesPos[i].z
    );
    gltf.scene.children[0].rotation.set(
      initCubesRotate[i].x,
      initCubesRotate[i].y,
      initCubesRotate[i].z
    );
    gltf.scene.children[0].scale.set(0, 0, 0);

    gltf.scene.children[0].children[1].material.emissive = circleColor;
    gltf.scene.children[0].children[1].material.color = circleColor;

    /* const cubeFolder = gui.addFolder(`Cube${i}`);
    const cubePos = cubeFolder.addFolder("Cube Pos");
    const cubeRotate = cubeFolder.addFolder("Cube Rotate");
    const cubeScale = cubeFolder.addFolder("Cube Scale");
    cubePos
      .add(gltf.scene.children[0].position, "x")
      .min(-100)
      .max(100)
      .step(0.1);
    cubePos
      .add(gltf.scene.children[0].position, "y")
      .min(-100)
      .max(100)
      .step(0.1);
    cubePos
      .add(gltf.scene.children[0].position, "z")
      .min(-100)
      .max(100)
      .step(0.1);
    cubeScale.add(gltf.scene.children[0].scale, "x").min(0.1).max(2).step(0.1);
    cubeScale.add(gltf.scene.children[0].scale, "y").min(0.1).max(2).step(0.1);
    cubeScale.add(gltf.scene.children[0].scale, "z").min(0.1).max(2).step(0.1);
    cubeRotate
      .add(gltf.scene.children[0].rotation, "x")
      .min(-10)
      .max(10)
      .step(0.01);
    cubeRotate
      .add(gltf.scene.children[0].rotation, "y")
      .min(-10)
      .max(10)
      .step(0.01);
    cubeRotate
      .add(gltf.scene.children[0].rotation, "z")
      .min(-10)
      .max(10)
      .step(0.01);
 */
    models.cubes.push(gltf.scene.children[0]);
    updateAllMaterials();
  });
}
// key
gltfLoader.load("/models/key.gltf", (gltf) => {
  scene.add(gltf.scene);
  models.key = gltf.scene.children[0];
  models.key.position.set(-10, 5, 0);
  models.key.rotation.set(0.48, -0.78, 2.7);
  models.key.scale.set(0, 0, 0);
  models.key.material.transparent = true;

  /* keyPos.add(models.key.position, "x").min(-100).max(100).step(0.1);
  keyPos.add(models.key.position, "y").min(-100).max(100).step(0.1);
  keyPos.add(models.key.position, "z").min(-100).max(100).step(0.1);
  keyRotate.add(models.key.rotation, "x").min(-10).max(10).step(0.01);
  keyRotate.add(models.key.rotation, "y").min(-10).max(10).step(0.01);
  keyRotate.add(models.key.rotation, "z").min(-10).max(10).step(0.01);
  keyScale.add(models.key.scale, "x").min(0.1).max(2).step(0.1);
  keyScale.add(models.key.scale, "y").min(0.1).max(2).step(0.1);
  keyScale.add(models.key.scale, "z").min(0.1).max(2).step(0.1); */

  updateAllMaterials();
});

let initThreeKeysPos = [
  { x: -5.8, y: 1.7, z: 1 },
  { x: 0.1, y: -3.6, z: 1 },
  { x: 5, y: 3.5, z: 1 },
];

initThreeKeysPos = initThreeKeysPos.map((item) => {
  return {
    x: item.x,
    y: item.y,
    z: item.z - 5,
  };
});

const initThreeKeysRotation = [
  { x: 0.87, y: 0.85, z: 1 },
  { x: 0.47, y: 0.68, z: 1 },
  { x: 0.97, y: 0.19, z: 1 },
];
/* const threeKeysFolder = gui.addFolder("ThreeKeys");
const threeKeysPos = threeKeysFolder.addFolder("POS");
const threeKeysScale = threeKeysFolder.addFolder("scale");
const threeKeysRotation = threeKeysFolder.addFolder("Rot"); */

for (let i = 0; i < 3; i++) {
  gltfLoader.load("/models/key.gltf", (g) => {
    g.scene.children[0].scale.set(0, 0, 0);
    g.scene.children[0].position.set(
      initThreeKeysPos[i].x,
      initThreeKeysPos[i].y,
      initThreeKeysPos[i].z
    );
    g.scene.children[0].rotation.set(
      initThreeKeysRotation[i].x,
      initThreeKeysRotation[i].y,
      initThreeKeysRotation[i].z
    );
    g.scene.children[0].material.transparent = true;
    models.threeKeys.push(g.scene.children[0]);
    /*   threeKeysPos
      .add(g.scene.children[0].position, "x")
      .min(-100)
      .max(100)
      .step(0.1);
    threeKeysPos
      .add(g.scene.children[0].position, "y")
      .min(-100)
      .max(100)
      .step(0.1);
    threeKeysPos
      .add(g.scene.children[0].position, "z")
      .min(-100)
      .max(100)
      .step(0.1);
    threeKeysScale
      .add(g.scene.children[0].scale, "x")
      .min(0)
      .max(2)
      .step(0.001);
    threeKeysScale
      .add(g.scene.children[0].scale, "y")
      .min(0)
      .max(2)
      .step(0.001);
    threeKeysScale
      .add(g.scene.children[0].scale, "z")
      .min(0)
      .max(2)
      .step(0.001);
    threeKeysRotation
      .add(g.scene.children[0].rotation, "x")
      .min(-10)
      .max(10)
      .step(0.01);
    threeKeysRotation
      .add(g.scene.children[0].rotation, "y")
      .min(-10)
      .max(10)
      .step(0.01);
    threeKeysRotation
      .add(g.scene.children[0].rotation, "z")
      .min(-10)
      .max(10)
      .step(0.01); */
    scene.add(g.scene);
    updateAllMaterials();
  });
}
/**
 * Lights
 */
/* const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight); */

WebGLRenderer.physicallyCorrectLights = true;

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
hemisphereLight.position.set(0, 300, 0);
scene.add(hemisphereLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); //
scene.add(ambientLight);
let isSetRedLight = false;
const dirLight = new THREE.DirectionalLight(0xff0000, 1);
dirLight.position.set(0, 0, 8);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(0, 0, 8);
scene.add(camera);

// Controls
const rig = new CameraRig(camera, scene);

let circleIntervals = [];
function circleAnimation(progress, models, index) {
  if (!models) return;
  if (!circleIntervals[index]) {
    const interval = setInterval(() => {
      models.rotation.z -= 0.001;
    }, 10);
    circleIntervals.push(interval);
  }

  models.scale.set(
    5 + 21 * Math.pow(progress, 2),
    5 + 21 * Math.pow(progress, 2),
    1
  );

  if (progress < 0.5) {
    models.material.opacity = 4 * progress * progress;
  } else {
    models.material.opacity = Math.pow(2 * progress - 2, 2);
  }
}

function circleAnimation1(progress) {
  circleAnimation(progress, models.circle[0], 0);
}
function circleAnimation2(progress) {
  circleAnimation(progress, models.circle[1], 1);
}
function circleAnimation3(progress) {
  circleAnimation(progress, models.circle[2], 2);
}
function circleAnimation4(progress) {
  circleAnimation(progress, models.circle[3], 3);
}
function circleAnimation5(progress) {
  circleAnimation(progress, models.circle[4], 4);
}
function circleAnimation6(progress) {
  circleAnimation(progress, models.circle[5], 5);
}
function circleAnimation7(progress) {
  circleAnimation(progress, models.circle[6], 6);
}
function circleAnimation8(progress) {
  circleAnimation(progress, models.circle[7], 7);
}

const circleFuncs = [
  {
    start: "10%",
    end: "25%",
    callback: circleAnimation1,
  },
  {
    start: "22%",
    end: "37%",
    callback: circleAnimation2,
  },
  {
    start: "32%",
    end: "47%",
    callback: circleAnimation3,
  },
  {
    start: "42%",
    end: "57%",
    callback: circleAnimation4,
  },
  {
    start: "52%",
    end: "67%",
    callback: circleAnimation5,
  },
  {
    start: "62%",
    end: "77%",
    callback: circleAnimation6,
  },
  /*  {
    start: "72%",
    end: "87%",
    callback: circleAnimation7,
  },
  {
    start: "82%",
    end: "100%",
    callback: circleAnimation8,
  }, */
];

const controls = new ScrollControls(rig, {
  buffer: 20,
  scrollElement,
  dampingFactor: 0.1,
  startOffset: "0",
  endOffset: "-100vh",
  scrollActions: [
    ...circleFuncs,
    {
      start: "0%",
      end: "100%",
      callback: handleKyros,
    },
    {
      start: "0%",
      end: "5%",
      callback: rotateGlobeAni,
    },
    {
      start: "5%",
      end: "12%",
      callback: logoAnimation,
    },
    {
      start: "13%",
      end: "15%",
      callback: nextScene1,
    },
    {
      start: "15%",
      end: "25%",
      callback: cubesAnimation,
    },
    {
      start: "26%",
      end: "28%",
      callback: nextScene2,
    },
    {
      start: "28%",
      end: "36%",
      callback: keyAnimation,
    },
    {
      start: "37%",
      end: "40%",
      callback: nextScene3,
    },
    {
      start: "40%",
      end: "55%",
      callback: threeKeysAnimation,
    },
    {
      start: "55%",
      end: "58%",
      callback: nextScene4,
    },
    {
      start: "58%",
      end: "68%",
      callback: builderAnimation,
    },
    {
      start: "68%",
      end: "70%",
      callback: nextScene5,
    },
  ],
});

function handleKyros(progress) {
  if (progress >= 0.14 || progress <= 0.07) {
    kyrosElem.style.opacity = 0;
  } else {
    kyrosElem.style.opacity = 1;
  }
}

/* intro function  */
function intro() {
  let introInterval;
  const a = (2 * PI) / 400;
  let b = 0;
  let c = 0;
  models.globle.scale.set(1, 1, 1);
  models.redCircle.scale.set(2.02, 2.02, 2.02);
  setInterval(() => {
    models.redCircle.rotation.z -= 0.001;
  }, 10);
  introInterval = setInterval(() => {
    models.globle.rotation.y += a;
    models.globle.children[1].material.opacity += 1 / 100;
    b += 1 / 400;
    c += 1 / 400;
    models.redCircle.scale.set(2.02 - b, 2.02 - b, 2.02 - b);
    models.redCircle.material.opacity = 0 + c;
    if (b >= 1) {
      clearInterval(introInterval);
      isLoadedModel = true;
    }
  }, 10);
}

/*  */
const controls3dof = new ThreeDOFControls(rig, {
  panFactor: Math.PI / 100,
  tiltFactor: Math.PI / 100,
  truckFactor: 0,
  pedestalFactor: 0,
});

controls.enable();
controls3dof.enable();

const scrollerContainer = document.querySelector(".scroller");
const autoPlayBtn = document.querySelector("#auto-play-btn");
let myInterval;
autoPlayBtn.onclick = function (e) {
  autoPlayBtn.classList.add("inactive");
  const onePercentHeight = scrollerContainer.scrollHeight / 3000;
  myInterval = setInterval(() => {
    body.scrollTop += onePercentHeight;
    if (body.scrollTop.scrollHeight >= scrollerContainer.scrollHeight) {
      clearInterval(myInterval);
    }
  }, 10);
};

body.addEventListener(
  "wheel",
  (e) => {
    if (!isLoadedModel) {
      e.preventDefault();
      return;
    }
    if (window.scrollY < 400) {
      autoPlayBtn.classList.remove("inactive");
      clearInterval(myInterval);
    }

    let delta = 0;
    if (e.wheelDelta)
      delta = e.wheelDelta / 100; //controls the scroll wheel range/speed
    else if (e.detail) delta = -e.detail / 100;

    handle(delta);
    if (e.preventDefault) e.preventDefault();
  },
  { passive: false }
);
let goUp = true;
let end = null;
let interval = null;

function handle(delta) {
  let animationInterval = 20; //controls the scroll animation after scroll is done
  let scrollSpeed = 20; //controls the scroll animation after scroll is done

  if (end == null) {
    end = body.scrollTop;
  }
  end -= 20 * delta;
  goUp = delta > 0;

  if (interval == null) {
    interval = setInterval(function () {
      let scrollTop = body.scrollTop;
      let step = Math.round((end - scrollTop) / scrollSpeed);
      isWheeling = true;
      if (goUp) {
        animate(-1);
      } else animate();
      if (
        scrollTop <= 0 ||
        scrollTop >= body.scrollHeight - body.height ||
        (goUp && step > -1) ||
        (!goUp && step < 1)
      ) {
        clearInterval(interval);
        isWheeling = false;
        interval = null;
        end = null;
      }
      body.scrollTop = scrollTop + step;
    }, animationInterval);
  }
}

window.addEventListener(
  "scroll",
  (e) => {
    if (!isLoadedModel) e.preventDefault();
  },
  { passive: false }
);
// animation section 1
function rotateGlobeAni(progress) {
  if (!models.globle || !models.redCircle) return;
  models.globle.scale.set(
    1 + 0.9 * progress ** 2,
    1 + 0.9 * progress ** 2,
    1 + 0.9 * progress ** 2
  );

  models.globle.children[0].material.opacity = 1 - 1.5 * progress;
  models.globle.children[2].material.opacity = 1 - 1.5 * progress;
  models.globle.children[1].material.opacity = 1 - progress ** 3;

  models.redCircle.scale.set(
    1.02 + 2.5 * progress,
    1.02 + 2.5 * progress,
    1.02
  );
  models.redCircle.material.opacity = 1 - progress;
  if (progress >= 1) {
    models.globle.scale.set(0, 0, 0);
    models.redCircle.scale.set(0, 0, 0);
    if (!isSetRedLight) {
      scene.add(dirLight);
      isSetRedLight = true;
    }
  } else {
    if (isSetRedLight) {
      scene.remove(dirLight);
      isSetRedLight = false;
    }
  }
  //redlight
}

let logoInterval;
let ampX = 0;
let ampY = 0;

let rotateBounceX = 0.001;
let rotateBounceY = 0.001;

function logoAnimation(progress) {
  if (!models.logo) return;
  models.logo.scale.set(0.018 * progress, 0.018 * progress, 0.018 * progress);
  models.logo.rotation.y = -4 + 4.6 * progress;
  models.logo.rotation.z = -1.55 + 1.5 * progress;

  if (progress < 1 && logoInterval) {
    clearInterval(logoInterval);
    logoInterval = undefined;
  }

  if (progress >= 1) {
    if (logoInterval) {
      return;
    }
    logoInterval = setInterval(() => {
      models.logo.rotation.x += rotateBounceX;
      //models.logo.rotation.y += rotateBounceY;

      ampX += rotateBounceX;
      ampY += rotateBounceY;

      if (ampX >= 0.06) {
        rotateBounceX = -0.001;
      } else if (ampX <= -0.06) {
        rotateBounceX = 0.001;
      }

      if (ampY >= 0.06) {
        rotateBounceY = -0.001;
      } else if (ampY <= -0.06) {
        rotateBounceY = 0.001;
      }
    }, 25);
  }
}

function nextScene1(progress) {
  if (!models.logo) return;
  if (logoInterval) {
    clearInterval(logoInterval);
    logoInterval = undefined;
  }
  models.logo.position.z = 4 + 4.4 * progress * progress;
}
// animation section 2
let isSetCubeInterval = false;

function cubesAnimation(progress) {
  if (!models.cubes.length) return;
  if (!isSetCubeInterval) {
    for (let i = 0; i < 7; i++) {
      const a = (Math.random() * (0.0008 - 0.0005) + 0.0005).toFixed(5);
      setInterval(() => {
        models.cubes[i].rotation.x += parseFloat(a);
        models.cubes[i].rotation.y += parseFloat(a);
        models.cubes[i].rotation.z += parseFloat(a);
      }, 10);
    }
    isSetCubeInterval = true;
  }

  models.cubes.forEach((cube, index) => {
    if (
      progress >= initCubesTimeStart[index] &&
      progress <= initCubesTimeEnd[index]
    ) {
      const pc = 1 / (initCubesTimeEnd[index] - initCubesTimeStart[index]);
      const prog = progress - initCubesTimeStart[index];
      cube.scale.set(pc * prog, pc * prog, pc * prog);
      cube.position.z = initCubesPos[index].z + 6.4 * pc * prog;

      /*  if (index === 2) {
        console.log(
          prog,
          initCubesPos[index].z + 6.4 * pc * prog,
          models.cubes[2].position
        );
      } */
    }
  });
}

// animation next scene 2

function nextScene2(progress) {
  if (!models.cubes.length) return;

  models.cubes.forEach((cube, index) => {
    cube.position.z = initCubesPos[index].z + 6.4 + 28 * progress;
  });
}

//animation scene 3
let keyInterval;

function keyAnimation(progress) {
  if (!models.key) return;

  models.key.scale.set(
    Math.pow(progress, 2),
    Math.pow(progress, 2),
    Math.pow(progress, 2)
  );

  models.key.position.set(
    (4 * progress - 2) ** 2 - 4.7,
    2.2 - 2.1 * progress,
    5.6 * progress ** 3
  );
  if (progress < 1) {
    if (keyInterval) {
      clearInterval(keyInterval);
      keyInterval = null;
    }

    models.key.rotation.x = 3.25 - 2 * progress;
    models.key.rotation.y = -1.2 + 2 * progress;
  }

  if (progress >= 1 && !keyInterval) {
    keyInterval = setInterval(() => {
      models.key.rotation.z += 0.001;
    }, 10);
  }
}
function nextScene3(progress) {
  if (!models.key) return;
  models.key.material.opacity = 1 - progress;
}
let isThreeKeysAnimationDone = false;
let radius = 3;
let angle = 60;

function threeKeysAnimation(progress) {
  angle = 60 - 240 * progress;

  models.threeKeys.forEach((key, index) => {
    key.position.x = radius * Math.sin(((angle + index * 120) * PI) / 180);
    key.position.y = radius * Math.cos(((angle + index * 120) * PI) / 180);
    key.rotation.x = initThreeKeysRotation[index].x + 3 * progress;
    key.rotation.y = initThreeKeysRotation[index].y + 3 * progress;
  });

  if (progress <= 0.5) {
    radius = 3 + 5.5 * progress;
    models.threeKeys.forEach((key) => {
      key.scale.set(2 * progress, 2 * progress, 2 * progress);
      key.position.z = -4 + 5 * (2 * progress) ** 2;
    });
  }

  isThreeKeysAnimationDone = progress >= 1;
}

let isNextScene4Done = false;
function nextScene4(progress) {
  if (isThreeKeysAnimationDone) {
    radius = 5.75 + 6 * progress ** 2;
    angle = -180 - 120 * progress;
    models.threeKeys.forEach((key) => {
      key.material.opacity = 1 - progress;
    });
    models.threeKeys.forEach((key, index) => {
      key.position.x = radius * Math.sin(((angle + index * 120) * PI) / 180);
      key.position.y = radius * Math.cos(((angle + index * 120) * PI) / 180);
    });
  }
  isNextScene4Done = progress >= 1;
}
let isBuilderAnimationDone = false;
function builderAnimation(progress) {
  if (isNextScene4Done) {
    radius = 11.75 - 6 * progress ** 2;
    angle = -300 - 180 * progress;
    models.threeKeys.forEach((key, index) => {
      key.position.x = radius * Math.sin(((angle + index * 120) * PI) / 180);
      key.position.y = radius * Math.cos(((angle + index * 120) * PI) / 180);
      key.rotation.x = initThreeKeysRotation[index].x + 3 * progress;
      key.rotation.y = initThreeKeysRotation[index].y + 3 * progress;
      key.material.opacity = progress;
    });

    isBuilderAnimationDone = progress >= 1;
  }
}
function nextScene5(progress) {
  if (isBuilderAnimationDone) {
    models.threeKeys.forEach((key, index) => {
      radius = 5.75 + 3 * progress ** 2;
      angle = -480 - 120 * progress;
      key.position.x = radius * Math.sin(((angle + index * 120) * PI) / 180);
      key.position.y = radius * Math.cos(((angle + index * 120) * PI) / 180);
      key.material.opacity = 1 - progress ** 3;
    });
  }
}

// const cameraHelper = new CameraHelper(rig, controls, renderer.domElement)

/* const grid = new THREE.GridHelper(100, 50);
grid.position.set(0, -5, 0);
scene.add(grid); */

// background funtion
let geometry, velocities, accelerations;
let sprite = new THREE.TextureLoader().load("/img/star.png");
let starMaterial = new THREE.PointsMaterial({
  color: 0x101010,
  size: 0.6,
  map: sprite,
  opacity: 1,
  transparent: true,
});
const verticles = [];
velocities = [];
accelerations = 0.004;
geometry = new THREE.BufferGeometry();
for (let i = 0; i < 500; i++) {
  verticles.push(Math.random() * 400 - 200);
  verticles.push(Math.random() * 400 - 200);
  verticles.push(Math.random() * 200 - 100);
  velocities.push(0);
}

geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(verticles, 3)
);
const stars = new THREE.Points(geometry, starMaterial);
scene.add(stars);
const positionAttribute = geometry.getAttribute("position");

function animate(a = 1) {
  if (!velocities || !accelerations) return;
  for (let i = 0; i < 500; i++) {
    velocities[i] += a * accelerations;
    positionAttribute.array[i * 3 + 2] += a * velocities[i];
    if (positionAttribute.array[i * 3 + 2] > 100) {
      positionAttribute.array[i * 3 + 2] = -100;
      velocities[i] = 0;
    }
  }
  positionAttribute.needsUpdate = true;
}

/**
 * Animate
 */
const tick = (t) => {
  // Update controls
  // cameraHelper.update(t)
  renderer.render(scene, camera);
  if (!isWheeling) {
    animate();
  }
  if (rig.hasAnimation) {
  }

  controls.update(t);
  controls3dof.update(t);

  requestAnimationFrame(tick);
};

tick();
