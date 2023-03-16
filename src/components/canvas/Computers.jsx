import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile }) => {
  const { nodes, animations } = useGLTF("./assistants-p1/test_character_idle.gltf");
  const { actions, ref } = useAnimations(animations);


const calculatePosition = (isMobile) => {
    if (isMobile) {
      // Position for mobile screens
      return [0, -1.5, -1.5];
    } else {
      // Position for larger screens
      return [2, -1.5, -2.5];
    }
  };
  

  useEffect(() => {
    if (actions && actions['Armature|mixamo.com|Layer0']) {
      actions['Armature|mixamo.com|Layer0'].play();
    }
  }, [actions]);

  return (
    <mesh ref={ref}>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[0, 50, 50]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={nodes.Armature}
        scale={0.03}
        position={calculatePosition(isMobile)}
        rotation={[1.6, 0, -1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='always'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
