'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    tableau?: {
      Viz: new (
        containerDiv: HTMLElement,
        url: string,
        options?: Record<string, unknown>
      ) => void;
    };
  }
}

interface TableauEmbedProps {
  vizUrl: string
  aspectRatio?: number
  minHeight?: number
}

const TableauEmbed = ({
  vizUrl,
  aspectRatio = 0.75,
  minHeight = 600,
}: TableauEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const divElement = containerRef.current
    if (!divElement) return

    const vizElement = document.createElement('object')
    vizElement.className = 'tableauViz'
    vizElement.style.display = 'none'
    vizElement.style.width = '100%'
    vizElement.style.height = `${divElement.offsetWidth * aspectRatio}px`

    const paramNames = [
      'host_url', 'embed_code_version', 'site_root', 'name', 'tabs',
      'toolbar', 'static_image', 'animate_transition', 'display_static_image',
      'display_spinner', 'display_overlay', 'display_count', 'language'
    ]

    const paramValues = [
      'https%3A%2F%2Fpublic.tableau.com%2F', '3', '',
      vizUrl, 'no', 'yes',
      'https://public.tableau.com/static/images/NB/NBAPlayersasPCAScatterplot2024-2025regularseason/Sheet1/1.png',
      'yes', 'yes', 'yes', 'yes', 'yes', 'en-US'
    ]

    paramNames.forEach((name, index) => {
      const param = document.createElement('param')
      param.name = name
      param.value = paramValues[index]
      vizElement.appendChild(param)
    })

    divElement.appendChild(vizElement)
    vizElement.style.display = 'block'

    const scriptElement = document.createElement('script')
    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js'
    scriptElement.async = true

    scriptElement.onload = () => {
      console.log('[DEBUG] Tableau JS API loaded successfully')
      if (window.tableau && divElement) {
        new window.tableau.Viz(
          divElement,
          `https://public.tableau.com/views/${vizUrl}`,
          {
            hideTabs: true,
            width: '100%',
            height: `${divElement.offsetWidth * aspectRatio}px`
          }
        )
      } else {
        console.error('[DEBUG] window.tableau or container div is undefined')
      }
    }

    scriptElement.onerror = () => {
      console.error('[DEBUG] Failed to load Tableau JS API')
    }

    divElement.appendChild(scriptElement)

    return () => {
      divElement.innerHTML = '' // Clean up everything on unmount
    }
  }, [vizUrl, aspectRatio])

  return (
    <div
      ref={containerRef}
      className="tableauPlaceholder w-full"
      style={{ position: 'relative', minHeight: `${minHeight}px` }}
    >
      <noscript>
        <a href="#">
          <img
            alt="NBA Players visualization"
            src="https://public.tableau.com/static/images/NB/NBAPlayersasPCAScatterplot2024-2025regularseason/Sheet1/1_rss.png"
            style={{ border: 'none' }}
          />
        </a>
      </noscript>
    </div>
  )
}

export default TableauEmbed
