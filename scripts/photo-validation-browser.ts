import { extractColors } from '../src/lib/color/extract'
import { findNearestColor } from '../src/lib/color/name'

const expected: Record<string, string> = { Black:'black', White:'white', Blue:'blue', 'Navy Blue':'blue', Grey:'gray', Red:'red', Green:'green', Pink:'pink', Yellow:'yellow', Beige:'beige' }
const coarse = (family: string) => ['blue','denim','navy'].includes(family) ? 'blue' : family
const manifest = await (await fetch('/.validation/manifest.json')).json()
const records = []
for (const sample of manifest.samples) {
  let output: {hex:string;name:string;family:string}[] = [], error = ''
  try {
    output = (await extractColors(`/.validation/${sample.file}`, 5)).slice(0,3).map(c => ({
      hex:c.hex, name:c.name, family:coarse(findNearestColor(c.hex).family),
    }))
  } catch (e) { error = String(e) }
  const match1 = output[0]?.family === expected[sample.label]
  const match3 = output.some(c => c.family === expected[sample.label])
  records.push({ ...sample, expected:expected[sample.label], output, match1, match3, error })
  const card = document.createElement('article'); card.dataset.match = String(match3)
  const img = document.createElement('img'); img.src = `/.validation/${sample.file}`; img.alt = sample.title; card.append(img)
  const title = document.createElement('h2'); title.textContent = `${sample.id} · ${sample.label}`; card.append(title)
  const p = document.createElement('p'); p.textContent = sample.title; card.append(p)
  const swatches = document.createElement('div'); swatches.className = 'swatches'
  for (const color of output) {
    const swatch = document.createElement('div'); swatch.className = 'swatch'
    const chip = document.createElement('i'); chip.style.background = color.hex; swatch.append(chip)
    swatch.append(`${color.name} ${color.hex}`); swatches.append(swatch)
  }
  card.append(swatches)
  const verdict = document.createElement('p'); verdict.textContent = error || `1순위 ${match1 ? '일치':'불일치'} / 3개 내 ${match3 ? '일치':'불일치'}`; card.append(verdict)
  document.querySelector('#grid')!.append(card)
  document.querySelector('#summary')!.textContent = `${records.length}/30 분석 완료`
}
const result = { source:manifest.source, selection:manifest.selection, userAgent:navigator.userAgent,
  matching:'Catalog baseColour versus nearest dictionary family; blue/navy/denim merged; top3 exactly as shown in ExtractPage.',
  summary:{total:records.length,errors:records.filter(r=>r.error).length,top1:records.filter(r=>r.match1).length,top3:records.filter(r=>r.match3).length}, records }
document.querySelector('#summary')!.textContent = JSON.stringify(result.summary)
;(document.querySelector('#results') as HTMLTextAreaElement).value = JSON.stringify(result,null,2)
