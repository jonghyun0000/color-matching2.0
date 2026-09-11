import { useRef, useState } from 'react'
import { FULL_IMAGE, normalizeRegion, regionFromPoints, type ImageRegion } from '@/lib/color/region'

export default function GarmentRegionPicker({src, region, onChange, onReady}: {
  src: string; region: ImageRegion; onChange: (r:ImageRegion)=>void; onReady:(ready:boolean)=>void
}) {
  const start = useRef<{x:number;y:number}|null>(null)
  const [ratio, setRatio] = useState(1)
  const [failed, setFailed] = useState(false)
  const point = (e:React.PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect()
    return { x:Math.max(0,Math.min(1,(e.clientX-box.left)/box.width)), y:Math.max(0,Math.min(1,(e.clientY-box.top)/box.height)) }
  }
  return <section className="space-y-4">
    <div>
      <h2 className="text-lg font-bold text-brand">옷 부분만 골라주세요</h2>
      <p id="region-help" className="mt-1 text-sm text-gray-500">사진 위를 드래그해 영역을 그리세요. 배경과 피부는 최대한 빼주세요.</p>
    </div>
    <div className="relative overflow-hidden rounded-2xl bg-gray-100 select-none mx-auto" style={{touchAction:'none',width:`min(100%, ${48*ratio}vh)`}}
      aria-describedby="region-help"
      onPointerDown={e=>{if(e.button!==0)return; start.current=point(e);e.currentTarget.setPointerCapture(e.pointerId)}}
      onPointerMove={e=>{if(start.current)onChange(regionFromPoints(start.current,point(e)))}}
      onPointerUp={e=>{if(start.current){const end=point(e);if(Math.abs(end.x-start.current.x)+Math.abs(end.y-start.current.y)>.01)onChange(regionFromPoints(start.current,end));start.current=null}}}
      onPointerCancel={()=>{start.current=null}} onLostPointerCapture={()=>{start.current=null}}>
      <img src={src} alt="영역을 선택할 원본 옷 사진" draggable={false} className="block w-full h-auto"
        onLoad={e=>{setRatio(e.currentTarget.naturalWidth/e.currentTarget.naturalHeight);onReady(true)}}
        onError={()=>{setFailed(true);onReady(false)}} />
      {!failed && <div className="absolute border-2 border-white pointer-events-none" style={{left:`${region.x*100}%`,top:`${region.y*100}%`,width:`${region.width*100}%`,height:`${region.height*100}%`,boxShadow:'0 0 0 9999px rgb(11 31 58 / 55%)'}}>
        <span className="absolute top-0 left-0 bg-brand text-white text-[10px] px-2 py-1">분석 영역</span>
      </div>}
    </div>
    {failed ? <p role="alert" className="text-sm text-rose-700">사진을 표시하지 못했어요. 다른 사진을 선택해 주세요.</p> : <>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">슬라이더로도 위치와 크기를 조절할 수 있어요.</p>
        <button className="text-xs font-semibold text-brand shrink-0 p-2" onClick={()=>onChange({...FULL_IMAGE})}>전체 선택</button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {([['x','가로 위치'],['y','세로 위치'],['width','너비'],['height','높이']] as const).map(([key,label])=>
          <label key={key} className="text-xs text-gray-600">{label} <span className="text-gray-400">{Math.round(region[key]*100)}%</span>
            <input type="range" className="block w-full h-8 accent-brand" min={key==='x'||key==='y'?0:2}
              max={key==='x'?Math.round((1-region.width)*100):key==='y'?Math.round((1-region.height)*100):key==='width'?Math.round((1-region.x)*100):Math.round((1-region.y)*100)}
              value={Math.round(region[key]*100)} onChange={e=>onChange(normalizeRegion({...region,[key]:Number(e.target.value)/100}))} />
          </label>)}
      </div>
      <div className="rounded-2xl border border-gray-200 p-3 flex items-center gap-4">
        <svg viewBox={`${region.x*100*ratio} ${region.y*100} ${region.width*100*ratio} ${region.height*100}`} role="img" aria-label="선택한 옷 영역 미리보기"
          className="rounded-lg bg-gray-100" style={{width:80,height:80}} preserveAspectRatio="xMidYMid meet">
          <image href={src} width={100*ratio} height="100" preserveAspectRatio="none" />
        </svg>
        <div className="flex-1"><p className="text-sm font-semibold text-brand">선택 영역 미리보기</p><p className="mt-1 text-xs text-gray-500">선택한 부분 전체에서 색을 추출해요.</p></div>
      </div>
    </>}
  </section>
}
