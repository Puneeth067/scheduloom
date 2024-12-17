import * as XLSX from 'xlsx';
import { Subject, Teacher, Class, Timetable } from '../types';

export function parseExcelFile(file: File): Promise<{
    subjects: Subject[];
    teachers: Teacher[];
    classes: Class[];
    timetables: Timetable[];
}> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });

            const subjects: Subject[] = XLSX.utils.sheet_to_json(workbook.Sheets['Subjects']);
            const teachers: Teacher[] = XLSX.utils.sheet_to_json(workbook.Sheets['Teachers']);
            const classes: Class[] = XLSX.utils.sheet_to_json(workbook.Sheets['Classes']);
            const timetables: Timetable[] = XLSX.utils.sheet_to_json(workbook.Sheets['Timetables']);

            resolve({ subjects, teachers, classes, timetables });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
}
