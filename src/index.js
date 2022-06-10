import { useEffect, useRef } from 'react'
import { useInterval } from 'usehooks-ts'

// by default, expect a positioned parent for the canvas
// img will render behind it
const IMG_STYLE = 'position: absolute; top: 0; left: 0; z-index: 0;'
const CANVAS_STYLE = 'position: absolute; top: 0; left: 0; z-index: 1;'

/**
 * Outputs an image from a canvas.
 * By default, the image renders behind the canvas on the z axis.
 * This behavior can be overridden with custom styles.
 *
 * @param {HTMLCanvasElement|String} canvas React ref/HTML element or string selector. If string, must be unique in dom and formatted as selector (#id, .class, [attr="val"], etc)
 * @param {String} imgClassname for styling output image, space separated.
 * @param {String} canvasClassName for adding .fs-exclude, etc., and styling, space separated.
 * @param {Object} canvasAttributes for adding data-private, etc
 * @param {String} fileType what img format to output. default, recommended: image/jpeg
 * @param {Number} quality 0-1. the compression quality. only applies to image/jpeg or image/webp. default: 0.5
 * @param {Number} interval ms. how often to update the image. default: 100
 * @returns {Function} function to be called any time the canvas is drawn on
 */
const useCanvasImage = ({
  canvas,
  imgClassname = '',
  canvasClassname = '',
  canvasAttributes = {},
  fileType = 'image/jpeg', // fullstory doesn't like png
  quality = 0.7,
  interval = null,
}) => {
  const canvasRef = useRef()
  const imgRef = useRef()

  const createImg = () => {
    // create image
    imgRef.current = new Image()

    // add classes to img
    if (imgClassname) imgRef.current.classList.add(...imgClassname.split(' '))

    // by default, img will be same size as canvas
    imgRef.current.style = IMG_STYLE
  }

  const updateCanvas = () => {
    // add attributes to canvas
    Object.keys(canvasAttributes).forEach(attr => {
      canvasRef.current.setAttribute(attr, canvasAttributes[attr])
    })

    // add classes to canvas
    if (canvasClassname)
      canvasRef.current.classList.add(...canvasClassname.split(' '))

    canvasRef.current.style = CANVAS_STYLE

    createImg()
    // insert img after canvas
    canvasRef.current.after(imgRef.current)
  }

  const createImgSrc = () => {
    requestAnimationFrame(() => {
      if (!canvasRef.current || !imgRef.current) return

      // generate new img src
      const dataUrl = canvasRef.current.toDataURL(fileType, quality)

      // set src on img
      imgRef.current.src = dataUrl
    })
  }

  useEffect(() => {
    let reselectTimeout

    const setCanvas = () => {
      if (typeof canvas === 'string') {
        // selector
        canvasRef.current = document.querySelector(canvas)
      } else if (canvas?.current instanceof HTMLCanvasElement) {
        // ref
        canvasRef.current = canvas.current
      } else if (canvas instanceof HTMLCanvasElement) {
        // canvas element
        canvasRef.current = canvas
      }

      if (canvasRef.current) {
        updateCanvas()
      } else {
        reselectTimeout = setTimeout(setCanvas, 100)
      }
    }

    setCanvas()

    // eslint-disable-next-line consistent-return
    return () => {
      if (reselectTimeout) clearTimeout(reselectTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // for interval-based update
  // passing `interval: null` disables
  // requires `preserveDrawingBuffer: true` on webgl context
  // don't use return function in this case
  useInterval(createImgSrc, interval)

  // function returned for explicit updates from component
  // ensure the return function isn't used in conjunction with intervals
  return interval === null || interval === false ? createImgSrc : null
}

export default useCanvasImage
