import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import type { EquipmentFormData, EquipmentStatus, EquipmentType } from "@/types/equipment"
import { EQUIPMENT_STATUSES } from "@/types/equipment"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface EquipmentFormProps {
  /** Pre-filled data when editing; null/undefined for add mode */
  initialData?: EquipmentFormData | null
  /** Dynamic list of equipment types from the database */
  equipmentTypes: EquipmentType[]
  onSubmit: (data: EquipmentFormData) => void
  onCancel: () => void
}

interface FormErrors {
  name?: string
  typeId?: string
  status?: string
  lastCleanedDate?: string
}

export function EquipmentForm({
  initialData,
  equipmentTypes,
  onSubmit,
  onCancel,
}: EquipmentFormProps) {
  const isEditing = !!initialData

  const [name, setName] = useState(initialData?.name ?? "")
  const [typeId, setTypeId] = useState<string>(
    initialData?.typeId ? String(initialData.typeId) : ""
  )
  const [status, setStatus] = useState<EquipmentStatus | "">(initialData?.status ?? "")
  const [lastCleanedDate, setLastCleanedDate] = useState<Date | undefined>(
    initialData?.lastCleanedDate ? new Date(initialData.lastCleanedDate) : undefined
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Sync form when initialData changes (e.g., switching between edit targets)
  useEffect(() => {
    setName(initialData?.name ?? "")
    setTypeId(initialData?.typeId ? String(initialData.typeId) : "")
    setStatus(initialData?.status ?? "")
    setLastCleanedDate(
      initialData?.lastCleanedDate ? new Date(initialData.lastCleanedDate) : undefined
    )
    setErrors({})
  }, [initialData])

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = "Equipment name is required"
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!typeId) {
      newErrors.typeId = "Equipment type is required"
    }

    if (!status) {
      newErrors.status = "Status is required"
    }

    if (!isEditing) {
      if (!lastCleanedDate) {
        newErrors.lastCleanedDate = "Last cleaned date is required"
      } else if (lastCleanedDate > new Date()) {
        newErrors.lastCleanedDate = "Date cannot be in the future"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!validate()) return

    onSubmit({
      name: name.trim(),
      typeId: Number(typeId),
      status: status as EquipmentStatus,
      lastCleanedDate: lastCleanedDate ? format(lastCleanedDate, "yyyy-MM-dd") : "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="equipment-name">Name</Label>
        <Input
          id="equipment-name"
          placeholder="Enter equipment name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
          }}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Type – dynamic from database */}
      <div className="space-y-2">
        <Label htmlFor="equipment-type">Type</Label>
        <Select
          value={typeId}
          onValueChange={(val) => {
            setTypeId(val)
            if (errors.typeId) setErrors((prev) => ({ ...prev, typeId: undefined }))
          }}
        >
          <SelectTrigger id="equipment-type">
            <SelectValue placeholder="Select equipment type" />
          </SelectTrigger>
          <SelectContent>
            {equipmentTypes.map((t) => (
              <SelectItem key={t.id} value={String(t.id)}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.typeId && (
          <p className="text-sm text-destructive">{errors.typeId}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="equipment-status">Status</Label>
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val as EquipmentStatus)
            if (errors.status) setErrors((prev) => ({ ...prev, status: undefined }))
          }}
        >
          <SelectTrigger id="equipment-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {EQUIPMENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status}</p>
        )}
      </div>

      {/* Last Cleaned Date */}
      <div className="space-y-2">
        <Label>Last Cleaned Date</Label>
        {isEditing ? (
          <>
            <Button
              variant="outline"
              disabled
              className="w-full justify-start text-left font-normal opacity-60 cursor-not-allowed"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {lastCleanedDate ? format(lastCleanedDate, "PPP") : "—"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Last cleaned date can only be updated by logging maintenance.
            </p>
          </>
        ) : (
          <>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !lastCleanedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lastCleanedDate ? format(lastCleanedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={lastCleanedDate}
                  onSelect={(date) => {
                    setLastCleanedDate(date)
                    setCalendarOpen(false)
                    if (errors.lastCleanedDate)
                      setErrors((prev) => ({ ...prev, lastCleanedDate: undefined }))
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.lastCleanedDate && (
              <p className="text-sm text-destructive">{errors.lastCleanedDate}</p>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? "Update Equipment" : "Add Equipment"}</Button>
      </div>
    </form>
  )
}
