import { useState } from "react";
import { PanoramaView } from "@/components/PanoView";
import { LuMinusCircle, LuPlusCircle, LuXCircle } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { City } from "@/components/City";
import { Canvas } from "@react-three/fiber";
import { useAppContext } from "@/contexts/AppContexts";
import { useProgress } from "@react-three/drei";
import { Progress } from "@/components/ui/progress";
import { SelectionControl } from "@/components/SelectionControl";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  const { progress } = useProgress();
  const isLoaded = progress === 100;

  const [zoomedIn, setZoomedIn] = useState(false);
  const [showPano, setShowPano] = useState(false);

  const {
    selectedBuildingId,
    setSelectedBuildingId,
    selectedUnit,
    focusOn,
    cameraControlRef,
  } = useAppContext();

  function focusOnBuilding(buildingName: string) {
    try {
      setSelectedBuildingId(buildingName);
      focusOn(buildingName);
    } catch (error) {}
  }

  /**
   * The function zoomIn() zooms the camera to a factor of 2 and sets the zoomedIn state to true.
   */
  function zoomIn() {
    cameraControlRef?.current?.zoomTo(2, true);
    setZoomedIn(true);
  }

  /**
   * The function zoomOut resets the zoom level of the camera control and updates the zoomedIn state to
   * false.
   */
  function zoomOut() {
    cameraControlRef?.current?.zoomTo(1, true);
    setZoomedIn(false);
  }

  return (
    <main className={`flex h-screen flex-col items-center justify-between`}>
      <div className="relative w-full h-full bg-[#F1F1F3]">
        <Canvas className="w-full h-full" shadows={"basic"}>
          {
            <City
              onBuildingClick={(name) => {
                name && focusOnBuilding(name);
              }}
            />
          }
        </Canvas>

        {
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-end justify-end px-0 sm:bottom-5 sm:px-5 md:flex-row">
            <div className="relative flex flex-col w-full gap-3 h-fit">
              <SelectionControl openPano={() => setShowPano(true)} />
            </div>
          </div>
        }
      </div>
      {showPano && selectedUnit?.panoramaUrl && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center ">
          <div
            className="absolute top-0 bottom-0 left-0 right-0 bg-black/20"
            onClick={() => {
              setShowPano(false);
            }}
          ></div>

          <PanoramaView baseUrl={selectedUnit?.panoramaUrl}></PanoramaView>

          <Button
            onClick={() => {
              setShowPano(false);
            }}
            variant={"secondary"}
            className="absolute flex items-center justify-center w-10 h-10 p-0 rounded-lg bg-white/50 hover:bg-white/70 text-foreground hover:text-primary top-8 right-8"
          >
            <LuXCircle className="w-5 h-5 text-inherit" />
          </Button>
        </div>
      )}
      {/* Zoom Controls */}
      <div className="absolute flex flex-col justify-center my-auto rounded-full h-fit top-14 bottom-14 right-5">
        {!selectedBuildingId && (
          <div className="flex flex-col animate-in zoom-in duration-300 fade-in   p-0 rounded-full backdrop-blur-md bg-[#4A4640]/60">
            <Button
              className={`w-12 h-16 p-3 rounded-t-full shadow-none aspect-square bg-white/0 hover:bg-white/30 `}
              onClick={zoomIn}
              disabled={zoomedIn}
            >
              <LuPlusCircle className="w-full h-full" />
            </Button>
            <Button
              className={`w-12 h-16 p-3 rounded-b-full shadow-none aspect-square bg-white/0 hover:bg-white/30 `}
              onClick={zoomOut}
              disabled={!zoomedIn}
            >
              <LuMinusCircle className="w-full h-full" />
            </Button>
          </div>
        )}
      </div>

      <div className="absolute left-0 right-0 flex flex-col items-center justify-center gap-2 duration-300 top-6 animate-in zoom-in fade-in">
        <SearchBar />
        {!isLoaded && <LoaderUI progress={progress} />}
      </div>
    </main>
  );
}

function LoaderUI({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-xs bg-[#4A4640]/60 rounded-full gap-3 flex items-center p-2 px-4 mx-auto">
      <p className="text-white">Loading </p>
      <Progress className="w-full" value={progress} />
    </div>
  );
}
