import { useEffect, useState } from 'react'

/** يعدّ من صفر لحد القيمة المطلوبة بحركة ناعمة (easeOutCubic). */
export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min((now - start) / duration, 1)
      setValue(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}