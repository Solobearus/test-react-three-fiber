import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Physics, useBox, useSphere } from "@react-three/cannon";
import { useThree, useFrame, Canvas } from "@react-three/fiber";
import { PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import { useResource } from "react-three-fiber";

const SPEED = 5;
const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
};
const moveFieldByKey = (key) => keys[key];
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const usePlayerControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });
  useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  return movement;
};

const playerMovementGround = ({
  playerControls,
  api,
  ref,
  camera,
  velocity,
  currentPos,
}) => {
  const { forward, backward, left, right, jump } = playerControls;

  frontVector.set(0, 0, Number(backward) - Number(forward));
  sideVector.set(Number(left) - Number(right), 0, 0);

  direction
    .subVectors(frontVector, sideVector)
    .normalize()
    .multiplyScalar(SPEED)
    .applyEuler(camera.rotation);


  const newPos = new THREE.Vector3(0, 2, 10);
  newPos.applyEuler(camera.rotation)

  newPos.x += currentPos.current[0]
  newPos.y += currentPos.current[1]
  newPos.z += currentPos.current[2]

  camera.position.set(newPos.x,newPos.y,newPos.z);

  const cameraReorderedRotation = camera.rotation.reorder("YZX");
  console.log(cameraReorderedRotation)

  api.rotation.set(1,1,1);
  // api.rotation.set(camera.rotation.x,camera.rotation.y,camera.rotation.z);
  api.velocity.set(direction.x, velocity.current[1], direction.z);

  if (jump) api.velocity.set(velocity.current[0], 10, velocity.current[2]);
};

const playerMovementFly = ({ playerControls, api, camera, velocity }) => {
  const { forward, backward, left, right, jump } = playerControls;

  frontVector.set(0, 0, Number(backward) - Number(forward));
  sideVector.set(Number(left) - Number(right), 0, 0);
  direction
    .subVectors(frontVector, sideVector)
    .normalize()
    .multiplyScalar(SPEED)
    .applyEuler(camera.rotation);

  api.velocity.set(direction.x, velocity.current[1], direction.z);
  if (jump) api.velocity.set(velocity.current[0], 10, velocity.current[2]);
};

const useStateMachine = () => {
  const currentState = "onGround";

  if (currentState === "onGround") {
    return playerMovementGround;
  } else {
    return playerMovementFly;
  }
};

export const Player = (props) => {
  const [camera, setCamera] = useState();
  const [ref, api] = useBox(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 1, 0],
    angularFactor: [0, 1, 0],
    ...props,
  }));

  const currentPos = useRef([0, 0, 0]);
  const velocity = useRef([0, 0, 0]);

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
    api.position.subscribe((pos) => {
      currentPos.current = pos;
    });
  }, []);

  const playerControls = usePlayerControls();
  const currentStateFunction = useStateMachine();

  useFrame(() => {
    currentStateFunction({
      playerControls,
      api,
      ref,
      camera,
      velocity,
      currentPos,
    });
  });

  return (
    <>
      <group ref={ref} position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial />
        </mesh>
      </group>
      <PerspectiveCamera makeDefault position={[0, 2, 10]} ref={setCamera} />
      {camera && <PointerLockControls camera={camera} />}
    </>
  );
};
