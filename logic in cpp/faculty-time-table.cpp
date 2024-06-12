#include <iostream>
#include <vector>
#include <string>
#include <map>

struct Faculty
{
    std::string name;
    std::vector<std::string> subjects;
};

struct TimeSlot
{
    int day;  // 0 to 4 for Monday to Friday
    int hour; // 0 to 6 for 8:30 to 3:30 with intervals
};

struct Class
{
    std::string subject;
    std::string faculty;
    std::string classroom;
    TimeSlot timeSlot;
};

std::vector<Faculty> inputFaculties()
{
    std::vector<Faculty> faculties;
    faculties.push_back({"Dr. Smith", {"Math", "Physics"}});
    faculties.push_back({"Ms. Johnson", {"Chemistry", "Biology"}});
    // Add more faculties as needed
    return faculties;
}

std::vector<std::string> inputClassrooms()
{
    return {"Room 101", "Room 102", "Room 103"};
}

bool isTimeSlotAvailable(const std::vector<Class> &schedule, const TimeSlot &timeSlot, const std::string &classroom)
{
    for (const auto &cls : schedule)
    {
        if (cls.timeSlot.day == timeSlot.day && cls.timeSlot.hour == timeSlot.hour && cls.classroom == classroom)
        {
            return false;
        }
    }
    return true;
}

std::vector<Class> generateSchedule(const std::vector<Faculty> &faculties, const std::vector<std::string> &classrooms)
{
    std::vector<Class> schedule;
    int hoursPerDay = 7; // 8:30 to 3:30 with intervals (6 periods)
    for (const auto &faculty : faculties)
    {
        for (const auto &subject : faculty.subjects)
        {
            for (int day = 0; day < 5; ++day)
            { // Monday to Friday
                for (int hour = 0; hour < hoursPerDay; ++hour)
                {
                    if ((hour + 1) % 3 == 0)
                        continue; // Skip interval hours
                    TimeSlot timeSlot = {day, hour};
                    for (const auto &classroom : classrooms)
                    {
                        if (isTimeSlotAvailable(schedule, timeSlot, classroom))
                        {
                            schedule.push_back({subject, faculty.name, classroom, timeSlot});
                            goto nextSubject; // Break out of the nested loop
                        }
                    }
                }
            nextSubject:;
            }
        }
    }
    return schedule;
}

void printSchedule(const std::vector<Class> &schedule)
{
    std::map<int, std::string> days = {{0, "Monday"}, {1, "Tuesday"}, {2, "Wednesday"}, {3, "Thursday"}, {4, "Friday"}};
    std::map<int, std::string> hours = {
        {0, "8:30-9:30"}, {1, "9:30-10:30"}, {2, "10:30-11:30"}, {3, "11:30-12:30"}, {4, "12:30-1:30"}, {5, "1:30-2:30"}, {6, "2:30-3:30"}};

    for (const auto &cls : schedule)
    {
        std::cout << "Day: " << days[cls.timeSlot.day] << ", Hour: " << hours[cls.timeSlot.hour]
                  << ", Subject: " << cls.subject << ", Faculty: " << cls.faculty << ", Classroom: " << cls.classroom << std::endl;
    }
}

void printDaySchedule(const std::vector<Class> &schedule, int day)
{
    std::map<int, std::string> days = {{0, "Monday"}, {1, "Tuesday"}, {2, "Wednesday"}, {3, "Thursday"}, {4, "Friday"}};
    std::map<int, std::string> hours = {
        {0, "8:30-9:30"}, {1, "9:30-10:30"}, {2, "10:30-11:30"}, {3, "11:30-12:30"}, {4, "12:30-1:30"}, {5, "1:30-2:30"}, {6, "2:30-3:30"}};

    std::cout << "Timetable for " << days[day] << ":\n";
    for (const auto &cls : schedule)
    {
        if (cls.timeSlot.day == day)
        {
            std::cout << "Hour: " << hours[cls.timeSlot.hour] << ", Subject: " << cls.subject
                      << ", Faculty: " << cls.faculty << ", Classroom: " << cls.classroom << std::endl;
        }
    }
}

