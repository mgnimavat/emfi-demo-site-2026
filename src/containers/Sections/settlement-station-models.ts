import * as THREE from 'three';

export type SettlementStationIcon = 'client' | 'bank' | 'pending' | 'complete';
type Owner = 'A' | 'B';
type ModelKey = `${SettlementStationIcon}-${Owner}`;

const getStationModelKey = (icon: SettlementStationIcon, owner: Owner = 'A'): ModelKey =>
  `${icon}-${icon === 'complete' ? 'B' : owner}`;

const renderSize = 160;
const palette = {
  A: '#345b87',
  B: '#316964',
  ivory: '#ebece8',
  stone: '#9ba7b0',
  ink: '#162741',
  glass: '#7798ac',
};
const footprints = {
  client: [1.72, 1.27],
  bank: [2.22, 1.92],
  pending: [1.46, 0.91],
  complete: [1.46, 0.91],
} as const;

const mesh = (
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  x: number,
  y: number,
  z: number,
) => {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x, y, z);
  group.add(object);
  return object;
};

const box = (
  group: THREE.Group,
  material: THREE.Material,
  size: [number, number, number],
  position: [number, number, number],
) => mesh(group, new THREE.BoxGeometry(...size), material, ...position);

const matte = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.88 });

const buildClient = (accent: THREE.Material) => {
  const group = new THREE.Group();
  const profile = [
    [0, 0], [0.58, 0], [0.63, 0.04], [0.63, 0.18], [0.58, 0.32],
    [0.47, 0.43], [0.29, 0.51], [0.18, 0.57], [0, 0.57],
  ].map(([radius, height]) => new THREE.Vector2(radius, height));
  const shoulders = mesh(group, new THREE.LatheGeometry(profile, 48), accent, 0, 0, 0);
  shoulders.scale.z = 0.68;
  mesh(group, new THREE.CylinderGeometry(0.15, 0.19, 0.23, 24), accent, 0, 0.63, 0);
  const head = mesh(group, new THREE.SphereGeometry(0.34, 40, 24), accent, 0, 0.96, 0.02);
  head.scale.set(0.88, 1.1, 0.92);
  return group;
};

const buildBank = (accent: THREE.Material, ivory: THREE.Material, stone: THREE.Material, glass: THREE.Material) => {
  const group = new THREE.Group();
  box(group, stone, [1.52, 0.09, 1.17], [0, 0.045, 0.05]);
  box(group, ivory, [1.24, 0.83, 0.86], [0, 0.52, -0.05]);
  box(group, stone, [0.62, 0.08, 0.2], [0, 0.12, 0.64]);
  box(group, ivory, [0.51, 0.08, 0.2], [0, 0.19, 0.54]);
  box(group, glass, [0.29, 0.5, 0.03], [0, 0.44, 0.39]);

  for (const x of [-0.49, -0.28, 0.28, 0.49]) {
    mesh(group, new THREE.CylinderGeometry(0.045, 0.055, 0.7, 16), ivory, x, 0.52, 0.49);
    box(group, ivory, [0.12, 0.055, 0.12], [x, 0.83, 0.49]);
    box(group, ivory, [0.13, 0.055, 0.13], [x, 0.19, 0.49]);
  }

  for (const z of [-0.28, 0.12]) {
    box(group, glass, [0.025, 0.34, 0.21], [0.624, 0.56, z]);
    box(group, stone, [0.045, 0.035, 0.25], [0.627, 0.375, z]);
  }

  const pediment = new THREE.Shape();
  pediment.moveTo(-0.73, 0.89);
  pediment.lineTo(0.73, 0.89);
  pediment.lineTo(0, 1.29);
  pediment.closePath();
  mesh(group, new THREE.ExtrudeGeometry(pediment, {
    depth: 1.05,
    bevelEnabled: false,
  }), accent, 0, 0, -0.52);
  box(group, ivory, [1.48, 0.09, 1.11], [0, 0.9, 0.015]);

  return group;
};

const dialDisk = (group: THREE.Group, material: THREE.Material, radius: number, depth: number, z: number) => {
  const disk = mesh(group, new THREE.CylinderGeometry(radius, radius, depth, 48), material, 0, 0.65, z);
  disk.rotation.x = Math.PI / 2;
};

const stroke = (
  group: THREE.Group,
  material: THREE.Material,
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
) => {
  const direction = end.clone().sub(start);
  const center = start.clone().lerp(end, 0.5);
  const segment = mesh(group, new THREE.CapsuleGeometry(radius, direction.length(), 6, 12),
    material, center.x, center.y, center.z);
  segment.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
};

