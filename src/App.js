import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Player } from "./Components/Player";
import {Physics} from "@react-three/cannon";
import {Ground} from "./Components/Ground";
import {PointerLockControls, Sky} from "@react-three/drei";

function App() {
  return (
    <div className="canvas-container">
      <Canvas>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <Physics gravity={[0, -30, 0]}>
          <Player />
          <Ground />
        </Physics>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial />
        </mesh>
        <PointerLockControls />
      </Canvas>
    </div>
  );
}

export default App;
