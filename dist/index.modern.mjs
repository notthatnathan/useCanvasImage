import{useRef as t,useEffect as e}from"react";import{useInterval as r}from"usehooks-ts";const n=({canvas:n,imgClassname:s="",canvasClassname:u="",canvasAttributes:a={},fileType:c="image/jpeg",quality:o=.7,interval:l=null})=>{const i=t(),m=t(),f=()=>{requestAnimationFrame(()=>{if(!i.current||!m.current)return;const t=i.current.toDataURL(c,o);m.current.src=t})};return e(()=>{let t;const e=()=>{"string"==typeof n?i.current=document.querySelector(n):(null==n?void 0:n.current)instanceof HTMLCanvasElement?i.current=n.current:n instanceof HTMLCanvasElement&&(i.current=n),i.current?(Object.keys(a).forEach(t=>{i.current.setAttribute(t,a[t])}),u&&i.current.classList.add(...u.split(" ")),i.current.style="position: absolute; top: 0; left: 0; z-index: 1;",m.current=new Image,s&&m.current.classList.add(...s.split(" ")),m.current.style="position: absolute; top: 0; left: 0; z-index: 0;",i.current.after(m.current)):t=setTimeout(e,100)};return e(),()=>{t&&clearTimeout(t)}},[]),r(f,l),null===l||!1===l?f:null};export{n as default};
//# sourceMappingURL=index.modern.mjs.map