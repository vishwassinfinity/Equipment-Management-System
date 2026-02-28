import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import type { MaintenanceLogFormData } from "@/types/equipment"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface MaintenanceLogFormProps {
  onSubmit: (data: MaintenanceLogFormData) => void
  onCancel: () => void
}

interface FormErrors {
  date?: string
  notes?: string
  performedBy?: string
}

export function MaintenanceLogForm({ onSubmit, onCancel }: MaintenanceLogFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [notes, setNotes] = useState("")
  const [performedBy, setPerformedBy] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [calendarOpen, setCalendarOpen] = useState(false)

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!date) {
      newErrors.date = "Maintenance date is required"
    } else if (date > new Date()) {
      newErrors.date = "Date cannot be in the future"
    }

    if (!notes.trim()) {
      newErrors.notes = "Notes are required"
    } else if (notes.trim().length < 3) {
      newErrors.notes = "Notes must be at least 3 characters"
    }

    if (!performedBy.trim()) {
      newErrors.performedBy = "Performed by is required"
    } else if (performedBy.trim().length < 2) {
      newErrors.performedBy = "Name must be at least 2 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      date: date ? format(date, "yyyy-MM-dd") : "",
      notes: notes.trim(),
      performedBy: performedBy.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Maintenance Date */}
      <div className="space-y-2">
        <Label>Maintenance Date</Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d)
                setCalendarOpen(false)
                if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
              }}
              disabled={(d) => d > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="maintenance-notes">Notes</Label>
        <Input
          id="maintenance-notes"
          placeholder="Describe the maintenance performed"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value)
            if (errors.notes) setErrors((prev) => ({ ...prev, notes: undefined }))
          }}
        />
        {errors.notes && (
          <p className="text-sm text-destructive">{errors.notes}</p>
        )}
      </div>

      {/* Performed By */}
      <div className="space-y-2">
        <Label htmlFor="performed-by">Performed By</Label>
        <Input
          id="performed-by"
          placeholder="Name of the person who performed maintenance"
          value={performedBy}
          onChange={(e) => {
            setPerformedBy(e.target.value)
            if (errors.performedBy) setErrors((prev) => ({ ...prev, performedBy: undefined }))
          }}
        />
        {errors.performedBy && (
          <p className="text-sm text-destructive">{errors.performedBy}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Log Maintenance</Button>
      </div>
    </form>
  )
}
