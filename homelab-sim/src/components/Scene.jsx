import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import PCCase from './PCCase';

function Scene() {
  return (
    <Canvas camera={{ position: [8, 6, 8], fov: 50 }} shadows gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
      <Environment preset="city" background={false} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={20} blur={2.5} far={10} />
      <PCCase />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={20} enableDamping dampingFactor={0.05} />
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.9} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
export default Scene;
