import { Document, Paragraph, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, TextRun, convertInchesToTwip } from 'docx';
import { Subject, Teacher, Class, Room, Timetable, DAYS, PERIODS_PER_DAY } from '../types';

interface GenerateTimetableDocxParams {
  timetable: Timetable;
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  rooms: Room[];
}

export const generateTimetableDocx = ({
  timetable,
  subjects,
  teachers,
  classes,
  rooms,
}: GenerateTimetableDocxParams): Document => {
  const currentClass = classes.find(c => c.id === timetable.class_id);
  const roomInfo = currentClass ? rooms.find(r => r.id === currentClass.room_id) : null;

  // Helper functions
  const getSubjectName = (subject_id: string | null) => {
    if (!subject_id) return '';
    const subject = subjects.find(s => s.id === subject_id);
    return subject ? subject.name : '';
  };

  const getTeacherName = (subject_id: string | null) => {
    if (!subject_id) return '';
    const subject = subjects.find(s => s.id === subject_id);
    if (!subject) return '';
    const teacher = teachers.find(t => t.id === subject.teacher_id);
    return teacher ? teacher.name : '';
  };

  // Enhanced styling constants with a modern color scheme
  const COLORS = {
    primary: '2563EB', // Bright blue
    secondary: 'F1F5F9', // Lighter gray
    highlight: 'F8FAFC', // Very light gray
    intervalBg: 'DBEAFE', // Light blue for break time
    headerBg: '1E40AF', // Deep blue for header
    headerText: 'FFFFFF', // White for header text
    textPrimary: '1E293B', // Dark gray for primary text
    textSecondary: '64748B', // Medium gray for secondary text
  };

  // Create header with single title and enhanced styling
  const headerParagraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
        before: 400,
      },
      children: [
        new TextRun({
          text: "Class Timetable",
          size: 44,
          bold: true,
          color: COLORS.primary,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Class: ${currentClass?.name || ''}`,
          bold: true,
          size: 32,
          color: COLORS.textPrimary,
        }),
      ],
      spacing: {
        after: 200,
      },
    }),
  ];

  if (roomInfo) {
    headerParagraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Room: ${roomInfo.name} | Building: ${roomInfo.building} | Floor: ${roomInfo.floor}`,
            size: 24,
            color: COLORS.textSecondary,
          }),
        ],
        spacing: {
          after: 400,
        },
      })
    );
  }

  // Function to adjust text size based on content length
  const getAdjustedSize = (text: string, baseSize: number) => {
    if (text.length > 30) return baseSize - 4;
    if (text.length > 20) return baseSize - 2;
    return baseSize;
  };

  // Enhanced table cell factory
  const createTableCell = (options: {
    width: { size: number; type: "auto" | "dxa" | "nil" | "pct" };
    text?: string;
    textSize?: number;
    isHeader?: boolean;
    isBreak?: boolean;
    customChildren?: Paragraph[];
  }) => {
    const { width, text, textSize, isHeader, isBreak, customChildren } = options;

    const children = customChildren || [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: text ? [
          new TextRun({
            text,
            size: getAdjustedSize(text, textSize || 24),
            bold: isHeader,
            color: isHeader ? COLORS.headerText : COLORS.textPrimary,
          }),
        ] : [],
      }),
    ];

    return new TableCell({
      width,
      margins: {
        top: convertInchesToTwip(0.1),
        bottom: convertInchesToTwip(0.1),
        left: convertInchesToTwip(0.1),
        right: convertInchesToTwip(0.1),
      },
      shading: {
        fill: isHeader ? COLORS.headerBg : isBreak ? COLORS.intervalBg : COLORS.highlight,
      },
      children,
    });
  };

  // Create table rows with enhanced styling
  const tableRows = [
    // Header row
    new TableRow({
      tableHeader: true,
      height: {
        value: 600,
        rule: 'atLeast',
      },
      children: [
        createTableCell({
          width: {
            size: 2000,
            type: WidthType.DXA,
          },
          text: 'Day / Period',
          textSize: 24,
          isHeader: true,
        }),
        ...Array.from({ length: PERIODS_PER_DAY }, (_, i) => 
          createTableCell({
            width: {
              size: 3000,
              type: WidthType.DXA,
            },
            text: `Period ${i + 1}`,
            textSize: 24,
            isHeader: true,
          })
        ),
      ],
    }),
    // Data rows
    ...DAYS.map(day => 
      new TableRow({
        height: {
          value: 900,
          rule: 'atLeast',
        },
        children: [
          // Day cell
          createTableCell({
            width: {
              size: 2000,
              type: WidthType.DXA,
            },
            text: day,
            textSize: 24,
          }),
          // Period cells
          ...Array.from({ length: PERIODS_PER_DAY }, (_, period) => {
            const slot = timetable.slots.find(s => s.day === day && s.period === period);
            
            if (slot?.is_interval) {
              return createTableCell({
                width: {
                  size: 3000,
                  type: WidthType.DXA,
                },
                text: 'Break Time',
                textSize: 24,
                isBreak: true,
              });
            }

            const subjectName = getSubjectName(slot?.subject_id ?? null);
            const teacherName = getTeacherName(slot?.subject_id ?? null);

            if (!subjectName) {
              return createTableCell({
                width: {
                  size: 3000,
                  type: WidthType.DXA,
                },
                text: '',
              });
            }

            return createTableCell({
              width: {
                size: 3000,
                type: WidthType.DXA,
              },
              customChildren: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: subjectName,
                      bold: true,
                      size: getAdjustedSize(subjectName, 24),
                      color: COLORS.primary,
                    }),
                    new TextRun({
                      text: '\n',
                    }),
                    new TextRun({
                      text: teacherName,
                      size: getAdjustedSize(teacherName, 20),
                      color: COLORS.textSecondary,
                    }),
                    ...(slot?.is_lab ? [new TextRun({
                      text: '\n(Lab)',
                      italics: true,
                      size: 20,
                      color: COLORS.textSecondary,
                    })] : []),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    line: 360,
                  },
                }),
              ],
            });
          }),
        ],
      })
    ),
  ];

  // Create table with enhanced borders and spacing
  const table = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.primary },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.primary },
      left: { style: BorderStyle.SINGLE, size: 2, color: COLORS.primary },
      right: { style: BorderStyle.SINGLE, size: 2, color: COLORS.primary },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: COLORS.secondary },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: COLORS.secondary },
    },
    rows: tableRows,
  });

  // Create document with enhanced page settings
  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
            },
          },
        },
        children: [...headerParagraphs, table],
      },
    ],
  });
};