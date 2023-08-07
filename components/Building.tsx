import { BuildingsPosition, useAppContext } from "@/contexts/AppContexts";
import { useGLTF } from "@react-three/drei";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Object3D, Vector3, Mesh } from "three";

interface IBuilding {
  url: string;
  name: string;
  onBuildingClick: (obj: Object3D) => void;
}

export default function Building({ url, onBuildingClick, name }: IBuilding) {
  const obj = useGLTF(url);

  const { addToBuildingList } = useAppContext();

  const update = useRef((b: BuildingsPosition) => addToBuildingList(b));

  const [hover, setHover] = useState(false);
  const meshRef = useRef<Mesh>(null!);

  useEffect(() => {
    update.current({
      name: name,
      position: obj.scene.children[0].position,
    });

    return () => {};
  }, [name, obj]);

  // rotation of the marker
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta;
    meshRef.current.rotation.x += delta;
    meshRef.current.rotation.z += delta;
  });

  function handleClick(event: ThreeEvent<MouseEvent>) {
    onBuildingClick(obj.scene.children[0]);
    event.stopPropagation();
  }

  return (
    <group
      onClick={(event) => handleClick(event)}
      onPointerOver={(event) => (event.stopPropagation(), setHover(true))}
      onPointerOut={(event) => (event.stopPropagation(), setHover(false))}
    >
      <mesh>
        <primitive object={obj.scene} />
      </mesh>
      {
        // position of the marker
        <mesh
          ref={meshRef}
          position={[
            obj.scene.children[0].position.x,
            obj.scene.children[0].position.y + 20,
            obj.scene.children[0].position.z - 4,
          ]}
        >
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color={hover ? "hotpink" : "orange"} />
        </mesh>
      }
    </group>
  );
}
