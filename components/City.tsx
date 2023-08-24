import React, { FC, Suspense } from "react";

import {
  PerspectiveCamera,
  CameraControls,
  Environment,
  useGLTF,
} from "@react-three/drei";
import Building from "./Building";
import { IBuilding, useAppContext } from "@/contexts/AppContexts";

interface Props {
  onBuildingClick: (building: IBuilding | null) => void;
}
export const City: FC<Props> = ({ onBuildingClick }) => {
  const {
    cameraControlRef: cameraRef,
    resetCameraPosition,
    buildings,
  } = useAppContext();

  const floorObj = useGLTF("/buildings/FloorGrid.glb");

  function handleBuildingClick(building: IBuilding | null) {
    onBuildingClick(building);
  }

  return (
    <group>
      {/* Buildings */}
      {buildings.map((b, i) => (
        <BuildingContainer
          key={i}
          building={b}
          handleBuildingClick={handleBuildingClick}
        />
      ))}

      {/* Controls */}
      <PerspectiveCamera fov={40} makeDefault position={resetCameraPosition} />

      <CameraControls
        enabled
        makeDefault
        ref={cameraRef}
        maxDistance={200}
        minDistance={300}
        maxPolarAngle={Math.PI / 2.5}
      />

      <primitive object={floorObj.scene} position={[0, -1, 0]} />

      <ambientLight />
      <directionalLight position={[10, 50, 10]} />
      <Environment
        preset="apartment"
        near={1}
        far={1}
        resolution={256}
        blur={0.18}
        background
      />
    </group>
  );
};

interface IBuildingContainer {
  building: IBuilding;
  handleBuildingClick: (building: IBuilding) => void;
}
function BuildingContainer({
  building,
  handleBuildingClick,
}: IBuildingContainer) {
  const { selectedBuildingId } = useAppContext();

  return (
    <Suspense
      fallback={
        <Building
          building={building}
          url={`buildings/VeryLowPoli/${building.id}.glb`}
          onBuildingClick={() => handleBuildingClick(building)}
        />
      }
    >
      <Building
        building={building}
        url={`buildings/LowPoli/${building.id}.glb`}
        onBuildingClick={() => handleBuildingClick(building)}
      />
    </Suspense>
  );
  // return selectedBuildingId === building.id ? (
  //   <Suspense
  //     fallback={
  //       <Building
  //         building={building}
  //         url={`buildings/LowPoli/${building.id}.glb`}
  //         onBuildingClick={() => handleBuildingClick(building)}
  //       />
  //     }
  //   >
  //     <Building
  //       building={building}
  //       url={`buildings/HiPoli/${building.id}.glb`}
  //       onBuildingClick={() => handleBuildingClick(building)}
  //     />
  //   </Suspense>
  // ) : (
  //   <group>
  //     <Building
  //       building={building}
  //       url={`buildings/VeryLowPoli/${building.id}.glb`}
  //       onBuildingClick={() => handleBuildingClick(building)}
  //     />
  //   </group>
  // );
  // return selectedBuildingId === building.id && building.glb_url ? (
  //   <Suspense
  //     fallback={
  //       building.lowpoly_glb_url && (
  //         <Building
  //           building={building}
  //           url={building.lowpoly_glb_url}
  //           onBuildingClick={() => handleBuildingClick(building)}
  //         />
  //       )
  //     }
  //   >
  //     {building.glb_url && (
  //       <Building
  //         building={building}
  //         url={building.glb_url}
  //         onBuildingClick={() => handleBuildingClick(building)}
  //       />
  //     )}
  //   </Suspense>
  // ) : (
  //   building.lowpoly_glb_url && (
  //     <group>
  //       <Building
  //         building={building}
  //         url={building.lowpoly_glb_url}
  //         onBuildingClick={() => handleBuildingClick(building)}
  //       />
  //     </group>
  //   )
  // );
}
