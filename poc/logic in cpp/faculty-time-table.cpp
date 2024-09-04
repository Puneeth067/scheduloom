#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>
#include <map>
#include <iomanip>
#include <algorithm>

class Subject {
public:
    std::string name;

    Subject(const std::string& name) : name(name) {}
};

class Teacher {
public:
    std::string name;
    std::vector<Subject> subjects;

    Teacher(const std::string& name) : name(name) {}

    void addSubject(const Subject& subject) {
        subjects.push_back(subject);
    }

    void displaySubjects() const {
        std::cout << "Subjects taught by " << name << ":\n";
        for (const auto& subject : subjects) {
            std::cout << "- " << subject.name << '\n';
        }
    }
};

class Section {
public:
    std::string name;
    std::vector<Teacher> teachers;

    Section(const std::string& name) : name(name) {}

    void addTeacher(const Teacher& teacher) {
        teachers.push_back(teacher);
    }

    void displayInfo() const {
        std::cout << "Section " << name << ":\n";
        for (const auto& teacher : teachers) {
            teacher.displaySubjects();
        }
        std::cout << '\n';
    }
};

class Year {
public:
    int yearNumber;
    std::vector<Section> sections;

    Year(int yearNumber, const std::vector<Section>& sections) : yearNumber(yearNumber), sections(sections) {}

    void displayInfo() const {
        std::cout << "Year " << yearNumber << ":\n";
        for (const auto& section : sections) {
            section.displayInfo();
        }
    }
};

class Timetable {
public:
    struct ScheduledClass {
        std::string timeSlot;
        Teacher teacher;
        Subject subject;
        Section section;
    };

    std::map<std::string, std::vector<ScheduledClass>> schedule;

    void addClass(const std::string& timeSlot, const Teacher& teacher, const Subject& subject, const Section& section) {
        schedule[section.name].push_back({ timeSlot, teacher, subject, section });
    }

    void displayTimetable() const {
        for (const auto& entry : schedule) {
            std::cout << "Section: " << entry.first << '\n';
            std::cout << std::left << std::setw(15) << "Time"
                      << std::setw(20) << "Teacher"
                      << std::setw(25) << "Subject" << '\n';
            std::cout << std::string(60, '-') << '\n';

            // Sort classes by time slot for proper display
            std::vector<ScheduledClass> sortedClasses = entry.second;
            std::sort(sortedClasses.begin(), sortedClasses.end(), [](const ScheduledClass& a, const ScheduledClass& b) {
                return a.timeSlot < b.timeSlot;
            });

            for (const auto& scheduledClass : sortedClasses) {
                std::cout << std::left << std::setw(15) << scheduledClass.timeSlot
                          << std::setw(20) << scheduledClass.teacher.name
                          << std::setw(25) << scheduledClass.subject.name << '\n';
            }
            std::cout << '\n';
        }
    }
};

std::vector<std::string> generateTimeSlots() {
    return { "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00" };
}

void generateTimetable(Year& year, const std::vector<Subject>& subjects, Timetable& timetable, std::map<std::string, std::map<std::string, bool>>& teacherAvailability, std::map<std::string, std::map<std::string, bool>>& sectionAvailability) {
    std::vector<std::string> timeSlots = generateTimeSlots();

    for (const auto& section : year.sections) {
        std::map<std::string, bool> assignedSubjects;

        for (const auto& timeSlot : timeSlots) {
            bool classAssigned = false;

            if (sectionAvailability[section.name][timeSlot]) {
                continue; // Skip if the section is already assigned in this time slot
            }

            for (const auto& teacher : section.teachers) {
                if (teacherAvailability[teacher.name][timeSlot]) {
                    continue; // Skip if the teacher is already assigned in this time slot
                }

                for (const auto& subject : teacher.subjects) {
                    if (!assignedSubjects[subject.name]) {
                        timetable.addClass(timeSlot, teacher, subject, section);
                        assignedSubjects[subject.name] = true;
                        teacherAvailability[teacher.name][timeSlot] = true;
                        sectionAvailability[section.name][timeSlot] = true;
                        classAssigned = true;
                        break;
                    }
                }
                if (classAssigned) {
                    break; // Break out of the teacher loop once a class is assigned for this time slot
                }
            }
        }
    }
}

