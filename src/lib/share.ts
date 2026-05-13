import html2canvas from 'html2canvas'

export async function captureAndShare(
  element: HTMLElement,
  filename: string,
  title: string,
  text: string
): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  })

  return new Promise<void>((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) { resolve(); return }
      const file = new File([blob], filename, { type: 'image/png' })
      if (
        typeof navigator.share === 'function' &&
        navigator.canShare?.({ files: [file] })
      ) {
        try {
          await navigator.share({ files: [file], title, text })
          resolve()
          return
        } catch {
          /* 사용자가 취소: fallback으로 떨어짐 */
        }
      }
      // fallback: 다운로드
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png')
  })
}
