import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Player } from "./Components/Player";
import {Debug, Physics} from "@react-three/cannon";
import { Ground } from "./Components/Ground";
import { PointerLockControls, Sky } from "@react-three/drei";

function App() {
  return (
    <div className="canvas-container">
      <Canvas>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <Physics gravity={[0, -30, 0]}>
          <Debug color="black" scale={1.1}>
            <Player />
            <Ground />
          </Debug>
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
