// components/TableauScriptLoader.tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function TableauScriptLoader() {
  useEffect(() => {
    // This will run after the script loads
    const initTableauViz = () => {
      const placeholders = document.querySelectorAll('.tableauPlaceholder')
      placeholders.forEach(divElement => {
        const vizElement = divElement.getElementsByTagName('object')[0]
        if (vizElement) {
          vizElement.style.width = '100%'
          vizElement.style.height = (divElement.clientWidth * 0.75) + 'px'
          vizElement.style.display = 'block'
        }
      })
    }

    // If script is already loaded, initialize immediately
    if (window.tableau) {
      initTableauViz()
    }
  }, [])

  return (
    <Script 
      src="https://public.tableau.com/javascripts/api/viz_v1.js"
      strategy="beforeInteractive"
      onLoad={() => {
        const event = new Event('tableauLoaded')
        window.dispatchEvent(event)
      }}
    />
  )
}