const buildDelivery = (complete: boolean, accent: THREE.Material, ivory: THREE.Material, ink: THREE.Material) => {
  const group = new THREE.Group();
  dialDisk(group, accent, 0.62, 0.24, 0);
  if (complete) {
    const corner = new THREE.Vector3(-0.08, 0.52, 0.15);
    stroke(group, ivory, new THREE.Vector3(-0.29, 0.72, 0.15), corner, 0.069);
    stroke(group, ivory, corner, new THREE.Vector3(0.28, 0.9, 0.15), 0.069);
  } else {
    dialDisk(group, ivory, 0.51, 0.03, 0.125);
    const center = new THREE.Vector3(0, 0.65, 0.165);
    stroke(group, ink, center, new THREE.Vector3(-0.23, 0.81, 0.165), 0.036);
    stroke(group, ink, center, new THREE.Vector3(0.29, 0.91, 0.165), 0.029);
    for (let tick = 0; tick < 12; tick += 1) {
      const angle = tick * Math.PI / 6;
      const point = (radius: number) => new THREE.Vector3(
        radius * Math.sin(angle), 0.65 + radius * Math.cos(angle), 0.15,
      );
      stroke(group, ink, point(0.39), point(0.43), 0.016);
    }
  }
  group.rotation.y = -0.2;
  group.position.y = -0.03;
  return group;
};

const createContactShadow = () => {
  const size = 64;
  const image = document.createElement('canvas');
  image.width = image.height = size;
  const context = image.getContext('2d');
  if (!context) throw new Error('Could not create the settlement model shadow texture');

  const center = size / 2;
  const gradient = context.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, 'rgba(26, 43, 61, 0.45)');
  gradient.addColorStop(0.42, 'rgba(26, 43, 61, 0.32)');
  gradient.addColorStop(0.76, 'rgba(26, 43, 61, 0.1)');
  gradient.addColorStop(1, 'rgba(26, 43, 61, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(image);
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.PlaneGeometry();
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
  const shadow = new THREE.Mesh(geometry, material);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -0.01, -0.03);
  return shadow;
};

const buildStationModels = () => {
  const shadow = createContactShadow();
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(renderSize, renderSize, false);
  renderer.setClearAlpha(0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.06, 1.06, 1.06, -1.06, 0.1, 20);
  camera.position.set(3.1, 3.35, 5);
  camera.lookAt(0, 0.58, 0);
  scene.add(shadow, new THREE.HemisphereLight('#f7f9fc', '#87929b', 2.15));

  const key = new THREE.DirectionalLight('#fffaf3', 2.15);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight('#ebf3fb', 0.7);
  fill.position.set(4, 2, -4);
  scene.add(fill);

  const ivory = matte(palette.ivory);
  const stone = matte(palette.stone);
  const ink = matte(palette.ink);
  const glass = matte(palette.glass);
  const blue = matte(palette.A);
  const teal = matte(palette.B);
  const models = [
    ['client', 'A', buildClient(blue)],
    ['client', 'B', buildClient(teal)],
    ['bank', 'A', buildBank(blue, ivory, stone, glass)],
    ['bank', 'B', buildBank(teal, ivory, stone, glass)],
    ['pending', 'A', buildDelivery(false, blue, ivory, ink)],
    ['pending', 'B', buildDelivery(false, teal, ivory, ink)],
    ['complete', 'B', buildDelivery(true, teal, ivory, ink)],
  ] as const;
  const icons = new Map<ModelKey, HTMLCanvasElement>();

  try {
    models.forEach(([name, owner, model]) => {
      const icon = document.createElement('canvas');
      icon.width = icon.height = renderSize;
      const context = icon.getContext('2d');
      if (!context) return;
      const [width, depth] = footprints[name];
      shadow.scale.set(width, depth, 1);
      scene.add(model);
      renderer.render(scene, camera);
      context.drawImage(renderer.domElement, 0, 0);
      icons.set(getStationModelKey(name, owner), icon);
      scene.remove(model);
    });
  } finally {
    models.forEach(([, , model]) => model.traverse((object) => {
      if (object instanceof THREE.Mesh) object.geometry.dispose();
    }));
    [ivory, stone, ink, glass, blue, teal].forEach((material) => material.dispose());
    shadow.material.map?.dispose();
    shadow.material.dispose();
    shadow.geometry.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return icons;
};

let models: ReturnType<typeof buildStationModels> | undefined;

export const paintStationModel = (canvas: HTMLCanvasElement, icon: SettlementStationIcon, owner?: Owner) => {
  const context = canvas.getContext('2d');
  if (!context) return false;
  if (!models) {
    try {
      models = buildStationModels();
    } catch {
      models = new Map();
    }
  }
  const model = models.get(getStationModelKey(icon, owner));
  if (!model) return false;
  canvas.width = model.width;
  canvas.height = model.height;
  context.drawImage(model, 0, 0);
  return true;
};
