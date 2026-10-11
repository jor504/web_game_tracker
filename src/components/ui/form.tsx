'use client'

import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'

const inputBase =
  'w-full px-4 py-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--line-strong)] text-fg placeholder:text-subtle focus:outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)] transition-all'

export function FormField({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
          {label}
          {required && <span className="text-[var(--accent)] ml-1">*</span>}
        </label>
        {hint && <span className="text-[11px] text-subtle italic">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className = '', ...props }, ref) {
    return <input ref={ref} className={`${inputBase} ${className}`} {...props} />
  }
)

export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputBase} resize-y min-h-24 ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={`${inputBase} appearance-none pr-10 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      <svg
        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </div>
  )
}

export function PrimaryButton({
  children,
  pending,
  className,
  type = 'submit',
}: {
  children: React.ReactNode
  pending?: boolean
  className?: string
  type?: 'submit' | 'button'
}) {
  return (
    <button
      type={type}
      disabled={pending}
      className={`group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-[var(--bg-base)] bg-[var(--accent)] hover:bg-[var(--accent-strong)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className ?? ''}`}
    >
      {pending && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12a9 9 0 1 1-9-9" />
        </svg>
      )}
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  className,
  type = 'button',
  href,
}: {
  children: React.ReactNode
  className?: string
  type?: 'submit' | 'button'
  href?: string
}) {
  const cls = `inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-semibold text-fg border border-[var(--line-strong)] hover:bg-[var(--surface-hover)] transition-colors ${className ?? ''}`
  if (href) {
    return <a href={href} className={cls}>{children}</a>
  }
  return <button type={type} className={cls}>{children}</button>
}

export function DangerButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-muted hover:text-[var(--color-rose-500)] hover:bg-[var(--bg-paper)] border border-[var(--line-strong)] hover:border-[var(--color-rose-500)]/30 transition-colors"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/>
      </svg>
      {children}
    </button>
  )
}