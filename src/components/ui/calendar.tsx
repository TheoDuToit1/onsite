import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'
import 'react-day-picker/dist/style.css'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-neutral-700 rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md',
        day_selected: 'bg-brand-orange text-white hover:brightness-95',
        day_today: 'bg-neutral-200 text-neutral-900',
        day_outside: 'text-neutral-400 opacity-50',
        day_disabled: 'text-neutral-400 opacity-50',
        day_range_middle: 'aria-selected:bg-neutral-200',
        day_hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
