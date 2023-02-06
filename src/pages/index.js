import styles from '@/styles/Home.module.scss'

import React, { Suspense, useState } from 'react'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Plane from '@/components/Plane'

export default function Home() {
  const [index, setIndex] = useState(4)
  const [anim, setAnim] = useState(true)

  const images = importAll(require.context('@/assets', false, /\.(png|jpe?g|svg)$/))
  const slides = [4,0,2]

  const changeSlide = async (slide) => {
    setIndex(slide)
  }
  const toggleAnim = async (mode) => {
    setAnim(mode)
  }
  const clickHandler = async () => {
    setIntruction(false)
  }

  const buttons = (
    <div className={styles.buttons}>
      {slides.map((slide,i) =>
        <div key={slide} className={(styles.button) + (slide === index ? ` ${styles.current}` : '')} onClick={() => changeSlide(slide)}>moss {i+1}</div>
      )}
    </div>
  )
  const controls = (
    <div className={styles.controls}>
      animation
      <div className={styles.toggle}>
        <div className={(styles.tog) + (anim === true ? ` ${styles.current}` : '')} onClick={() => toggleAnim(true)}>on</div>
        <div className={(styles.tog) + (anim === false ? ` ${styles.current}` : '')} onClick={() => toggleAnim(false)}>off</div>
      </div>
    </div>
  )

  return (
    <>
      {buttons}
      {controls}

      <Canvas className={styles.canvas} concurrent="true">
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2,5,2]} intensity={1} />
        <Suspense fallback={null}>
          <Plane images={images} index={index} anim={anim} />
        </Suspense>
      </Canvas>
    </>
  )
}

function importAll(r) {
  return r.keys().map(r)
}
