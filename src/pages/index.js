import styles from '@/styles/Home.module.css'

import { useRef, useEffect } from 'react';

import { main } from '@/shader/index'

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const inputRef = useRef(null)

  useEffect(() => {
    main(inputRef)
  }, [])

  return (
    <>
      <canvas className={styles.canvas} ref={inputRef}></canvas>
    </>
  )
}