int main() {
    std::srand(std::time(nullptr));

    // Predefined subjects
    std::vector<Subject> subjects = {
        Subject("Data Structures"), Subject("Algorithms"), Subject("Database Systems"),
        Subject("Operating Systems"), Subject("Computer Networks"), Subject("Software Engineering"),
        Subject("Artificial Intelligence"), Subject("Machine Learning"), Subject("Computer Graphics"),
        Subject("Web Development"), Subject("Mobile App Development"), Subject("Cloud Computing"),
        Subject("Cyber Security"), Subject("Big Data"), Subject("Blockchain Technology"),
        Subject("Internet of Things"), Subject("Human-Computer Interaction"), Subject("Robotics"),
        Subject("Embedded Systems"), Subject("Natural Language Processing"), Subject("Quantum Computing"),
        Subject("Bioinformatics"), Subject("Digital Signal Processing"), Subject("Game Development"),
        Subject("Virtual Reality")
    };

    // Predefined teachers
    std::vector<Teacher> teachers = {
        Teacher("Dr. Smith"), Teacher("Prof. Johnson"), Teacher("Dr. Brown"), Teacher("Prof. Taylor"),
        Teacher("Dr. Anderson"), Teacher("Prof. Thomas"), Teacher("Dr. Jackson"), Teacher("Prof. White"),
        Teacher("Dr. Harris"), Teacher("Prof. Martin"), Teacher("Dr. Thompson"), Teacher("Prof. Garcia"),
        Teacher("Dr. Martinez"), Teacher("Prof. Robinson"), Teacher("Dr. Clark")
    };

    // Assign subjects to teachers randomly
    for (auto& teacher : teachers) {
        int numSubjects = rand() % 3 + 1;  // Each teacher teaches at least 1 subject, up to 3 subjects
        for (int i = 0; i < numSubjects; ++i) {
            int subjectIndex = rand() % subjects.size();
            teacher.addSubject(subjects[subjectIndex]);
        }
    }

    // Create sections for each year
    std::vector<Year> years;
    for (int yearNumber = 1; yearNumber <= 4; ++yearNumber) {
        std::vector<Section> sections;
        for (char sectionName = 'A'; sectionName <= 'C'; ++sectionName) {
            sections.emplace_back(Section(std::string(1, sectionName)));
        }
        years.emplace_back(Year(yearNumber, sections));
    }

    // Assign teachers to sections
    int teacherIndex = 0;
    for (auto& year : years) {
        for (auto& section : year.sections) {
            int numTeachers = rand() % 5 + 5;  // Each section has 5-9 teachers
            for (int i = 0; i < numTeachers; ++i) {
                section.addTeacher(teachers[teacherIndex % teachers.size()]);
                teacherIndex++;
            }
        }
    }

    // Initialize teacher and section availability maps
    std::map<std::string, std::map<std::string, bool>> teacherAvailability;
    std::map<std::string, std::map<std::string, bool>> sectionAvailability;
    for (const auto& teacher : teachers) {
        for (const auto& timeSlot : generateTimeSlots()) {
            teacherAvailability[teacher.name][timeSlot] = false;
        }
    }
    for (const auto& year : years) {
        for (const auto& section : year.sections) {
            for (const auto& timeSlot : generateTimeSlots()) {
                sectionAvailability[section.name][timeSlot] = false;
            }
        }
    }

    // Generate and display timetable
    Timetable timetable;
    for (auto& year : years) {
        generateTimetable(year, subjects, timetable, teacherAvailability, sectionAvailability);
    }
    timetable.displayTimetable();

    return 0;
}
