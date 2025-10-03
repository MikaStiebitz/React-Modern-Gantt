import { TaskGroup } from 'react-modern-gantt';
import { addDays, subDays } from 'date-fns';

// Helper to create a date relative to today
const relativeDate = (days: number): Date => {
  const today = new Date();
  return days >= 0 ? addDays(today, days) : subDays(today, Math.abs(days));
};

// Basic demo data
export const basicDemoData: TaskGroup[] = [
  {
    id: 'team-1',
    name: 'Engineering',
    description: 'Development Team',
    tasks: [
      {
        id: 'task-1',
        name: 'Website Redesign',
        startDate: relativeDate(-30),
        endDate: relativeDate(15),
        color: '#3B82F6', // was bg-blue-500
        percent: 75,
      },
      {
        id: 'task-2',
        name: 'API Integration',
        startDate: relativeDate(-15),
        endDate: relativeDate(10),
        color: '#6366F1', // was bg-indigo-500
        percent: 40,
      },
      {
        id: 'task-3',
        name: 'Database Migration',
        startDate: relativeDate(5),
        endDate: relativeDate(25),
        color: '#A855F7', // was bg-purple-500
        percent: 10,
      },
    ],
  },
  {
    id: 'team-2',
    name: 'Marketing',
    description: 'Marketing Team',
    tasks: [
      {
        id: 'task-4',
        name: 'Social Media Campaign',
        startDate: relativeDate(-20),
        endDate: relativeDate(0),
        color: '#22C55E', // was bg-green-500
        percent: 100,
      },
      {
        id: 'task-5',
        name: 'Content Creation',
        startDate: relativeDate(-5),
        endDate: relativeDate(25),
        color: '#10B981', // was bg-emerald-500
        percent: 30,
      },
    ],
  },
  {
    id: 'team-3',
    name: 'Product',
    description: 'Product Team',
    tasks: [
      {
        id: 'task-6',
        name: 'User Research',
        startDate: relativeDate(-30),
        endDate: relativeDate(-15),
        color: '#F59E0B', // was bg-amber-500
        percent: 100,
      },
      {
        id: 'task-7',
        name: 'Prototype Design',
        startDate: relativeDate(-15),
        endDate: relativeDate(5),
        color: '#F97316', // was bg-orange-500
        percent: 85,
        dependencies: ['task-6'],
      },
      {
        id: 'task-8',
        name: 'User Testing',
        startDate: relativeDate(5),
        endDate: relativeDate(30),
        color: '#EF4444', // was bg-red-500
        percent: 0,
        dependencies: ['task-7'],
      },
    ],
  },
];

// Complex data with more tasks and dependencies
export const complexDemoData: TaskGroup[] = [
  {
    id: 'team-development',
    name: 'Development',
    description: 'Software Development Team',
    tasks: [
      {
        id: 'task-planning',
        name: 'Project Planning',
        startDate: relativeDate(-45),
        endDate: relativeDate(-30),
        color: '#2563EB', // was bg-blue-600
        percent: 100,
      },
      {
        id: 'task-design',
        name: 'System Design',
        startDate: relativeDate(-35),
        endDate: relativeDate(-15),
        color: '#3B82F6', // was bg-blue-500
        percent: 100,
        dependencies: ['task-planning'],
      },
      {
        id: 'task-backend',
        name: 'Backend Development',
        startDate: relativeDate(-20),
        endDate: relativeDate(10),
        color: '#4F46E5', // was bg-indigo-600
        percent: 70,
        dependencies: ['task-design'],
      },
      {
        id: 'task-frontend',
        name: 'Frontend Development',
        startDate: relativeDate(-15),
        endDate: relativeDate(15),
        color: '#6366F1', // was bg-indigo-500
        percent: 60,
        dependencies: ['task-design'],
      },
      {
        id: 'task-integration',
        name: 'Integration',
        startDate: relativeDate(5),
        endDate: relativeDate(25),
        color: '#A855F7', // was bg-purple-500
        percent: 20,
        dependencies: ['task-backend', 'task-frontend'],
      },
    ],
  },
  {
    id: 'team-qa',
    name: 'Quality Assurance',
    description: 'Testing Team',
    tasks: [
      {
        id: 'task-test-plan',
        name: 'Test Planning',
        startDate: relativeDate(-25),
        endDate: relativeDate(-10),
        color: '#0D9488', // was bg-teal-600
        percent: 100,
      },
      {
        id: 'task-unit-test',
        name: 'Unit Testing',
        startDate: relativeDate(-10),
        endDate: relativeDate(10),
        color: '#14B8A6', // was bg-teal-500
        percent: 80,
        dependencies: ['task-test-plan'],
      },
      {
        id: 'task-integration-test',
        name: 'Integration Testing',
        startDate: relativeDate(10),
        endDate: relativeDate(30),
        color: '#16A34A', // was bg-green-600
        percent: 10,
        dependencies: ['task-unit-test', 'task-integration'],
      },
      {
        id: 'task-uat',
        name: 'User Acceptance Testing',
        startDate: relativeDate(25),
        endDate: relativeDate(40),
        color: '#22C55E', // was bg-green-500
        percent: 0,
        dependencies: ['task-integration-test'],
      },
    ],
  },
  {
    id: 'team-devops',
    name: 'DevOps',
    description: 'Infrastructure Team',
    tasks: [
      {
        id: 'task-env-setup',
        name: 'Environment Setup',
        startDate: relativeDate(-40),
        endDate: relativeDate(-25),
        color: '#D97706', // was bg-amber-600
        percent: 100,
      },
      {
        id: 'task-ci-setup',
        name: 'CI/CD Pipeline Setup',
        startDate: relativeDate(-30),
        endDate: relativeDate(-15),
        color: '#F59E0B', // was bg-amber-500
        percent: 100,
        dependencies: ['task-env-setup'],
      },
      {
        id: 'task-monitoring',
        name: 'Monitoring Setup',
        startDate: relativeDate(-20),
        endDate: relativeDate(-5),
        color: '#EA580C', // was bg-orange-600
        percent: 90,
        dependencies: ['task-ci-setup'],
      },
      {
        id: 'task-staging-deploy',
        name: 'Staging Deployment',
        startDate: relativeDate(15),
        endDate: relativeDate(25),
        color: '#F97316', // was bg-orange-500
        percent: 0,
        dependencies: ['task-integration', 'task-monitoring'],
      },
      {
        id: 'task-prod-deploy',
        name: 'Production Deployment',
        startDate: relativeDate(35),
        endDate: relativeDate(45),
        color: '#EF4444', // was bg-red-500
        percent: 0,
        dependencies: ['task-staging-deploy', 'task-uat'],
      },
    ],
  },
];

