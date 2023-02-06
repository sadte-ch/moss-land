import { useState, useEffect, useRef, useMemo } from 'react'
import { useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import frag from '@/shader/frag.js'
import vert from '@/shader/vert.js'

export default function Plane({ images, index, anim }) {
  const mesh = useRef()

  const uniforms = useMemo(
    () => ({
      texture1: { type: "t", value: null }, //image
      texture2: { type: "t", value: null }, //displacement
      scale: { type: "f", value: 1.0 },
      amplitude: { type: "f", value: 0.05 },
      frequency: { type: "f", value: 0.1 },
      speed: { type: "f", value: 0.0 },
      animation: { type: "b", value: true }
    }), []
  )

  const texture1 = useLoader(TextureLoader, images[index].default.src)
  const texture2 = useLoader(TextureLoader, images[index+1].default.src)

  useEffect(() => {
    uniforms["texture1"].value = texture1
    uniforms["texture2"].value = texture2
  }, [texture1])

  useEffect(() => {
    uniforms["animation"].value = anim
  }, [anim])

  useFrame((state) => {
    const { clock } = state
    uniforms["speed"].value = clock.getElapsedTime() * 1.5
  })

  return (
    <mesh ref={mesh}>
      <planeGeometry attach="geometry" args={[5,5,300,300]} />
      <shaderMaterial
        fragmentShader={frag}
        vertexShader={vert}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  )
}
