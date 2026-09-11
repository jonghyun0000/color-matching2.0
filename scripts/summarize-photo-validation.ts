import { readFile, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { findNearestColor } from '../src/lib/color/name'

const manifest = JSON.parse(await readFile('.validation/manifest.json', 'utf8'))
const baseline = JSON.parse(await readFile('docs/validation/browser-baseline-2026-09-12.json', 'utf8'))
const expected: Record<string, string> = { Black:'black',White:'white',Blue:'blue','Navy Blue':'blue',Grey:'gray',Red:'red',Green:'green',Pink:'pink',Yellow:'yellow',Beige:'beige' }
const coarse = (f: string) => ['navy','denim','blue'].includes(f) ? 'blue' : f
const records = baseline.rows.map(([id,...hexes]: [number,...string[]]) => {
  const sample = manifest.samples.find((s: {id:number}) => s.id === id)
  assert.ok(sample)
  const output = hexes.map(hex => { const named = findNearestColor(hex); return {hex,name:named.name,family:coarse(named.family)} })
  return {id,row:sample.row,label:sample.label,category:sample.category,width:sample.width,height:sample.height,sha256:sample.sha256,
    output,match1:output[0].family===expected[sample.label],match3:output.some(c=>c.family===expected[sample.label])}
})
const summary = {total:records.length,top1:records.filter((r:any)=>r.match1).length,top3:records.filter((r:any)=>r.match3).length}
// Ensure this reconstruction agrees with the browser's observed summary.
assert.deepEqual(summary,{total:30,top1:12,top3:19})
const byLabel = Object.keys(expected).map(label=>({label,total:3,
  top1:records.filter((r:any)=>r.label===label&&r.match1).length,
  top3:records.filter((r:any)=>r.label===label&&r.match3).length}))
const data = {baseCommit:baseline.baseCommit,source:baseline.source,selection:manifest.selection,browser:baseline.browser,
  summary,byLabel,records}
await writeFile('docs/validation/results-2026-09-12.json', JSON.stringify(data,null,2)+'\n')
console.log(JSON.stringify({summary,byLabel},null,2))
