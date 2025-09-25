
# AcademicCal Pro - College Timetable Generator

AcademicCal Pro is an intelligent timetable generator for educational institutions that automatically creates conflict-free schedules using genetic algorithms. Built with Next.js, TypeScript, and Supabase, it provides an efficient solution for managing complex academic scheduling needs.

The project also includes experimental C++ implementations of timetable generation algorithms for performance comparison and educational purposes.

## Features

- **Smart Scheduling**: Automatically generates conflict-free timetables using genetic algorithms
- **Multi-User Support**: Different views for teachers and students with role-based access
- **Subject Management**: Easy subject allocation and management for all classes
- **Time Management**: Optimizes class timings and teacher allocations efficiently
- **Export Functionality**: Download timetables as DOCX files
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, Lucide React Icons
- **Backend**: Supabase (Authentication & Database)
- **Document Generation**: DOCX library for timetable exports
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with custom configurations
- **Experimental**: C++ implementations for algorithm performance comparison

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, pnpm, or bun
- Supabase account for backend services

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/puneeth067/scheduloom.git
   ```
2. Navigate to the acadcaloom directory:

   ```bash
   cd scheduloom/acadcaloom
   ```
3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```
4. Set up environment variables:
   Create a `.env.local` file in the root directory with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```
6. Open [app](https://scheduloom-one.vercel.app/) in your browser to see the application.

## Usage

1. **Sign In**: Create an account or sign in to access the timetable generator
2. **Add Data**:
   - Add subjects with assigned teachers
   - Add teachers with their constraints
   - Add classes with required subjects
   - Add rooms for lab sessions
3. **Generate Timetables**: Click the "Generate Timetables" button to create schedules
4. **View & Edit**: Switch between student and teacher views to see different perspectives
5. **Export**: Download timetables as DOCX files for sharing

## Project Structure

```
acadcaloom/
├── app/                 # Next.js app directory with pages
├── components/          # React components
│   ├── ui/              # Reusable UI components
│   └── ...              # Feature-specific components
├── lib/                 # Utility functions
├── services/            # Data service layer
├── types/               # TypeScript type definitions
├── utils/               # Helper functions and algorithms
├── public/              # Static assets
└── ...

poc/
├── logic in cpp/        # Experimental C++ implementations
└── ...
```

## Key Components

- **TimetableGenerator**: Main component for managing timetable creation
- **Genetic Algorithm**: Core scheduling logic in `utils/geneticAlgorithm.ts`
- **Supabase Integration**: Authentication and data persistence
- **DOCX Export**: Timetable export functionality using the DOCX library

## Algorithm Implementation

### JavaScript/TypeScript Genetic Algorithm

The main timetable generation uses a genetic algorithm implemented in TypeScript with the following characteristics:

1. **Population Initialization**: Creates random timetables for each class considering subject assignments and room availability
2. **Fitness Function**: Evaluates timetables based on multiple constraints:
   - Teacher conflicts (same teacher in multiple places at once)
   - Room conflicts (same room used for multiple classes)
   - Teacher availability constraints
   - Subject time constraints
   - Lab session requirements (consecutive periods)
   - Room type compatibility
3. **Selection**: Uses elitism to preserve the best solutions
4. **Crossover**: Combines two parent timetables to create offspring
5. **Mutation**: Randomly modifies timetables to introduce diversity
6. **Evolution**: Iterates through generations to improve solutions

### C++ Algorithm Implementations

The project includes experimental C++ implementations in the [poc/logic in cpp](../poc/logic%20in%20cpp) directory that demonstrate alternative approaches to timetable generation:

1. **Constraint-based Scheduling**: Direct assignment algorithm that tries to satisfy all constraints without using evolutionary techniques
2. **6-Day Scheduling**: Implementation that generates timetables for a 6-day academic week
3. **Faculty-Centric View**: Alternative approach focused on faculty scheduling requirements

These implementations serve as performance baselines and educational examples of different algorithmic approaches to the timetable problem.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- Genetic Algorithm implementation inspired by academic scheduling research

## Contact

 [Github](https://github.com/puneeth067/scheduloom)
