import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Outlines, Environment, useTexture } from "@react-three/drei"
import { Physics, useSphere } from "@react-three/cannon"
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing"
import { useControls } from "leva"
import logo from "../src/logo.png"
import logo2 from "../src/logo2.png"
import a1 from "../src/001.svg"
import a2 from "../src/002.png"
import a3 from "../src/003.png"
import copy from "../src/copy.svg"

// import Image from ''

const rfs = THREE.MathUtils.randFloatSpread
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const baubleMaterial = new THREE.MeshStandardMaterial({ color: "white", roughness: 0, envMapIntensity: 1 })

export const App = () => (
  <div className="contentItem">
    <Canvas shadows gl={{ antialias: false }} dpr={[1, 1.5]} camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}>
      <ambientLight intensity={0.5} />
      <color attach="background" args={["#dfdfdf"]} />
      <spotLight intensity={1} angle={0.2} penumbra={1} position={[30, 30, 30]} castShadow shadow-mapSize={[512, 512]} />
      <Physics gravity={[0, 2, 0]} iterations={10}>
        <Pointer />
        <Clump />
      </Physics>
      <Environment files="/adamsbridge.hdr" />
      <EffectComposer disableNormalPass multisampling={0}>
        <N8AO halfRes color="black" aoRadius={2} intensity={1} aoSamples={6} denoiseSamples={4} />
        <SMAA />
      </EffectComposer>
    </Canvas>
    {/* <div className="logo">
      <img className="logo" src={logo} />
      <img className="logo2" src={logo2} />
      <span>BASECAT</span>
    </div> */}
    {/* <div className="centerContent">
      <p className="titleContent">Official Contract Address:</p>
      <p className="titleContent2">0xe707b32cEec25992A513dbf06a88550692Be4daA</p>
      <a className="copy" onClick={copyText}>
        <img className="tipsImg" src={copy} />
      </a>
    </div> */}
    {/* <div className="bottomContent">
      <a href="https://t.me/+GRb_Hs1V8R5jMzIx">
        <img className="tipsImg" src={a1} />
        telegram
      </a>
      <a href="https://twitter.com/BASECAT_HQ">
        <img className="tipsImg" src={a2} />
        twitter
      </a>
      <a href="https://dexscreener.com/base/0xb619f0e61061a9c1c0dedc4cce6ea0ad3bd2cc74">
        <img className="tipsImg" src={a3} />
        dexscreener
      </a>
    </div> */}
  </div>
)

function Clump({ mat = new THREE.Matrix4(), vec = new THREE.Vector3(), ...props }) {
  const { outlines } = useControls({ outlines: { value: 0.0, step: 0.01, min: 0, max: 0.05 } })
  const texture = useTexture("/cross.jpg")
  const [ref, api] = useSphere(() => ({ args: [1], mass: 1, angularDamping: 0.1, linearDamping: 0.65, position: [rfs(20), rfs(20), rfs(20)] }))
  useFrame((state) => {
    for (let i = 0; i < 40; i++) {
      // Get current whereabouts of the instanced sphere
      ref.current.getMatrixAt(i, mat)
      // Normalize the position and multiply by a negative force.
      // This is enough to drive it towards the center-point.
      api.at(i).applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-40).toArray(), [0, 0, 0])
    }
  })
  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[sphereGeometry, baubleMaterial, 40]} material-map={texture}>
      <Outlines thickness={outlines} />
    </instancedMesh>
  )
}

function Pointer() {
  const viewport = useThree((state) => state.viewport)
  const [, api] = useSphere(() => ({ type: "Kinematic", args: [3], position: [0, 0, 0] }))
  return useFrame((state) => api.position.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0))
}

function copyText() {
  navigator.clipboard.writeText("0xe707b32cEec25992A513dbf06a88550692Be4daA")
  console.log("0xe707b32cEec25992A513dbf06a88550692Be4daA")
  alert("Copied!")
}
