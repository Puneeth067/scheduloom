import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, UserPlus } from 'lucide-react';
import { Teacher, DAYS } from '../types';

interface TeacherFormProps {
  onSubmit: (teacher: Omit<Teacher, 'id'>) => void;
}

interface DayConstraint {
  start: string;
  end: string;
}

interface FormValues {
  name: string;
  constraints: {
    [key: string]: DayConstraint;
  };
}

export default function TeacherForm({ onSubmit }: TeacherFormProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: '',
      constraints: DAYS.reduce((acc, day) => {
        acc[day] = { start: '', end: '' };
        return acc;
      }, {} as { [key: string]: DayConstraint })
    }
  });

  const onSubmitForm = (data: FormValues) => {
    const constraints = DAYS.reduce((acc, day) => {
      acc[day] = data.constraints[day]?.start && data.constraints[day]?.end
        ? { start: Number(data.constraints[day].start), end: Number(data.constraints[day].end) }
        : null;
      return acc;
    }, {} as Teacher['constraints']);

    onSubmit({ name: data.name, constraints });
    reset();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 shadow-xl border-t-4 border-t-emerald-500">
      <CardHeader className="border-b border-gray-100 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100">
            <UserPlus className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            Add New Teacher
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="teacherName" className="text-sm font-medium">
              Teacher Name
            </Label>
            <Input
              id="teacherName"
              className="w-full"
              placeholder="Enter teacher name"
              {...register('name', { required: true })}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock className="h-4 w-4" />
              <span>Available Time Slots</span>
            </div>
            
            <div className="grid gap-4">
              {DAYS.map((day) => (
                <div key={day} className="p-4 rounded-lg bg-gray-50">
                  <div className="flex flex-wrap gap-4 items-center">
                    <Label className="min-w-[100px] font-medium">
                      {day}
                    </Label>
                    <div className="flex flex-1 gap-3">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="Start Period"
                          min="1"
                          max="8"
                          className="w-full"
                          {...register(`constraints.${day}.start` as const)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="End Period"
                          min="1"
                          max="8"
                          className="w-full"
                          {...register(`constraints.${day}.end` as const)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
            Add Teacher
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}