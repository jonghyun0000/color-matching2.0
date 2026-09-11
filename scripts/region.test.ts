import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeRegion, regionFromPoints, FULL_IMAGE } from '../src/lib/color/region'
test('전체 사진 영역을 유지한다',()=>assert.deepEqual(normalizeRegion(FULL_IMAGE),FULL_IMAGE))
test('역방향 드래그도 같은 영역이다',()=>{
  const a={x:.2,y:.3},b={x:.8,y:.9}
  assert.deepEqual(regionFromPoints(a,b),regionFromPoints(b,a))
})
test('이미지 경계 밖과 최소 크기를 제한한다',()=>{
  for(const r of [{x:-1,y:3,width:5,height:0},{x:1,y:1,width:0,height:0}]) {
    const n=normalizeRegion(r)
    assert.ok(n.x>=0 && n.y>=0 && n.width>=.02 && n.height>=.02)
    assert.ok(n.x+n.width<=1 && n.y+n.height<=1)
  }
})
test('잘못된 좌표를 거부한다',()=>assert.throws(()=>normalizeRegion({...FULL_IMAGE,x:NaN})))
