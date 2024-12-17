import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Timetable, Subject, DAYS, PERIODS_PER_DAY } from '../types';
import { LabIcon } from './LabIcon';

interface TimetableEditFormProps {
  timetable: Timetable;
  subjects: Subject[];
  onSave: (editedTimetable: Timetable) => void;
  onCancel: () => void;
}

export default function TimetableEditForm({ timetable, subjects, onSave, onCancel }: TimetableEditFormProps) {
  const [editedTimetable, setEditedTimetable] = useState<Timetable>(timetable);

  const handleSlotChange = (day: string, period: number, subjectId: string | null, isLab: boolean) => {
    const updatedSlots = editedTimetable.slots.map(slot => {
      if (slot.day === day && slot.period === period) {
        return { ...slot, subjectId, isLab };
      }
      return slot;
    });
    setEditedTimetable({ ...editedTimetable, slots: updatedSlots });
  };

  const removeSlot = (day: string, period: number) => {
    handleSlotChange(day, period, null, false);
  };

  const isInterval = (period: number) => {
    return period === 2 || period === 4;
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Edit Timetable</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day / Period</TableHead>
            {Array.from({ length: PERIODS_PER_DAY }, (_, i) => (
              <TableHead key={i}>{i + 1}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {DAYS.map((day) => (
            <TableRow key={day}>
              <TableCell>{day}</TableCell>
              {Array.from({ length: PERIODS_PER_DAY }, (_, period) => {
                if (isInterval(period)) {
                  return <TableCell key={period} className="bg-gray-200">Interval</TableCell>;
                }
                const slot = editedTimetable.slots.find((s) => s.day === day && s.period === period);
                return (
                  <TableCell key={period}>
                    <Select
                      value={slot?.subjectId || ''}
                      onValueChange={(value) => handleSlotChange(day, period, value, slot?.isLab || false)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Empty</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {slot?.isLab && <LabIcon />}
                    <Button
                      onClick={() => handleSlotChange(day, period, slot?.subjectId || null, !slot?.isLab)}
                      variant="outline"
                      size="sm"
                      className="mt-1 mr-1"
                    >
                      {slot?.isLab ? 'Unset Lab' : 'Set Lab'}
                    </Button>
                    <Button
                      onClick={() => removeSlot(day, period)}
                      variant="outline"
                      size="sm"
                      className="mt-1"
                    >
                      Remove
                    </Button>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Button onClick={() => onSave(editedTimetable)} className="mr-2">Save</Button>
        <Button onClick={onCancel} variant="outline">Cancel</Button>
      </div>
    </div>
  );
}