// Year-long project data
export const yearLongProjectData: TaskGroup[] = [
  {
    id: 'phase-planning',
    name: 'Planning Phase',
    description: 'Initial project planning and requirements',
    tasks: [
      {
        id: 'task-req-gathering',
        name: 'Requirements Gathering',
        startDate: new Date(new Date().getFullYear(), 0, 15),
        endDate: new Date(new Date().getFullYear(), 1, 28),
        color: '#2563EB', // was bg-blue-600
        percent: 100,
      },
      {
        id: 'task-feasibility',
        name: 'Feasibility Study',
        startDate: new Date(new Date().getFullYear(), 1, 1),
        endDate: new Date(new Date().getFullYear(), 2, 15),
        color: '#3B82F6', // was bg-blue-500
        percent: 100,
      },
      {
        id: 'task-project-charter',
        name: 'Project Charter',
        startDate: new Date(new Date().getFullYear(), 2, 1),
        endDate: new Date(new Date().getFullYear(), 2, 31),
        color: '#60A5FA', // was bg-blue-400
        percent: 100,
      },
    ],
  },
  {
    id: 'phase-design',
    name: 'Design Phase',
    description: 'System and software design',
    tasks: [
      {
        id: 'task-arch-design',
        name: 'Architecture Design',
        startDate: new Date(new Date().getFullYear(), 3, 1),
        endDate: new Date(new Date().getFullYear(), 4, 15),
        color: '#4F46E5', // was bg-indigo-600
        percent: 100,
        dependencies: ['task-project-charter'],
      },
      {
        id: 'task-db-design',
        name: 'Database Design',
        startDate: new Date(new Date().getFullYear(), 4, 1),
        endDate: new Date(new Date().getFullYear(), 5, 15),
        color: '#6366F1', // was bg-indigo-500
        percent: 95,
        dependencies: ['task-arch-design'],
      },
      {
        id: 'task-ui-design',
        name: 'UI/UX Design',
        startDate: new Date(new Date().getFullYear(), 4, 15),
        endDate: new Date(new Date().getFullYear(), 6, 15),
        color: '#818CF8', // was bg-indigo-400
        percent: 90,
        dependencies: ['task-arch-design'],
      },
    ],
  },
  {
    id: 'phase-implementation',
    name: 'Implementation',
    description: 'Development and coding',
    tasks: [
      {
        id: 'task-core-dev',
        name: 'Core Development',
        startDate: new Date(new Date().getFullYear(), 5, 1),
        endDate: new Date(new Date().getFullYear(), 8, 30),
        color: '#8B5CF6', // was bg-purple-600
        percent: 70,
        dependencies: ['task-db-design'],
      },
      {
        id: 'task-api-dev',
        name: 'API Development',
        startDate: new Date(new Date().getFullYear(), 6, 1),
        endDate: new Date(new Date().getFullYear(), 8, 15),
        color: '#A855F7', // was bg-purple-500
        percent: 60,
        dependencies: ['task-db-design'],
      },
      {
        id: 'task-frontend-dev',
        name: 'Frontend Development',
        startDate: new Date(new Date().getFullYear(), 6, 15),
        endDate: new Date(new Date().getFullYear(), 9, 30),
        color: '#C084FC', // was bg-purple-400
        percent: 50,
        dependencies: ['task-ui-design'],
      },
    ],
  },
  {
    id: 'phase-testing',
    name: 'Testing',
    description: 'Quality assurance and testing',
    tasks: [
      {
        id: 'task-unit-testing',
        name: 'Unit Testing',
        startDate: new Date(new Date().getFullYear(), 7, 1),
        endDate: new Date(new Date().getFullYear(), 9, 30),
        color: '#16A34A', // was bg-green-600
        percent: 60,
        dependencies: ['task-core-dev', 'task-api-dev'],
      },
      {
        id: 'task-integration-testing',
        name: 'Integration Testing',
        startDate: new Date(new Date().getFullYear(), 9, 1),
        endDate: new Date(new Date().getFullYear(), 10, 15),
        color: '#22C55E', // was bg-green-500
        percent: 30,
        dependencies: ['task-unit-testing', 'task-frontend-dev'],
      },
      {
        id: 'task-performance-testing',
        name: 'Performance Testing',
        startDate: new Date(new Date().getFullYear(), 10, 1),
        endDate: new Date(new Date().getFullYear(), 11, 15),
        color: '#4ADE80', // was bg-green-400
        percent: 10,
        dependencies: ['task-integration-testing'],
      },
    ],
  },
  {
    id: 'phase-deployment',
    name: 'Deployment',
    description: 'Release and deployment',
    tasks: [
      {
        id: 'task-beta-release',
        name: 'Beta Release',
        startDate: new Date(new Date().getFullYear(), 10, 15),
        endDate: new Date(new Date().getFullYear(), 11, 15),
        color: '#D97706', // was bg-amber-600
        percent: 5,
        dependencies: ['task-integration-testing'],
      },
      {
        id: 'task-final-release',
        name: 'Final Release',
        startDate: new Date(new Date().getFullYear(), 11, 15),
        endDate: new Date(new Date().getFullYear(), 11, 31),
        color: '#F59E0B', // was bg-amber-500
        percent: 0,
        dependencies: ['task-performance-testing', 'task-beta-release'],
      },
    ],
  },
];

