import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Timetable, Subject, Teacher, Class, DAYS, PERIODS_PER_DAY } from '../types';
import { BeakerIcon, XCircleIcon, Trash2Icon, Save, X } from 'lucide-react';
import { dataService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';

interface TimetableEditFormProps {
  timetable: Timetable;
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  onSave: (editedTimetable: Timetable) => void;
  onCancel: () => void;
  onDelete: (timetableId: string) => void;
}

export default function TimetableEditForm({ 
  timetable, 
  subjects, 
  teachers, 
  classes,
  onSave, 
  onCancel,
  onDelete 
}: TimetableEditFormProps) {
  const [editedTimetable, setEditedTimetable] = useState<Timetable>(timetable);

  // Initialize with existing timetable data
  useEffect(() => {
    setEditedTimetable(timetable);
  }, [timetable]);

  const handleSlotChange = (day: string, period: number, subject_id: string | null, is_lab: boolean) => {
    const updatedSlots = editedTimetable.slots.map(slot => {
      if (slot.day === day && slot.period === period) {
        return { ...slot, subject_id, is_lab };
      }
      return slot;
    });
    setEditedTimetable({ ...editedTimetable, slots: updatedSlots });
  };

  const getSlot = (day: string, period: number) => {
    return editedTimetable.slots.find(slot => slot.day === day && slot.period === period);
  };

  const removeSlot = (day: string, period: number) => {
    handleSlotChange(day, period, null, false);
  };

  const handleSave = async () => {
    try {
      // Save the timetable to the database
      await dataService.updateTimetable(editedTimetable.id, editedTimetable);
      onSave(editedTimetable);
      toast({
        title: "Success",
        description: "Timetable updated successfully",
      });
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast({
        title: "Error",
        description: "Failed to save timetable",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    try {
      await dataService.deleteTimetable(editedTimetable.id);
      onDelete(editedTimetable.id);
      toast({
        title: "Success",
        description: "Timetable deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting timetable:', error);
      toast({
        title: "Error",
        description: "Failed to delete timetable",
        variant: "destructive"
      });
    }
  };

  const isInterval = (period: number) => {
    return period === 2 || period === 4;
  };

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex flex-row justify-between ">
        <CardTitle className="text-2xl items-center font-bold">Edit Timetable - {classes.find(c => c.id === editedTimetable.class_id)?.name}</CardTitle>
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2Icon size={16} />
                Delete Timetable
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the timetable. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
                    const slot = getSlot(day, period);
                    if (slot?.is_interval) {
                      return (
                        <TableCell key={period} className="bg-gray-100 text-center text-sm text-gray-500">
                          Break Time
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={period} className="p-2">
                        <div className="space-y-2">
                          <Select
                            value={slot?.subject_id || "none"}
                            onValueChange={(value) => handleSlotChange(day, period, value === "none" ? null : value, slot?.is_lab || false)}
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
                              onClick={() => handleSlotChange(day, period, slot?.subject_id || null, !slot?.is_lab)}
                              variant="outline"
                              size="sm"
                              className={`flex items-center gap-1 ${
                                slot?.is_lab ? 'bg-purple-100 text-purple-700' : 'bg-white text-gray-700'
                              }`}
                            >
                              <BeakerIcon size={14} />
                              {slot?.is_lab ? 'Lab' : 'Set Lab'}
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
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}