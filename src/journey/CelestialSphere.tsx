import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createCrystalCore } from './crystalCore'

/** Independent armillary scene; never changes the page's cosmic renderer. */
export function CelestialSphere() {
  const host = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = host.current
    if (!element) return
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }) }
    catch { return }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = .9
    element.appendChild(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 40)
    camera.position.set(0, .35, 9.8)
    camera.lookAt(0, 0, 0)
    const assembly = new THREE.Group()
    assembly.rotation.set(.15, -.2, -.24)
    const pointerRig = new THREE.Group()
    scene.add(pointerRig)
    pointerRig.add(assembly)
    // Broad studio reflections give glass a readable shape on the dark page.
    const studio = new THREE.Scene()
    studio.background = new THREE.Color('#101b2a')
    const softbox = (color: THREE.Color, w: number, h: number, x: number, y: number, z: number) => {
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }))
      panel.position.set(x, y, z); panel.lookAt(0, 0, 0); studio.add(panel)
    }
    softbox(new THREE.Color().setRGB(4, 4.3, 5), 3, 9, -5, 3, 4)
    softbox(new THREE.Color().setRGB(1.5, 2.7, 4), 2, 8, 5, 0, 1)
    softbox(new THREE.Color().setRGB(3, 2.3, 1.3), 4, 2, 0, 6, -2)
    softbox(new THREE.Color().setRGB(1.8, 2, 2.6), 1, 6, -2, -4, -3)
    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(studio, .04)
    scene.environment = environment.texture
    pmrem.dispose()
    studio.traverse(object => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); (object.material as THREE.Material).dispose() } })
    scene.add(new THREE.HemisphereLight(0xc0dfff, 0x020615, .6))
    const key = new THREE.DirectionalLight(0xffedcc, 1.4)
    key.position.set(-3, 5, 4); scene.add(key)
    const gold = new THREE.MeshPhysicalMaterial({ color: 0xd9bc77, emissive: 0x60401b, emissiveIntensity: .75, metalness: .85, roughness: .14, envMapIntensity: 1.65, clearcoat: 1 })
    const pale = new THREE.MeshPhysicalMaterial({ color: 0xc8e7f7, emissive: 0x739fbf, emissiveIntensity: .45, metalness: .9, roughness: .12, envMapIntensity: 1.4, clearcoat: 1 })
    // Low-opacity concentric shells soften the luminous edge without a full-screen bloom pass.
    const goldHalo = new THREE.MeshBasicMaterial({ color: 0xffd784, transparent: true, opacity: .07, blending: THREE.AdditiveBlending, depthWrite: false })
    const blueHalo = new THREE.MeshBasicMaterial({ color: 0xbce7ff, transparent: true, opacity: .07, blending: THREE.AdditiveBlending, depthWrite: false })
    const core = createCrystalCore()
    pointerRig.add(core.group)
    const ring = (parent: THREE.Group, radius: number, thickness: number, material: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, 16, 256), material)
      parent.add(mesh)
      const haloMaterial = material === gold ? goldHalo : blueHalo
      for (const spread of [1.8, 3.2]) {
        const halo = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness * spread, 8, 256), haloMaterial)
        mesh.add(halo)
      }
      return mesh
    }
    // The engraved zodiac rim is one inclined physical ring with front/back occlusion.
    const zodiac = new THREE.Group()
    zodiac.rotation.set(.24, -.25, .12)
    assembly.add(zodiac)
    const outerRims = [new THREE.Group(), new THREE.Group(), new THREE.Group()]
    outerRims.forEach(rim => zodiac.add(rim))
    ring(outerRims[0], 2.53, .011, pale)
    ring(outerRims[1], 2.48, .021, gold)
    ring(outerRims[2], 2.23, .012, gold)
    const tickGeometry = new THREE.BoxGeometry(.009, .065, .012)
    const ticks = new THREE.InstancedMesh(tickGeometry, gold, 120)
    const tickTransform = new THREE.Object3D()
    for (let i = 0; i < 120; i++) {
      const a = i / 120 * Math.PI * 2
      tickTransform.position.set(Math.sin(a) * 2.48, Math.cos(a) * 2.48, 0)
      tickTransform.rotation.z = -a
      tickTransform.scale.y = i % 10 === 0 ? 1.5 : .5
      tickTransform.updateMatrix(); ticks.setMatrixAt(i, tickTransform.matrix)
      ticks.setColorAt(i, new THREE.Color(i % 10 === 0 ? 0xffefc1 : 0xb9a57e))
    }
    outerRims[1].add(ticks)
    const orbits = [new THREE.Group(), new THREE.Group(), new THREE.Group()]
    const moons: THREE.Mesh[] = []
    orbits.forEach((orbit, i) => {
      orbit.rotation.set(.9 + i * .67, .3 + i * .8, i * .7)
      assembly.add(orbit)
      const crystalRing = ring(orbit, 1.77 + i * .16, .030, i === 1 ? pale : gold)
      crystalRing.scale.z = .65
      const moon = new THREE.Mesh(new THREE.SphereGeometry(i === 0 ? .085 : .06, 32, 24), gold)
      const bezel = new THREE.Mesh(new THREE.TorusGeometry(i === 0 ? .10 : .075, .003, 8, 48), gold)
      moon.add(bezel)
      orbit.add(moon); moons.push(moon)
    })
    let frame = 0, last = 0, elapsed = 0, visible = true
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reduced = () => media.matches || element.closest('[data-motion="reduced"]') !== null
    const pointerTarget = new THREE.Vector2()
    const pointerCurrent = new THREE.Vector2()
    const pointerVelocity = new THREE.Vector2()
    const pointerArea = element.closest<HTMLElement>('#top') ?? element
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || reduced()) return
      const rect = pointerArea.getBoundingClientRect()
      pointerTarget.set(
        THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1),
        THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1),
      )
    }
    const resetPointer = () => pointerTarget.set(0, 0)
    pointerArea.addEventListener('pointermove', onPointerMove, { passive: true })
    pointerArea.addEventListener('pointerleave', resetPointer)
    window.addEventListener('blur', resetPointer)
    const render = (now = 0) => {
      frame = 0
      if (!visible || document.hidden) { last = 0; return }
      const dt = last ? Math.min((now - last) / 1000, .05) : 0
      if (!reduced()) elapsed += dt
      if (reduced()) { pointerTarget.set(0, 0); pointerCurrent.set(0, 0); pointerVelocity.set(0, 0) }
      // Slightly underdamped spring: weight without jitter; small steps stay stable at 30 Hz.
      const steps = Math.max(1, Math.ceil(dt / .008))
      const step = dt / steps
      for (let i = 0; i < steps; i++) {
        pointerVelocity.x += ((pointerTarget.x-pointerCurrent.x)*48-pointerVelocity.x*12)*step
        pointerVelocity.y += ((pointerTarget.y-pointerCurrent.y)*48-pointerVelocity.y*12)*step
        pointerCurrent.addScaledVector(pointerVelocity, step)
      }
      pointerRig.position.set(pointerCurrent.x * .22, -pointerCurrent.y * .15 + Math.sin(elapsed * .42) * .025, 0)
      pointerRig.rotation.set(pointerCurrent.y * .12, pointerCurrent.x * .16, -pointerCurrent.x * .10)
      last = now
      // Pinterest Icosphere noise: independent gimbal axes around a stable centre.
      // The zodiac rim stays readable while the inner rings make full revolutions.
      // Alternating directions and independent tilts reveal the counter-rotation in depth.
      zodiac.rotation.x = .24 + Math.sin(elapsed * .11) * .08
      outerRims.forEach((rim, i) => {
        const direction = i % 2 === 0 ? 1 : -1
        rim.rotation.x = Math.sin(elapsed * .16 + i * .8) * .18
        rim.rotation.y = elapsed * direction * (.13 + i * .025)
        rim.rotation.z = elapsed * direction * (.045 + i * .012)
      })
      orbits.forEach((orbit, i) => {
        const direction = i % 2 ? -1 : 1
        orbit.rotation.x = .9 + i * .67 + elapsed * direction * (.19 + i * .035)
        orbit.rotation.y = .3 + i * .8 + Math.sin(elapsed * .16 + i) * .24 - Math.sin(i) * .24
        orbit.rotation.z = i * .7 + elapsed * direction * .065
        const a = elapsed * (.23 + i * .045) + i * 2
        moons[i].position.set(Math.cos(a) * (1.77 + i * .16), Math.sin(a) * (1.77 + i * .16), 0)
      })
      core.update(elapsed)
      renderer.render(scene, camera)
      if (!reduced()) frame = requestAnimationFrame(render)
    }
    const resume = () => { cancelAnimationFrame(frame); last = 0; render() }
    const resize = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); resume()
    })
    resize.observe(element)
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; resume() })
    observer.observe(element)
    media.addEventListener('change', resume)
    document.addEventListener('visibilitychange', resume)
    render()
    return () => {
      pointerArea.removeEventListener('pointermove', onPointerMove)
      pointerArea.removeEventListener('pointerleave', resetPointer)
      window.removeEventListener('blur', resetPointer)
      cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect()
      media.removeEventListener('change', resume); document.removeEventListener('visibilitychange', resume)
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite) {
          if (!(object instanceof THREE.Sprite)) geometries.add(object.geometry)
          const list = Array.isArray(object.material) ? object.material : [object.material]
          list.forEach(material => materials.add(material))
        }
      })
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose())
      core.dispose(); environment.dispose(); renderer.dispose(); renderer.domElement.remove()
    }
  }, [])
  return <div ref={host} className="eh-celestial-sphere" role="img" aria-label="Объёмная небесная сфера с вращающимися орбитами и сияющим кристаллическим ядром" />
}
