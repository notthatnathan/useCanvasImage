# useCanvasImage

A React hook for automatically exporting a `canvas` to `img`.

- For session recording services like FullStory and LogRocket that are unable to record the contents of a `canvas` element, this provides a workaround. By default, the `img` is rendered directly behind the canvas.
  - A positioned parent element should wrap the canvas to ensure the `img` renders in the correct position.
  - If you have UI rendering above the canvas, you may need to make `z-index` tweaks to ensure the canvas stays behind the UI. By default, this hook sets the `img` to `z-index: 0` and the `canvas` to `z-index: 1`.
- Can provide a downloadable image of the current state of a `canvas`. Useful for drawing apps, meme generators, etc.

Note: FullStory adds a semi-transparent striped overlay in place of elements with `.fs-exclude`. While you can still see the `img` in session replays, it’s rendered with those stripes over it. We’re working with FullStory to provide a way to completely hide the element.

## 3rd party canvases
When using a canvas with a WebGL context that you don’t have direct access to manipulate (like three.js):

- Set the canvas to use `preserveDrawingBuffer: true`. (This can be passed to `THREE.WebGLRenderer` if using [three.js](https://github.com/mrdoob/three.js/blob/2d9a9f0b546aaf22dc0dcbfe56402bee075b9509/src/renderers/WebGLRenderer.js#L267).)
- Use the `interval` property to define how often the `img` is automatically updated.

Because we’re not able to insert our function directly into the drawing thread when using 3rd party apps that provide no such callback, we have to poll. This requires the drawing buffer to be preserved so we can read it in a later thread. This may result in a small performance hit due to the context switching from swap to copy. Depending on your use case, this may or may not be an issue.

---

## Examples

### Basic

Example use with FullStory’s `.fs-exclude` class.

```js
// in component that renders canvas
const canvasRef = useRef()
const updateImage = useCanvasImage({
  canvas: canvasRef,
  className: 'fs-exclude', // to hide from FullStory
})

useEffect(() => {
  // in this simple example, a change to someVar indicates the canvas has been updated
  updateImage()
}, [someVar])
```
```jsx
// JSX
<div style="position: relative">
  <canvas ref={canvasRef} />
</div>
```
```html
// html output
<div style="position: relative">
  <canvas class="fs-exclude" />
  <img />
</div>
```

### 3rd party

Example use with [@react-three/xr](https://github.com/pmndrs/react-xr).

```js
useCanvasImage({
  canvas: '[data-engine~="three.js"]',
  className: 'fs-exclude',
  interval: 100,
})
```
```jsx
// JSX, using VRCanvas from @react-three/xr
<div style="position: relative">
  <VRCanvas
    // passed to THREE.WebGLRenderer and then to the canvas context
    gl={{ preserveDrawingBuffer: true }}
  />
</div>
```
```html
// html output
<div style="position: relative">
  <canvas class="fs-exclude" />
  <img />
</div>
```

## Arguments
- `canvas` (React ref, string selector, or pre-selected HTML canvas element). If string, must be unique in dom and formatted as selector (#id, .class, [attr="val"], etc).
- `imgClassname` (string) for styling output image, space separated.
- `canvasClassName` (string) for adding `.fs-exclude` (FullStory) or other class names to the `img`, space separated.
- `canvasAttributes` (object) for adding `data-private` (LogRocket) or other attributes to the `canvas`.
- `fileType` (string, image/jpeg, image/png, image/webp) what img format to output. default, recommended for session recording: image/jpeg
- `quality` (number, 0-1). compression quality. only applies to image/jpeg or image/webp. default: 0.5
- `interval` (number or null/false, millisecond). how often to update the image. set to null to not update on an interval and to use the explicit function instead. when set to number, returned function becomes no-op and polling is used. default: null
- Returns: function to be called when the image should be updated (usually when the canvas is drawn to). no-op when an `interval` is specified.

## Contributing
Please do.
