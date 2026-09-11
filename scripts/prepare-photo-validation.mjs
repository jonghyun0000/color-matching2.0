import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const dataset = 'ashraq/fashion-product-images-small'
const colors = ['Black', 'White', 'Blue', 'Navy Blue', 'Grey', 'Red', 'Green', 'Pink', 'Yellow', 'Beige']
const selected = []
const counts = Object.fromEntries(colors.map(c => [c, 0]))
const root = new URL('../.validation/', import.meta.url)
await mkdir(new URL('photos/', root), { recursive: true })
const get = async url => {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status}: ${url}`)
  return r
}
// Selection is fixed BEFORE seeing extraction results: first three eligible rows per label.
for (let offset = 0; offset < 2000 && selected.length < 30; offset += 100) {
  const endpoint = `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(dataset)}&config=default&split=train&offset=${offset}&length=100`
  const page = await (await get(endpoint)).json()
  for (const { row_idx, row } of page.rows) {
    if (row.masterCategory !== 'Apparel' || !['Topwear', 'Bottomwear'].includes(row.subCategory)) continue
    if (!(row.baseColour in counts) || counts[row.baseColour] >= 3) continue
    const bytes = Buffer.from(await (await get(row.image.src)).arrayBuffer())
    const file = `photos/${row.id}.jpg`
    await writeFile(new URL(file, root), bytes)
    selected.push({ id: row.id, row: row_idx, label: row.baseColour, title: row.productDisplayName,
      category: row.subCategory, width: row.image.width, height: row.image.height, file,
      sha256: createHash('sha256').update(bytes).digest('hex') })
    counts[row.baseColour]++
  }
  console.log(offset, selected.length, counts)
}
if (selected.length !== 30) throw new Error(`Expected 30 images, got ${selected.length}`)
await writeFile(new URL('manifest.json', root), JSON.stringify({
  dataset, source: `https://huggingface.co/datasets/${dataset}`,
  selection: 'First 3 Topwear/Bottomwear Apparel rows per label, ascending train row, search limit 2000.',
  fetchedAt: new Date().toISOString(), counts, samples: selected,
}, null, 2))
