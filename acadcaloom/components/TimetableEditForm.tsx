import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timetable, Subject, DAYS, PERIODS_PER_DAY } from '../types';
import { BeakerIcon, XCircleIcon } from 'lucide-react';

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
    <Card className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <CardTitle className="text-2xl font-bold">Edit Timetable</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Day / Period</TableHead>
                {Array.from({ length: PERIODS_PER_DAY }, (_, i) => (
                  <TableHead key={i} className="font-semibold text-gray-700 text-center">
                    {i + 1}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {DAYS.map((day) => (
                <TableRow key={day} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-700">{day}</TableCell>
                  {Array.from({ length: PERIODS_PER_DAY }, (_, period) => {
                    if (isInterval(period)) {
                      return (
                        <TableCell key={period} className="bg-gray-100 text-center text-sm text-gray-500">
                          Break Time
                        </TableCell>
                      );
                    }
                    const slot = editedTimetable.slots.find((s) => s.day === day && s.period === period);
                    return (
                      <TableCell key={period} className="p-2">
                        <div className="space-y-2">
                          <Select
                            value={slot?.subjectId || "none"}
                            onValueChange={(value) => handleSlotChange(day, period, value === "none" ? null : value, slot?.isLab || false)}
                          >
                            <SelectTrigger className="w-full bg-white border border-gray-200 hover:border-blue-500 transition-colors">
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Empty</SelectItem>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                  {subject.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleSlotChange(day, period, slot?.subjectId || null, !slot?.isLab)}
                              variant="outline"
                              size="sm"
                              className={`flex items-center gap-1 ${
                                slot?.isLab ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'
                              }`}
                            >
                              <BeakerIcon size={14} />
                              {slot?.isLab ? 'Lab' : 'Set Lab'}
                            </Button>
                            <Button
                              onClick={() => removeSlot(day, period)}
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-red-600 hover:bg-red-50"
                            >
                              <XCircleIcon size={14} />
                              Clear
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex gap-4">
          <Button
            onClick={() => onSave(editedTimetable)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            Save Changes
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}