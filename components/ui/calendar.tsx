"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [showYearPicker, setShowYearPicker] = React.useState(false)
  const yearPickerRef = React.useRef<HTMLDivElement>(null)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i)

  const handleYearSelect = (year: number, month: Date) => {
    const newDate = new Date(year, month.getMonth(), 1)
    if (props.onMonthChange) {
      props.onMonthChange(newDate)
    }
    setShowYearPicker(false)
  }

  // 點擊外部關閉年份選擇器
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target as Node)) {
        setShowYearPicker(false)
      }
    }

    if (showYearPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showYearPicker])

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white rounded-2xl shadow-lg border border-gray-100 font-noto-sans-tc", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "text-lg font-medium text-gray-800 font-noto-sans-tc cursor-pointer hover:text-[#D94A1D] transition-colors",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-8 w-8 bg-transparent border-0 p-0 hover:bg-transparent"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex mb-2",
        head_cell:
          "text-gray-600 rounded-md w-10 h-10 font-medium text-sm flex items-center justify-center font-noto-sans-tc",
        row: "flex w-full mt-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          "h-10 w-10 p-0 font-normal rounded-full transition-all duration-200 hover:bg-orange-50 font-noto-sans-tc flex items-center justify-center"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#D94A1D] text-white hover:bg-[#B8391A] hover:text-white focus:bg-[#D94A1D] focus:text-white shadow-md scale-105",
        day_today: "bg-orange-100 text-[#D94A1D] font-semibold border-2 border-[#D94A1D]",
        day_outside:
          "day-outside text-gray-400 aria-selected:bg-orange-50 aria-selected:text-gray-400",
        day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-orange-50 aria-selected:text-[#D94A1D]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-black" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-black" />,
        CaptionLabel: ({ displayMonth, ...props }) => {
          return (
            <div className="relative" ref={yearPickerRef}>
              <button
                type="button"
                className="text-lg font-medium text-gray-800 font-noto-sans-tc cursor-pointer hover:text-[#D94A1D] transition-colors"
                onClick={() => setShowYearPicker(!showYearPicker)}
              >
                {displayMonth.toLocaleDateString('zh-TW', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </button>
              
              {showYearPicker && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-1 p-2 w-64">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        className={cn(
                          "px-3 py-2 text-sm rounded-md hover:bg-orange-50 transition-colors font-noto-sans-tc",
                          year === displayMonth.getFullYear() && "bg-[#D94A1D] text-white hover:bg-[#B8391A]"
                        )}
                        onClick={() => handleYearSelect(year, displayMonth)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
