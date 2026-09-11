import { test } from 'node:test'
import assert from 'node:assert/strict'
import { kmeans } from '../src/lib/color/kmeans'
import { recommendColors } from '../src/lib/color/recommend'
import { COLOR_DICTIONARY } from '../src/constants/colors'
import { MODES } from '../src/constants/modes'

test('단색 이미지가 클러스터 다섯 개를 요청해도 실패하지 않는다', () => {
  assert.deepEqual(kmeans(Array(100).fill({ r: 255, g: 255, b: 255 }), 5), [{center: {r:255,g:255,b:255}, count:100}])
})
test('두 가지 색은 실제 색 개수만 반환한다', () => {
  assert.equal(kmeans([{r:0,g:0,b:0}, {r:255,g:0,b:0}], 5).length, 2)
})
test('빈 이미지와 잘못된 클러스터 수는 빈 결과를 반환한다', () => {
  assert.deepEqual(kmeans([]), [])
  assert.deepEqual(kmeans([{r:0,g:0,b:0}], 0), [])
  assert.deepEqual(kmeans([{r:0,g:0,b:0}], NaN), [])
})
test('동일 픽셀 입력의 결과가 재실행해도 같다', () => {
  const pixels = Array.from({length:100}, (_,i) => ({r:i*2,g:i,b:255-i}))
  assert.deepEqual(kmeans(pixels), kmeans(pixels))
  assert.equal(kmeans(pixels).reduce((sum, c) => sum + c.count, 0), 100)
})
for (const mode of MODES) {
  test(`${mode.id}: 모든 등록 색에 대해 추천 개수·중복·점수·계열 제한을 지킨다`, () => {
    for (const color of COLOR_DICTIONARY) {
      const {recommendations} = recommendColors(color.hex, mode.id)
      assert.ok(recommendations.length > 0 && recommendations.length <= 5)
      assert.equal(new Set(recommendations.map(r => r.entryId)).size, recommendations.length)
      const counts: Record<string, number> = {}
      for (const rec of recommendations) {
        assert.ok(Number.isFinite(rec.score) && rec.score >= 35 && rec.score <= 100)
        assert.notEqual(rec.entryId, color.id)
        const family = COLOR_DICTIONARY.find(c => c.id === rec.entryId)!.family
        counts[family] = (counts[family] ?? 0) + 1
        assert.ok(counts[family] <= 2)
      }
    }
  })
}
