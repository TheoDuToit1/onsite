import { MouseEventHandler } from 'react'
import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  label?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
}

export default function BackButton({ label = 'Go Back', onClick, className = '' }: BackButtonProps) {
  const navigate = useNavigate()
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (onClick) {
      onClick(e)
      return
    }
    navigate(-1)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        "bg-brand-navy text-white text-center w-[156px] rounded-2xl h-[45px] " +
        "relative text-base font-semibold group shadow-soft border border-white/10 " +
        className
      }
    >
      <div className="bg-brand-orange text-white rounded-xl h-[40px] w-1/4 flex items-center justify-center absolute left-[3px] top-[1px] group-hover:w-[149px] z-10 duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="20px" width="20px">
          <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="currentColor"></path>
          <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="currentColor"></path>
        </svg>
      </div>
      <p className="translate-x-2">{label}</p>
    </button>
  )
}
