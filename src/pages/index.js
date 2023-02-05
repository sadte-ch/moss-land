import styles from '@/styles/Home.module.css'

import React, { Suspense } from 'react'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Plane from '@/components/Plane'

export default function Home() {
  const images = importAll(require.context('@/assets', false, /\.(png|jpe?g|svg)$/))
  const slides = [0,2,4]
  let index = 4

  // const randomiseSlide = () => {
  //   let rand = Math.floor(Math.random() * slides.length)
  //   index = slides[rand]
  // }
  // randomiseSlide()

  return (
    <>
      <Canvas className={styles.canvas} concurrent="true">
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2,5,2]} intensity={1} />
        <Suspense fallback={null}>
          <Plane images={images} index={index} />
        </Suspense>
      </Canvas>
    </>
  )
}

function importAll(r) {
  return r.keys().map(r)
}
