"use client"

import { useEffect, useMemo, useState } from "react"
import { useError } from "../mdd"

export function useSvg(filePath: string) {
  const { useFatalError } = useError()
  const [svg, setSvg] = useState<string>()

  useEffect(() => {
    async function fetchSvg() {
      try {
        const response = await fetch(filePath)
        if (!response.ok) throw response.text

        setSvg(await response.text())
      } catch (error: any) {
        useFatalError(`Cannot load SVG '${name}': ${error}`)
      }
    }
    filePath && fetchSvg()
  }, [filePath])

  const memoizedSvg = useMemo(() => svg, [svg])

  return { svg: memoizedSvg }
}
