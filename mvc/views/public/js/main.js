import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const target = document.getElementById("canvas")
target.width = window.innerWidth
target.height = window.innerHeight

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, target.width / target.height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: target, alpha: true});
renderer.setSize(target.width, target.height);
// document.body.appendChild(renderer.domElement);

// Ajuste de tamanho na mudança de janela
window.addEventListener("resize", () => {
  camera.aspect = target.width / target.height;
  camera.updateProjectionMatrix();
  renderer.setSize(target.width, target.height);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3); 
directionalLight.position.set(1, 1, 1); 
scene.add(directionalLight);

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = false;
controls.update()
// Carregamento do modelo GLTF

let mixer;
let actions = [];

const gltfLoader = new GLTFLoader();
gltfLoader.load("../models/astronaut.glb", (gltf) => {
  gltf.scene.position.set(0, -1, 0);
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);

  // Carregar todas as animações disponíveis
  gltf.animations.forEach((clip, index) => {
    const action = mixer.clipAction(clip);
    actions.push(action);
    if (index === 3) action.play(); // Iniciar a primeira animação
  });
  

  mixer.addEventListener('finished', (e) => {
    console.log(e.action._clip.name)
    if (e.action._clip.name === 'CharacterArmature|HitReact') {
      actions.forEach(a => a.stop());
      actions[3].play(); // Reproduz a animação inicial
    }
  });
});

function crossFadeToNextAnimation(index = 3) {

    if(index !== 3)
    {
        actions[index].setLoop(THREE.LoopOnce); // Executa a animação uma vez
        actions[index].clampWhenFinished = true; // Para a animação no último quadro
        actions[index].play();
    }
    
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Função para atualizar a posição do mouse
function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function checkIntersections() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        crossFadeToNextAnimation(2)
    }
}
  
// Adiciona o ouvinte de evento
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('click', checkIntersections);


// Posição da câmera
camera.position.set(0, 3.5, 6); 

const clock = new THREE.Clock()

function animate(time) {
  renderer.render(scene, camera);
  const delta = clock.getDelta()
  controls.update();
  if (mixer) mixer.update(delta); 
}


renderer.setAnimationLoop(animate);