void printClassSchedule(const std::vector<Class> &schedule, const std::string &classroom)
{
    std::map<int, std::string> days = {{0, "Monday"}, {1, "Tuesday"}, {2, "Wednesday"}, {3, "Thursday"}, {4, "Friday"}};
    std::map<int, std::string> hours = {
        {0, "8:30-9:30"}, {1, "9:30-10:30"}, {2, "10:30-11:30"}, {3, "11:30-12:30"}, {4, "12:30-1:30"}, {5, "1:30-2:30"}, {6, "2:30-3:30"}};

    std::cout << "Timetable for " << classroom << ":\n";
    for (const auto &cls : schedule)
    {
        if (cls.classroom == classroom)
        {
            std::cout << "Day: " << days[cls.timeSlot.day] << ", Hour: " << hours[cls.timeSlot.hour]
                      << ", Subject: " << cls.subject << ", Faculty: " << cls.faculty << std::endl;
        }
    }
}

void printFaculties(const std::vector<Faculty> &faculties)
{
    for (const auto &faculty : faculties)
    {
        std::cout << "Faculty: " << faculty.name << std::endl;
        std::cout << "Subjects: ";
        for (const auto &subject : faculty.subjects)
        {
            std::cout << subject << " ";
        }
        std::cout << std::endl;
    }
}

void printFacultySchedule(const std::vector<Class> &schedule, const std::string &facultyName)
{
    std::map<int, std::string> days = {{0, "Monday"}, {1, "Tuesday"}, {2, "Wednesday"}, {3, "Thursday"}, {4, "Friday"}};
    std::map<int, std::string> hours = {
        {0, "8:30-9:30"}, {1, "9:30-10:30"}, {2, "10:30-11:30"}, {3, "11:30-12:30"}, {4, "12:30-1:30"}, {5, "1:30-2:30"}, {6, "2:30-3:30"}};

    for (const auto &cls : schedule)
    {
        if (cls.faculty == facultyName)
        {
            std::cout << "Subject: " << cls.subject << ", Day: " << days[cls.timeSlot.day]
                      << ", Hour: " << hours[cls.timeSlot.hour] << ", Classroom: " << cls.classroom << std::endl;
        }
    }
}

void displayMenu()
{
    std::cout << "Menu:\n";
    std::cout << "1. Generate Timetable\n";
    std::cout << "2. Show List of All Faculties with Their Details\n";
    std::cout << "3. Show Subjects and Time Slots for a Specific Teacher\n";
    std::cout << "4. Show Timetable for a Specific Day\n";
    std::cout << "5. Show Timetable for a Specific Class\n";
    std::cout << "6. Exit\n";
    std::cout << "Enter your choice: ";
}

int main()
{
    std::vector<Faculty> faculties = inputFaculties();
    std::vector<std::string> classrooms = inputClassrooms();
    std::vector<Class> schedule = generateSchedule(faculties, classrooms);

    while (true)
    {
        displayMenu();
        int choice;
        std::cin >> choice;

        if (choice == 1)
        {
            printSchedule(schedule);
        }
        else if (choice == 2)
        {
            printFaculties(faculties);
        }
        else if (choice == 3)
        {
            std::cout << "Enter the name of the faculty: ";
            std::string facultyName;
            std::cin.ignore(); // to clear the newline character from the buffer
            std::getline(std::cin, facultyName);
            printFacultySchedule(schedule, facultyName);
        }
        else if (choice == 4)
        {
            std::cout << "Enter the day (0 for Monday, 1 for Tuesday, ..., 4 for Friday): ";
            int day;
            std::cin >> day;
            if (day >= 0 && day <= 4)
            {
                printDaySchedule(schedule, day);
            }
            else
            {
                std::cout << "Invalid day. Please enter a number between 0 and 4.\n";
            }
        }
        else if (choice == 5)
        {
            std::cout << "Enter the class (classroom): ";
            std::string classroom;
            std::cin.ignore(); // to clear the newline character from the buffer
            std::getline(std::cin, classroom);
            printClassSchedule(schedule, classroom);
        }
        else if (choice == 6)
        {
            break;
        }
        else
        {
            std::cout << "Invalid choice. Please try again.\n";
        }
    }

    return 0;
}
