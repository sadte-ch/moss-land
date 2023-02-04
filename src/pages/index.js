import styles from '@/styles/Home.module.css'

import { useRef, useEffect } from 'react';

import { main } from '@/shader/index'

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const inputRef = useRef(null)
  const images = ['mosss-dpt_swin2_large_384.png', 'mosi-dpt_swin2_large_384.png']

  useEffect(() => {
    main(inputRef, `/${images[0]}`)
  }, [])

  return (
    <>
      <canvas className={styles.canvas} ref={inputRef}></canvas>
    </>
  )
}
