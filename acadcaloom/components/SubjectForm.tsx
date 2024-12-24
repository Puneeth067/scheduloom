import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, BookOpen } from 'lucide-react';
import { Subject, Teacher, DAYS } from '../types';

interface SubjectFormProps {
  onSubmit: (subject: Omit<Subject, 'id' | 'color'>) => void;
  teachers: Teacher[];
}

export default function SubjectForm({ onSubmit, teachers }: SubjectFormProps) {
  const { register, control, handleSubmit, reset } = useForm<Omit<Subject, 'id' | 'color'>>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "constraints",
  });

  const onSubmitForm = (data: Omit<Subject, 'id' | 'color'>) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 shadow-xl border-t-4 border-t-blue-500">
      <CardHeader className="border-b border-gray-100 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Add New Subject
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="subjectName" className="text-sm font-semibold text-gray-700">
                Subject Name
              </Label>
              <Input
                id="subjectName"
                className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                placeholder="Enter subject name"
                {...register('name', { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjectTeacher" className="text-sm font-medium">
                Assigned Teacher
              </Label>
              <Select 
                onValueChange={(value) => register('teacher_id').onChange({ target: { value } })}
              >
                <SelectTrigger id="subjectTeacher" className="w-full">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Time Constraints</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ day: '', start: 1, end: 8 })}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Constraint
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 rounded-lg bg-gray-50">
                    <div className="flex flex-wrap gap-3 items-center">
                      <Select 
                        onValueChange={(value) => 
                          register(`constraints.${index}.day`).onChange({ target: { value } })
                        }
                        className="flex-1 min-w-[150px]"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className="flex gap-2 flex-1 min-w-[200px]">
                        <Input
                          type="number"
                          placeholder="Start Period"
                          min="1"
                          max="8"
                          className="w-24"
                          {...register(`constraints.${index}.start` as const, { valueAsNumber: true })}
                        />
                        <Input
                          type="number"
                          placeholder="End Period"
                          min="1"
                          max="8"
                          className="w-24"
                          {...register(`constraints.${index}.end` as const, { valueAsNumber: true })}
                        />
                      </div>

                      <Button 
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-9 w-9"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Add Subject
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}