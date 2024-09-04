#include <iostream>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>
#include <map>
#include <iomanip>
#include <algorithm>

class Subject
{
public:
    std::string name;

    Subject(const std::string &name) : name(name) {}
};

class Teacher
{
public:
    std::string name;
    std::vector<Subject> subjects;

    Teacher(const std::string &name) : name(name) {}

    void addSubject(const Subject &subject)
    {
        subjects.push_back(subject);
    }

    void displaySubjects() const
    {
        std::cout << "Subjects taught by " << name << ":\n";
        for (const auto &subject : subjects)
        {
            std::cout << "- " << subject.name << '\n';
        }
    }
};

class Section
{
public:
    std::string name;
    int yearNumber; // Added to associate section with a year
    std::vector<Teacher> teachers;

    Section(const std::string &name, int yearNumber) : name(name), yearNumber(yearNumber) {}

    void addTeacher(const Teacher &teacher)
    {
        teachers.push_back(teacher);
    }

    void displayInfo() const
    {
        std::cout << "Section " << name << ", Year " << yearNumber << ":\n";
        for (const auto &teacher : teachers)
        {
            teacher.displaySubjects();
        }
        std::cout << '\n';
    }
};

class Timetable
{
public:
    struct ScheduledClass
    {
        std::string day;
        std::string timeSlot;
        Teacher teacher;
        Subject subject;
        Section section;
    };

    std::vector<ScheduledClass> schedule;

    void addClass(const std::string &day, const std::string &timeSlot, const Teacher &teacher, const Subject &subject, const Section &section)
    {
        schedule.push_back({day, timeSlot, teacher, subject, section});
    }

    void displayTimetable() const
    {
        std::map<std::string, std::map<std::string, std::vector<ScheduledClass>>> groupedTimetable;

        // Grouping classes by day and section
        for (const auto &scheduledClass : schedule)
        {
            groupedTimetable[scheduledClass.day][scheduledClass.timeSlot].push_back(scheduledClass);
        }

        // Displaying timetable grouped by day, time slot, section, and class
        for (const auto &[day, timeSlots] : groupedTimetable)
        {
            std::cout << day << ":\n";
            for (const auto &[timeSlot, classes] : timeSlots)
            {
                std::cout << " -- " << timeSlot << ":\n";
                for (const auto &scheduledClass : classes)
                {
                    std::cout << "    -- " << scheduledClass.section.name << ", Year " << scheduledClass.section.yearNumber << ":\n";
                    std::cout << "       - Teacher: " << scheduledClass.teacher.name << "\n";
                    std::cout << "       - Subject: " << scheduledClass.subject.name << "\n";
                }
            }
            std::cout << std::endl;
        }
    }
};

std::vector<std::string> generateTimeSlots()
{
    return {"09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00"};
}

void generateTimetable(std::vector<Section> &sections, const std::vector<Subject> &subjects, Timetable &timetable, std::map<std::string, std::map<std::string, bool>> &teacherAvailability, std::map<std::string, std::map<std::string, bool>> &sectionAvailability)
{
    std::vector<std::string> days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
    std::vector<std::string> timeSlots = generateTimeSlots();

    for (auto &section : sections)
    {
        std::map<std::string, bool> assignedSubjects;

        for (const auto &day : days)
        {
            for (const auto &timeSlot : timeSlots)
            {
                bool classAssigned = false;

                if (sectionAvailability[section.name][day + timeSlot])
                {
                    continue; // Skip if the section is already assigned in this time slot
                }

                for (const auto &teacher : section.teachers)
                {
                    if (teacherAvailability[teacher.name][day + timeSlot])
                    {
                        continue; // Skip if the teacher is already assigned in this time slot
                    }

                    for (const auto &subject : teacher.subjects)
                    {
                        if (!assignedSubjects[day + timeSlot + subject.name])
                        {
                            timetable.addClass(day, timeSlot, teacher, subject, section);
                            assignedSubjects[day + timeSlot + subject.name] = true;
                            teacherAvailability[teacher.name][day + timeSlot] = true;
                            sectionAvailability[section.name][day + timeSlot] = true;
                            classAssigned = true;
                            break;
                        }
                    }
                    if (classAssigned)
                    {
                        break; // Break out of the teacher loop once a class is assigned for this time slot
                    }
                }
            }
        }
    }
}

int main()
{
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
        Subject("Virtual Reality")};

    // Predefined teachers
    std::vector<Teacher> teachers = {
        Teacher("Dr. Smith"), Teacher("Prof. Johnson"), Teacher("Dr. Brown"), Teacher("Prof. Taylor"),
        Teacher("Dr. Anderson"), Teacher("Prof. Thomas"), Teacher("Dr. Jackson"), Teacher("Prof. White"),
        Teacher("Dr. Harris"), Teacher("Prof. Martin"), Teacher("Dr. Thompson"), Teacher("Prof. Garcia"),
        Teacher("Dr. Martinez"), Teacher("Prof. Robinson"), Teacher("Dr. Clark")};

    // Assign subjects to teachers randomly
    for (auto &teacher : teachers)
    {
        int numSubjects = rand() % 3 + 1; // Each teacher teaches at least 1 subject, up to 3 subjects
        for (int i = 0; i < numSubjects; ++i)
        {
            int subjectIndex = rand() % subjects.size();
            teacher.addSubject(subjects[subjectIndex]);
        }
    }

    // Create sections for each year (1st year to 4th year, sections A, B, C)
    std::vector<Section> sections;
    for (int yearNumber = 1; yearNumber <= 4; ++yearNumber)
    {
        for (char sectionName = 'A'; sectionName <= 'C'; ++sectionName)
        {
            sections.emplace_back(Section(std::string(1, sectionName), yearNumber));
        }
    }

    // Assign teachers to sections
    int teacherIndex = 0;
    for (auto &section : sections)
    {
        int numTeachers = rand() % 5 + 5; // Each section has 5-9 teachers
        for (int i = 0; i < numTeachers; ++i)
        {
            section.addTeacher(teachers[teacherIndex % teachers.size()]);
            teacherIndex++;
        }
    }

    // Initialize teacher and section availability maps
    std::map<std::string, std::map<std::string, bool>> teacherAvailability;
    std::map<std::string, std::map<std::string, bool>> sectionAvailability;
    std::vector<std::string> days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
    for (const auto &teacher : teachers)
    {
        for (const auto &day : days)
        {
            for (const auto &timeSlot : generateTimeSlots())
            {
                teacherAvailability[teacher.name][day + timeSlot] = false;
            }
        }
    }
    for (const auto &section : sections)
    {
        for (const auto &day : days)
        {
            for (const auto &timeSlot : generateTimeSlots())
            {
                sectionAvailability[section.name][day + timeSlot] = false;
            }
        }
    }

    // Generate and display timetable
    Timetable timetable;
    generateTimetable(sections, subjects, timetable, teacherAvailability, sectionAvailability);
    timetable.displayTimetable();

    return 0;
}