// Hourly demo data - perfect for showing hour view
export const hourlyDemoData: TaskGroup[] = [
  {
    id: 'morning-shift',
    name: 'Morning Shift',
    description: 'Morning activities',
    tasks: [
      {
        id: 'task-morning-1',
        name: 'Team Standup',
        startDate: (() => {
          const date = new Date();
          date.setHours(9, 0, 0, 0);
          return date;
        })(),
        endDate: (() => {
          const date = new Date();
          date.setHours(9, 30, 0, 0);
          return date;
        })(),
        color: '#3B82F6',
        percent: 100,
      },
      {
        id: 'task-morning-2',
        name: 'Code Review Session',
        startDate: (() => {
          const date = new Date();
          date.setHours(9, 30, 0, 0);
          return date;
        })(),
        endDate: (() => {
          const date = new Date();
          date.setHours(11, 0, 0, 0);
          return date;
        })(),
        color: '#6366F1',
        percent: 75,
      },
      {
        id: 'task-morning-3',
        name: 'Feature Development',
        startDate: (() => {
          const date = new Date();
          date.setHours(11, 0, 0, 0);
          return date;
        })(),
        endDate: (() => {
          const date = new Date();
          date.setHours(13, 0, 0, 0);
          return date;
        })(),
        color: '#8B5CF6',
        percent: 45,
      },
    ],
  },
  {
    id: 'afternoon-shift',
    name: 'Afternoon Shift',
    description: 'Afternoon activities',
    tasks: [
      {
        id: 'task-afternoon-1',
        name: 'Client Meeting',
        startDate: (() => {
          const date = new Date();
          date.setHours(14, 0, 0, 0);
          return date;
        })(),
        endDate: (() => {
          const date = new Date();
          date.setHours(15, 0, 0, 0);
          return date;
        })(),
        color: '#22C55E',
        percent: 100,
      },
      {
        id: 'task-afternoon-2',
        name: 'Testing & QA',
        startDate: (() => {
          const date = new Date();
          date.setHours(15, 0, 0, 0);
          return date;
        })(),
        endDate: (() => {
          const date = new Date();
          date.setHours(17, 0, 0, 0);
          return date;
        })(),
        color: '#10B981',
        percent: 60,
      },
    ],
  },
  {
    id: 'evening-shift',
    name: 'Evening Shift',
    description: 'Evening wrap-up',
    tasks: [
      {
        id: 'task-evening-1',
        name: 'Documentation',
        startDate: (() => {
          const date = new Date();
          date.setHours(17, 0, 0, 0);
          return date;
        })(),
        endDate: (() => {
          const date = new Date();
          date.setHours(18, 0, 0, 0);
          return date;
        })(),
        color: '#F59E0B',
        percent: 30,
      },
      {
        id: 'task-evening-2',
        name: 'Day Summary',
        startDate: (() => {
          const date = new Date();
          date.setHours(18, 0, 0, 0);
          return date;
        })(),
        endDate: (() => {
          const date = new Date();
          date.setHours(18, 30, 0, 0);
          return date;
        })(),
        color: '#F97316',
        percent: 0,
      },
    ],
  },
];
