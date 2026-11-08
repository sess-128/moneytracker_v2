import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export const Modal = ({ title, children, onClose, busy = false }: { title: string; children: ReactNode; onClose: () => void; busy?: boolean }) => {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    dialog.showModal()
    return () => dialog.close()
  }, [])
  return (
    <dialog ref={ref} className="app-dialog" aria-label={title} onCancel={event => { event.preventDefault(); if (!busy) onClose() }} onClick={event => { if (event.target === event.currentTarget && !busy) onClose() }}>
      <div className="p-6" onClick={event => event.stopPropagation()}>
        <div className="flex items-center justify-between gap-4 mb-6"><h2 className="text-base">{title}</h2><button type="button" aria-label="Закрыть" className="icon-action" disabled={busy} onClick={onClose}><X size={16} /></button></div>
        {children}
      </div>
    </dialog>
  )
}
