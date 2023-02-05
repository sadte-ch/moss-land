import { useState, useEffect } from 'react'
import { useTexture } from "@react-three/drei"

import frag from '@/shader/frag.js'
import vert from '@/shader/vert.js'

export default function Plane({ images, index }) {
  const props = useTexture({
    map: images[index].default.src,
    displacementMap: images[index+1].default.src,
  })

  return (
    <mesh>
      <planeGeometry attach="geometry" args={[5,5,300,300]} />
      <meshStandardMaterial {...props} displacementScale={1} />
    </mesh>
  )
}
