import * as THREE from 'three'

/** Volumetric, deforming optical shell. The approved artwork is its surface material. */
export function createCrystalCore() {
  const group = new THREE.Group()
  const timeUniform = { value: 0 }
  const atlas = new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}assets/celestial-crystal-core.png`)
  atlas.colorSpace = THREE.SRGBColorSpace
  atlas.anisotropy = 8
  const material = new THREE.MeshBasicMaterial({ map: atlas, toneMapped: false })
  material.onBeforeCompile = shader => {
    shader.uniforms.flowTime = timeUniform
    shader.vertexShader = 'uniform float flowTime; varying vec3 crystalPoint;\n' + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
      #include <begin_vertex>
      float radial = length(position.xy) / 1.72;
      float interior = 1.0 - smoothstep(.68,1.0,radial);
      // Real vertex motion: preserve the outline while curved interior surfaces flow.
      float angle = .045 * sin(radial*9.0-flowTime*.65)*interior;
      mat2 turn = mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
      transformed.xy = turn * transformed.xy;
      transformed.z += interior * (.055*sin(position.x*5.0+position.y*4.0-flowTime*.8));
      crystalPoint = transformed;
    `)
    shader.fragmentShader = 'uniform float flowTime; varying vec3 crystalPoint;\n' + shader.fragmentShader
    shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', `
      vec2 p = crystalPoint.xy;
      float r = length(p);
      float angle = atan(p.y,p.x);
      float stream = .5+.5*sin(angle*3.0+r*8.0-flowTime*.85);
      float fine = .5+.5*sin(angle*5.0-r*11.0+flowTime*.52);
      float edge = smoothstep(.15,.6,dot(diffuseColor.rgb,vec3(.2126,.7152,.0722)));
      float specular = pow(stream,12.0)*(.35+.65*fine)*edge;
      float nucleus = exp(-dot(p,p)*4.0);
      outgoingLight *= .90 + .12*stream;
      outgoingLight += specular*vec3(.22,.26,.30)
        + nucleus*(.5+.5*sin(flowTime*1.1))*vec3(.18,.105,.028);
      #include <opaque_fragment>
    `)
  }
  // A complete closed shell has side volume and depth-tested orbit intersections.
  const geometry = new THREE.SphereGeometry(1.72,160,112)
  const positions = geometry.attributes.position
  const uv = geometry.attributes.uv
  for (let i=0;i<positions.count;i++) {
    const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i)
    uv.setXY(i, x/3.64+.5, y/3.64+.5)
    positions.setZ(i,z*.62)
  }
  geometry.computeVertexNormals()
  const shell = new THREE.Mesh(geometry,material)
  group.add(shell)
  return {
    group,
    dispose() { atlas.dispose() },
    update(time: number) {
      timeUniform.value=time
      shell.rotation.y=Math.sin(time*.21)*.065
      shell.rotation.x=Math.sin(time*.17)*.045
      shell.rotation.z=Math.sin(time*.13)*.025
      shell.scale.setScalar(1+.009*Math.sin(time*.95))
    },
  }
}
