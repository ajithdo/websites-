---
name: react-three-fiber
description: Official React Three Fiber (R3F) v9 docs. Use when writing or changing React code that renders three.js through @react-three/fiber (scenes, hooks, pointer events, loading models or textures, performance, TypeScript, tests, v8-to-v9 migration), or when mounting an existing three.js object, such as an img2threejs model, in React.
---

# React Three Fiber docs

Snapshot of the official docs for `@react-three/fiber` 9.8.1 (pmndrs/react-three-fiber @ `db32547`,
MIT, see `LICENSE`). Each file under `docs/` covers one topic; read only the ones the task touches.

## Steps

1. **Match versions.** Read the project's `package.json`. R3F majors pair with React majors:
   `@react-three/fiber@9` with `react@19`, `@react-three/fiber@8` with `react@18`. These docs describe
   v9; on a v8 project, `docs/tutorials/v9-migration-guide.mdx` lists what differs.
2. **Read the docs for every API the change uses**, picked from the index below, then write the code.
3. **Check performance** of anything animated, interactive, or with many objects against
   `docs/advanced/pitfalls.mdx`; large scenes also get `docs/advanced/scaling-performance.mdx`.

## Mounting an existing three.js object

Plain three.js output (an img2threejs factory returns a `THREE.Group`) enters the scene as
`<primitive object={obj} />`. From `docs/API/objects.mdx`:

- Primitives skip R3F's automatic disposal: create the object once (`useMemo`) and dispose its
  geometries and materials yourself in an effect cleanup.
- A three.js object has one place in the scene graph; clone it to show it twice.

## Index

| File (under `docs/`) | Covers |
|---|---|
| `getting-started/introduction.mdx` | What R3F is, JSX-to-three.js mapping, ecosystem |
| `getting-started/installation.mdx` | Install commands; Vite, Next.js, no-build, React Native setups |
| `getting-started/your-first-scene.mdx` | Canvas, mesh, constructor args, lights, props, shortcuts |
| `getting-started/basic-example-sandpack/index.jsx` | Minimal runnable app: animated, clickable boxes |
| `getting-started/examples.mdx` | Showcase, game prototypes, basic examples |
| `getting-started/community-r3f-components.mdx` | Community components outside drei |
| `API/canvas.mdx` | `<Canvas>` props, defaults, error fallbacks, renderers, WebGPU, `createRoot` |
| `API/objects.mdx` | Declaring objects, args, set/attach, nested props, `primitive`, `extend`, disposal, uniforms |
| `API/hooks.mdx` | `useThree`, `useFrame` (render loop), `useLoader` (loaders, preloading, GLTF) |
| `API/events.mdx` | Pointer events, bubbling, pointer capture, event target and settings |
| `API/additional-exports.mdx` | `invalidate`, `advance`, `addEffect`, `createPortal`, `applyProps`, `act`, others |
| `API/typescript.mdx` | Typed refs, `ThreeElements`, extending elements, exported types |
| `API/testing.mdx` | Unit tests and interaction tests with the test renderer |
| `tutorials/basic-animations.mdx` | `useFrame` plus refs for animation |
| `tutorials/events-and-interaction.mdx` | Hover and click interaction |
| `tutorials/loading-models.mdx` | GLTF (and gltfjsx JSX components), OBJ, FBX, loading fallback |
| `tutorials/loading-textures.mdx` | `TextureLoader` with `useLoader`, `useTexture` |
| `tutorials/how-it-works.mdx` | Internals: object creation, attach, props, events, render loop |
| `tutorials/v9-migration-guide.mdx` | v9 and React 19: new features, fixes, TypeScript and testing changes |
| `advanced/pitfalls.mdx` | Performance mistakes and their fixes (setState in loops, fast state, and more) |
| `advanced/scaling-performance.mdx` | On-demand rendering, reuse, caching, instancing, LOD, regression |
