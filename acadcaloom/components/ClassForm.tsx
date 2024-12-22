import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Book, Beaker, X, GraduationCap } from 'lucide-react';
import { Class, Subject } from '../types';

interface ClassFormProps {
  onSubmit: (classData: Omit<Class, 'id'>) => void;
  subjects: Subject[];
}

export default function ClassForm({ onSubmit, subjects }: ClassFormProps) {
  const { register, handleSubmit, reset } = useForm<Omit<Class, 'id'>>();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [labs, setLabs] = useState<{ subjectId: string; duration: number }[]>([]);

  const onSubmitForm = (data: Omit<Class, 'id'>) => {
    onSubmit({ ...data, subjects: selectedSubjects, labs });
    reset();
    setSelectedSubjects([]);
    setLabs([]);
  };

  const addLab = (subjectId: string, duration: number) => {
    setLabs([...labs, { subjectId, duration }]);
  };

  const removeSubject = (subjectId: string) => {
    setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    setLabs(labs.filter(lab => lab.subjectId !== subjectId));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 shadow-xl border-t-4 border-t-purple-500">
      <CardHeader className="border-b border-gray-100 bg-white/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <GraduationCap className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Add New Class
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="className" className="text-sm font-semibold text-gray-700">
              Class Name
            </Label>
            <Input
              id="className"
              className="w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
              placeholder="Enter class name"
              {...register('name', { required: true })}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-semibold text-gray-700">Subjects</Label>
            <Select
              onValueChange={(value) => {
                if (!selectedSubjects.includes(value)) {
                  setSelectedSubjects([...selectedSubjects, value]);
                }
              }}
            >
              <SelectTrigger className="w-full border-gray-200 focus:border-purple-500">
                <SelectValue placeholder="Select subjects to add" />
              </SelectTrigger>
              <SelectContent>
                {subjects
                  .filter(subject => !selectedSubjects.includes(subject.id))
                  .map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <div className="space-y-3">
              {selectedSubjects.map((subjectId) => {
                const subject = subjects.find((s) => s.id === subjectId);
                const hasLab = labs.some(lab => lab.subjectId === subjectId);
                
                return (
                  <div key={subjectId} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-gray-700">{subject?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!hasLab && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addLab(subjectId, 2)}
                            className="h-8 border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            <Beaker className="h-4 w-4 mr-2" />
                            Add Lab
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSubject(subjectId)}
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {hasLab && (
                      <div className="mt-2 pl-6 flex items-center gap-2 text-sm text-purple-600 bg-purple-50 p-2 rounded-lg">
                        <Beaker className="h-4 w-4" />
                        <span>Lab Session Added (2 periods)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedSubjects.length === 0 && (
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                No subjects added yet
              </div>
            )}
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            Create Class
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}