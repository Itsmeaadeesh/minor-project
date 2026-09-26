import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Skill Setu Normalized Database Seeding...");

  // 1. Clean existing records in reverse dependency order
  await prisma.activityLog.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.upload.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.course.deleteMany();
  await prisma.learnerSkillLevel.deleteMany();
  await prisma.trackSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.track.deleteMany();

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // 2. Seed Career Tracks
  const frontendTrack = await prisma.track.create({
    data: {
      name: "Full Stack Web Engineering",
      slug: "full-stack-web",
      description: "Master enterprise web applications with React, TypeScript, Node.js, relational databases, and modern cloud deployment.",
      icon: "Code",
      color: "indigo"
    }
  });

  const aiDataTrack = await prisma.track.create({
    data: {
      name: "Data Science & AI Engineering",
      slug: "ai-data-science",
      description: "Extract insights, engineer predictive models, perform statistical inference, and build LLM-powered applications with Gemini API.",
      icon: "Sparkles",
      color: "purple"
    }
  });

  const cloudDevOpsTrack = await prisma.track.create({
    data: {
      name: "Cloud Infrastructure & DevOps",
      slug: "cloud-devops",
      description: "Design resilient distributed systems, master CI/CD pipelines, container orchestration with Kubernetes, and infrastructure as code.",
      icon: "Cloud",
      color: "emerald"
    }
  });

  // 3. Seed Skills
  const skillsData = [
    // Web Track Skills
    { name: "React & Next.js", slug: "react-nextjs", category: "Frontend", description: "Modern React architecture, hooks, server components, and state synchronization.", icon: "Atom" },
    { name: "TypeScript", slug: "typescript", category: "Frontend", description: "Static typing, interfaces, generics, mapped types, and strict type safety.", icon: "Code2" },
    { name: "Tailwind CSS & UI Design", slug: "tailwind-ui", category: "Frontend", description: "Responsive layouts, design systems, accessible semantic markup, and CSS Grid.", icon: "Palette" },
    { name: "Node.js & Express API", slug: "nodejs-express", category: "Backend", description: "Asynchronous runtime, REST design, middleware authentication, and error handling.", icon: "Server" },
    { name: "PostgreSQL & Prisma ORM", slug: "postgres-prisma", category: "Backend", description: "Normalized schemas, ACID transactions, migrations, and relational queries.", icon: "Database" },

    // AI & Data Skills
    { name: "Python Data Analysis", slug: "python-data", category: "Data", description: "NumPy vectorization, Pandas dataframes, feature engineering, and data cleaning.", icon: "Terminal" },
    { name: "SQL & Analytics", slug: "sql-analytics", category: "Data", description: "Complex joins, window functions, CTEs, aggregation, and query optimization.", icon: "BarChart" },
    { name: "Machine Learning Foundations", slug: "machine-learning", category: "AI", description: "Supervised and unsupervised models, cross-validation, and metrics evaluation.", icon: "Cpu" },
    { name: "Generative AI & LLM Systems", slug: "generative-ai", category: "AI", description: "Prompt engineering, Google Gemini API, RAG architectures, and structured schemas.", icon: "Sparkles" },
    { name: "Data Visualization & BI", slug: "data-viz", category: "Data", description: "Dashboard storytelling, Recharts, metric design, and trend interpretation.", icon: "PieChart" },

    // Cloud & DevOps Skills
    { name: "Docker Containerization", slug: "docker", category: "Cloud", description: "Multi-stage builds, container isolation, environment parity, and Docker Compose.", icon: "Box" },
    { name: "Kubernetes Orchestration", slug: "kubernetes", category: "Cloud", description: "Pods, services, deployments, ingress, autoscaling, and statefulsets.", icon: "Boxes" },
    { name: "CI/CD Automation", slug: "cicd", category: "Cloud", description: "GitHub Actions, continuous integration, automated testing, and zero-downtime rollouts.", icon: "RefreshCw" },
    { name: "Linux & Shell Scripting", slug: "linux-shell", category: "Cloud", description: "System administration, process monitoring, bash automation, and networking.", icon: "HardDrive" }
  ];

  const skillMap: Record<string, any> = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({ data: s });
    skillMap[s.slug] = created;
  }

  // 4. Seed Track Skills (required proficiency 1 to 5)
  // Full Stack Web Requirements
  const webTrackSkills = [
    { slug: "react-nextjs", level: 4 },
    { slug: "typescript", level: 4 },
    { slug: "tailwind-ui", level: 3 },
    { slug: "nodejs-express", level: 4 },
    { slug: "postgres-prisma", level: 4 }
  ];
  for (const r of webTrackSkills) {
    await prisma.trackSkill.create({
      data: {
        trackId: frontendTrack.id,
        skillId: skillMap[r.slug].id,
        requiredProficiencyLevel: r.level
      }
    });
  }

  // AI & Data Requirements
  const aiTrackSkills = [
    { slug: "python-data", level: 5 },
    { slug: "sql-analytics", level: 4 },
    { slug: "machine-learning", level: 4 },
    { slug: "generative-ai", level: 4 },
    { slug: "data-viz", level: 3 }
  ];
  for (const r of aiTrackSkills) {
    await prisma.trackSkill.create({
      data: {
        trackId: aiDataTrack.id,
        skillId: skillMap[r.slug].id,
        requiredProficiencyLevel: r.level
      }
    });
  }

  // Cloud & DevOps Requirements
  const cloudTrackSkills = [
    { slug: "linux-shell", level: 4 },
    { slug: "docker", level: 4 },
    { slug: "kubernetes", level: 4 },
    { slug: "cicd", level: 4 }
  ];
  for (const r of cloudTrackSkills) {
    await prisma.trackSkill.create({
      data: {
        trackId: cloudDevOpsTrack.id,
        skillId: skillMap[r.slug].id,
        requiredProficiencyLevel: r.level
      }
    });
  }

  // 5. Seed Courses with Real Prerequisite Chains (Foundational -> Intermediate -> Advanced)
  // React Chain
  const c1_react_found = await prisma.course.create({
    data: {
      title: "Foundations of React & Component State",
      description: "Understand declarative UI, JSX compilation, props vs state, and functional component decomposition.",
      sourceLink: "https://react.dev/learn",
      taggedSkillId: skillMap["react-nextjs"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "FOUNDATIONAL",
      durationHours: 8,
      provider: "Skill Setu Academy",
      rating: 4.8
    }
  });

  const c2_react_inter = await prisma.course.create({
    data: {
      title: "Advanced React Hooks & State Management",
      description: "Deep dive into useEffect dependency arrays, custom hooks, Context API, and state caching patterns.",
      sourceLink: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      taggedSkillId: skillMap["react-nextjs"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "INTERMEDIATE",
      durationHours: 12,
      provider: "Skill Setu Academy",
      rating: 4.9,
      prerequisiteCourseId: c1_react_found.id
    }
  });

  const c3_react_adv = await prisma.course.create({
    data: {
      title: "Full-Stack Next.js 15 & Server Components",
      description: "Build enterprise web apps with React Server Components (RSC), Server Actions, and streaming SSR.",
      sourceLink: "https://nextjs.org/docs",
      taggedSkillId: skillMap["react-nextjs"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "ADVANCED",
      durationHours: 16,
      provider: "Skill Setu Academy",
      rating: 5.0,
      prerequisiteCourseId: c2_react_inter.id
    }
  });

  // TypeScript Chain
  const c1_ts_found = await prisma.course.create({
    data: {
      title: "TypeScript Syntax & Fundamental Types",
      description: "Primitives, interfaces, type aliases, union types, and compile-time verification in modern web projects.",
      sourceLink: "https://www.typescriptlang.org/docs/handbook/intro.html",
      taggedSkillId: skillMap["typescript"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "FOUNDATIONAL",
      durationHours: 6,
      provider: "CodeCraft Institute",
      rating: 4.7
    }
  });

  const c2_ts_inter = await prisma.course.create({
    data: {
      title: "Generics, Narrowing & Utility Types in TypeScript",
      description: "Master generic functions and classes, Pick, Omit, Record, Partial, and Discriminated Unions.",
      sourceLink: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      taggedSkillId: skillMap["typescript"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "INTERMEDIATE",
      durationHours: 10,
      provider: "CodeCraft Institute",
      rating: 4.8,
      prerequisiteCourseId: c1_ts_found.id
    }
  });

  // Tailwind CSS
  await prisma.course.create({
    data: {
      title: "Modern UI Engineering with Tailwind CSS & Flex/Grid",
      description: "Rapidly craft clean responsive interfaces, theme tokens, and component abstractions without CSS bloat.",
      sourceLink: "https://tailwindcss.com/docs",
      taggedSkillId: skillMap["tailwind-ui"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "FOUNDATIONAL",
      durationHours: 6,
      provider: "Skill Setu Academy",
      rating: 4.7
    }
  });

  // Node & Express Chain
  const c1_node_found = await prisma.course.create({
    data: {
      title: "Node.js Runtime & Express Server Fundamentals",
      description: "Event loop, asynchronous I/O, middleware request pipelines, REST routing, and JSON serialization.",
      sourceLink: "https://nodejs.org/en/docs",
      taggedSkillId: skillMap["nodejs-express"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "FOUNDATIONAL",
      durationHours: 8,
      provider: "Backend Guild",
      rating: 4.8
    }
  });

  const c2_node_inter = await prisma.course.create({
    data: {
      title: "Production REST Architecture & JWT Security",
      description: "Robust input validation with Zod, JWT authorization, rate limiting, and centralized error handling.",
      sourceLink: "https://expressjs.com/en/advanced/best-practice-security.html",
      taggedSkillId: skillMap["nodejs-express"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "INTERMEDIATE",
      durationHours: 12,
      provider: "Backend Guild",
      rating: 4.9,
      prerequisiteCourseId: c1_node_found.id
    }
  });

  // PostgreSQL & Prisma Chain
  const c1_db_found = await prisma.course.create({
    data: {
      title: "Relational Modeling with PostgreSQL & Supabase",
      description: "Tables, primary/foreign keys, one-to-many and many-to-many associations, constraints, and indexes.",
      sourceLink: "https://supabase.com/docs/guides/database",
      taggedSkillId: skillMap["postgres-prisma"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "FOUNDATIONAL",
      durationHours: 8,
      provider: "Database Mastery",
      rating: 4.8
    }
  });

  await prisma.course.create({
    data: {
      title: "Type-Safe Database Access with Prisma ORM",
      description: "Prisma schema design, automated migrations, declarative transactions, and relationship querying.",
      sourceLink: "https://www.prisma.io/docs",
      taggedSkillId: skillMap["postgres-prisma"].id,
      trackId: frontendTrack.id,
      difficultyLevel: "INTERMEDIATE",
      durationHours: 10,
      provider: "Prisma Guild",
      rating: 4.9,
      prerequisiteCourseId: c1_db_found.id
    }
  });

  // AI & Data Courses
  const c1_py_found = await prisma.course.create({
    data: {
      title: "Python Data Analysis with Pandas & NumPy",
      description: "Vectorized arrays, dataframe filtering, group-by aggregations, missing values, and time-series data.",
      sourceLink: "https://pandas.pydata.org/docs/",
      taggedSkillId: skillMap["python-data"].id,
      trackId: aiDataTrack.id,
      difficultyLevel: "FOUNDATIONAL",
      durationHours: 10,
      provider: "DataCamp",
      rating: 4.8
    }
  });

  const c1_ml_inter = await prisma.course.create({
    data: {
      title: "Applied Machine Learning & Model Evaluation",
      description: "Scikit-Learn estimators, cross-validation, regression, classification, precision/recall, and ROC-AUC.",
      sourceLink: "https://scikit-learn.org/stable/",
      taggedSkillId: skillMap["machine-learning"].id,
      trackId: aiDataTrack.id,
      difficultyLevel: "INTERMEDIATE",
      durationHours: 14,
      provider: "AI Institute",
      rating: 4.9,
      prerequisiteCourseId: c1_py_found.id
    }
  });

  await prisma.course.create({
    data: {
      title: "Building Production Generative AI Apps with Google Gemini",
      description: "Multimodal prompts, structured JSON schema outputs, function calling, and RAG pipelines.",
      sourceLink: "https://ai.google.dev/gemini-api/docs",
      taggedSkillId: skillMap["generative-ai"].id,
      trackId: aiDataTrack.id,
      difficultyLevel: "ADVANCED",
      durationHours: 14,
      provider: "Google Developer Student Club",
      rating: 5.0,
      prerequisiteCourseId: c1_ml_inter.id
    }
  });

  // 6. Seed Baseline Quizzes & Questions
  const reactBaselineQuiz = await prisma.quiz.create({
    data: {
      title: "React.js Core Baseline Assessment",
      description: "Diagnostic assessment testing Virtual DOM diffing, component lifecycle, hooks, and immutable state updates.",
      trackId: frontendTrack.id,
      skillId: skillMap["react-nextjs"].id,
      isBaseline: true,
      generatedFrom: "baseline",
      timeLimitMinutes: 12
    }
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: reactBaselineQuiz.id,
        questionText: "Why does React utilize an in-memory Virtual DOM instead of writing directly to the browser DOM?",
        options: JSON.stringify([
          "To allow web browsers to execute native x86 machine instructions",
          "To minimize expensive DOM reflows and repaints by batching updates and reconciling differences",
          "To eliminate the need for JavaScript in the client application",
          "To bypass all CSS stylesheets and HTML rendering engines"
        ]),
        correctAnswer: 1,
        explanation: "Manipulating the real browser DOM triggers expensive style recalculations, reflows, and repaints. React's Virtual DOM compares lightweight JavaScript tree snapshots and applies only minimal changes to the real DOM.",
        difficulty: "foundational"
      },
      {
        quizId: reactBaselineQuiz.id,
        questionText: "What occurs if you directly mutate React component state (e.g., `state.count = 5`) instead of invoking the setter function?",
        options: JSON.stringify([
          "The browser executes an unhandled memory exception and halts",
          "React skips re-rendering because shallow reference comparison detects no pointer change",
          "The state value is permanently deleted from the JavaScript execution context",
          "React automatically rolls back the entire application to the previous commit"
        ]),
        correctAnswer: 1,
        explanation: "React relies on immutability and shallow reference comparison (`Object.is`) to detect when state has changed. Direct mutation mutates the existing object in place, so the reference comparison indicates no change and no re-render is triggered.",
        difficulty: "intermediate"
      },
      {
        quizId: reactBaselineQuiz.id,
        questionText: "When should the `useCallback` hook be utilized in a React functional component?",
        options: JSON.stringify([
          "To run synchronous HTTP AJAX network requests before the component mounts",
          "To memoize a callback function reference across re-renders when passing it to memoized child components",
          "To automatically convert functional components into legacy class components",
          "To encrypt client-side cookies before sending them to the backend server"
        ]),
        correctAnswer: 1,
        explanation: "`useCallback` returns a memoized version of the callback that only changes if one of the dependencies has changed. It prevents unnecessary re-renders of memoized child components (`React.memo`) that rely on reference equality.",
        difficulty: "intermediate"
      },
      {
        quizId: reactBaselineQuiz.id,
        questionText: "What is the primary benefit of React Server Components (RSC) in Next.js?",
        options: JSON.stringify([
          "They send zero JavaScript bundle code for server-only components to the client, improving initial page load",
          "They disable all CSS animations across mobile devices",
          "They force all state to be stored in localStorage rather than memory",
          "They replace the Node.js runtime with Apache Tomcat"
        ]),
        correctAnswer: 0,
        explanation: "React Server Components execute entirely on the server and stream rendered HTML/JSON to the client without sending their component dependencies or libraries in the client JavaScript bundle, dramatically reducing bundle size and improving First Contentful Paint.",
        difficulty: "advanced"
      }
    ]
  });

  // TypeScript Baseline Quiz
  const tsBaselineQuiz = await prisma.quiz.create({
    data: {
      title: "TypeScript Diagnostic Quiz",
      description: "Assess understanding of static types, union types, type narrowing, interfaces, and generics.",
      trackId: frontendTrack.id,
      skillId: skillMap["typescript"].id,
      isBaseline: true,
      generatedFrom: "baseline",
      timeLimitMinutes: 10
    }
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: tsBaselineQuiz.id,
        questionText: "What is the key difference between `unknown` and `any` in TypeScript?",
        options: JSON.stringify([
          "They are exact synonyms with identical compiler behavior",
          "`unknown` is type-safe: you cannot access properties or invoke it without first performing type narrowing",
          "`any` only permits primitive boolean and numeric values",
          "`unknown` can only be imported from external Node.js modules"
        ]),
        correctAnswer: 1,
        explanation: "`unknown` is the type-safe counterpart of `any`. Anything is assignable to `unknown`, but TypeScript disallows calling methods or accessing properties on an `unknown` variable until you narrow the type using `typeof`, `instanceof`, or custom type guards.",
        difficulty: "intermediate"
      },
      {
        quizId: tsBaselineQuiz.id,
        questionText: "Which TypeScript utility type creates a new type by selecting a specific subset of properties from type T?",
        options: JSON.stringify([
          "Omit<T, K>",
          "Extract<T, U>",
          "Pick<T, K>",
          "Exclude<T, U>"
        ]),
        correctAnswer: 2,
        explanation: "`Pick<T, K>` constructs a type by picking the set of properties `K` (keys) from type `T`.",
        difficulty: "foundational"
      }
    ]
  });

  // 7. Seed Production Demo Users
  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@skillsetu.dev",
      password: hashedPassword,
      name: "Dr. Sarah Chen",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      hasOnboarded: true
    }
  });

  // Learner 1 (Full Stack Web Track, has notable skill gaps)
  const learnerAarav = await prisma.user.create({
    data: {
      email: "aarav.learner@skillsetu.dev",
      password: hashedPassword,
      name: "Aarav Sharma",
      role: "LEARNER",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      targetTrackId: frontendTrack.id,
      hasOnboarded: true
    }
  });

  // Learner 2 (AI Track, high proficiency)
  const learnerDiya = await prisma.user.create({
    data: {
      email: "diya.learner@skillsetu.dev",
      password: hashedPassword,
      name: "Diya Verma",
      role: "LEARNER",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      targetTrackId: aiDataTrack.id,
      hasOnboarded: true
    }
  });

  // Learner 3 (DevOps Track, beginner)
  const learnerRohan = await prisma.user.create({
    data: {
      email: "rohan.learner@skillsetu.dev",
      password: hashedPassword,
      name: "Rohan Patel",
      role: "LEARNER",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      targetTrackId: cloudDevOpsTrack.id,
      hasOnboarded: true
    }
  });

  // 8. Seed Learner Skill Levels (demonstrating realistic gap profiles)
  // Aarav: React = 2 (Req 4, Gap 2), TS = 1 (Req 4, Gap 3), Tailwind = 3 (Met), Node = 2 (Req 4, Gap 2), Postgres = 1 (Req 4, Gap 3)
  await prisma.learnerSkillLevel.createMany({
    data: [
      { learnerId: learnerAarav.id, skillId: skillMap["react-nextjs"].id, currentLevel: 2, source: "assessment" },
      { learnerId: learnerAarav.id, skillId: skillMap["typescript"].id, currentLevel: 1, source: "self-rated" },
      { learnerId: learnerAarav.id, skillId: skillMap["tailwind-ui"].id, currentLevel: 3, source: "assessment" },
      { learnerId: learnerAarav.id, skillId: skillMap["nodejs-express"].id, currentLevel: 2, source: "self-rated" },
      { learnerId: learnerAarav.id, skillId: skillMap["postgres-prisma"].id, currentLevel: 1, source: "self-rated" }
    ]
  });

  // Diya: Python = 4 (Req 5, Gap 1), SQL = 4 (Met), ML = 3 (Req 4, Gap 1), GenAI = 3 (Req 4, Gap 1), DataViz = 3 (Met)
  await prisma.learnerSkillLevel.createMany({
    data: [
      { learnerId: learnerDiya.id, skillId: skillMap["python-data"].id, currentLevel: 4, source: "assessment" },
      { learnerId: learnerDiya.id, skillId: skillMap["sql-analytics"].id, currentLevel: 4, source: "assessment" },
      { learnerId: learnerDiya.id, skillId: skillMap["machine-learning"].id, currentLevel: 3, source: "self-rated" },
      { learnerId: learnerDiya.id, skillId: skillMap["generative-ai"].id, currentLevel: 3, source: "self-rated" },
      { learnerId: learnerDiya.id, skillId: skillMap["data-viz"].id, currentLevel: 3, source: "self-rated" }
    ]
  });

  // 9. Seed Quiz Attempts
  const aaravAttempt = await prisma.quizAttempt.create({
    data: {
      learnerId: learnerAarav.id,
      quizId: reactBaselineQuiz.id,
      score: 3,
      totalQuestions: 4,
      percentage: 75.0,
      passed: true,
      answers: JSON.stringify([
        { questionId: "q1", selectedOption: 1, isCorrect: true, explanation: "Correctly answered Virtual DOM diffing." },
        { questionId: "q2", selectedOption: 1, isCorrect: true, explanation: "Understands immutability and shallow equality." },
        { questionId: "q3", selectedOption: 1, isCorrect: true, explanation: "Correctly identified callback memoization." },
        { questionId: "q4", selectedOption: 1, isCorrect: false, explanation: "Missed React Server Component zero-bundle advantage." }
      ]),
      attemptedAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
    }
  });

  // 10. Seed Initial Learning Path for Aarav
  await prisma.learningPath.create({
    data: {
      learnerId: learnerAarav.id,
      orderedSequence: JSON.stringify([
        { step: 1, courseId: c1_react_found.id, title: c1_react_found.title, skill: "React & Next.js", difficulty: "FOUNDATIONAL" },
        { step: 2, courseId: c1_ts_found.id, title: c1_ts_found.title, skill: "TypeScript", difficulty: "FOUNDATIONAL" },
        { step: 3, courseId: c2_react_inter.id, title: c2_react_inter.title, skill: "React & Next.js", difficulty: "INTERMEDIATE" },
        { step: 4, courseId: c2_ts_inter.id, title: c2_ts_inter.title, skill: "TypeScript", difficulty: "INTERMEDIATE" },
        { step: 5, courseId: c1_node_found.id, title: c1_node_found.title, skill: "Node.js & Express API", difficulty: "FOUNDATIONAL" },
        { step: 6, courseId: c1_db_found.id, title: c1_db_found.title, skill: "PostgreSQL & Prisma ORM", difficulty: "FOUNDATIONAL" },
        { step: 7, courseId: c3_react_adv.id, title: c3_react_adv.title, skill: "React & Next.js", difficulty: "ADVANCED" }
      ]),
      generatedAt: new Date(Date.now() - 86400000 * 2)
    }
  });

  // 11. Seed Rich Activity Logs (powers Admin Logs view with real filters)
  const initialLogs = [
    {
      actorId: adminUser.id,
      actionType: "AUTH_LOGIN",
      metadata: JSON.stringify({ ip: "127.0.0.1", userAgent: "AdminPortal/Chrome", role: "ADMIN" }),
      timestamp: new Date(Date.now() - 86400000 * 3)
    },
    {
      actorId: learnerAarav.id,
      actionType: "AUTH_REGISTER",
      metadata: JSON.stringify({ email: learnerAarav.email, track: "Full Stack Web Engineering" }),
      timestamp: new Date(Date.now() - 86400000 * 3)
    },
    {
      actorId: learnerAarav.id,
      actionType: "TRACK_SELECTED",
      metadata: JSON.stringify({ trackId: frontendTrack.id, trackName: frontendTrack.name }),
      timestamp: new Date(Date.now() - 86400000 * 3)
    },
    {
      actorId: learnerAarav.id,
      actionType: "SKILL_SELF_RATED",
      metadata: JSON.stringify({ skill: "TypeScript", initialLevel: 1, requiredLevel: 4, gap: 3 }),
      timestamp: new Date(Date.now() - 86400000 * 2.5)
    },
    {
      actorId: learnerAarav.id,
      actionType: "QUIZ_ATTEMPTED",
      metadata: JSON.stringify({
        quizId: reactBaselineQuiz.id,
        quizTitle: reactBaselineQuiz.title,
        score: 3,
        totalQuestions: 4,
        percentage: 75.0,
        passed: true
      }),
      timestamp: new Date(Date.now() - 86400000 * 2)
    },
    {
      actorId: learnerAarav.id,
      actionType: "SCORE_CHANGED",
      metadata: JSON.stringify({
        skillName: "React & Next.js",
        oldLevel: 1,
        newLevel: 2,
        trigger: "Quiz Passed (React Core Baseline)"
      }),
      timestamp: new Date(Date.now() - 86400000 * 2)
    },
    {
      actorId: learnerAarav.id,
      actionType: "RECOMMENDATION_RECALCULATED",
      metadata: JSON.stringify({
        trackName: frontendTrack.name,
        orderedStepsCount: 7,
        priorityGap: "TypeScript (Gap: 3)"
      }),
      timestamp: new Date(Date.now() - 86400000 * 2)
    },
    {
      actorId: learnerDiya.id,
      actionType: "AUTH_REGISTER",
      metadata: JSON.stringify({ email: learnerDiya.email, track: "Data Science & AI Engineering" }),
      timestamp: new Date(Date.now() - 86400000 * 1.5)
    },
    {
      actorId: learnerDiya.id,
      actionType: "UPLOAD_PROCESSED",
      metadata: JSON.stringify({
        fileName: "transformer_attention_mechanisms.pdf",
        fileType: "application/pdf",
        extractedLength: 4280,
        ocrUsed: false
      }),
      timestamp: new Date(Date.now() - 86400000 * 1)
    },
    {
      actorId: learnerDiya.id,
      actionType: "QUIZ_GENERATED",
      metadata: JSON.stringify({
        source: "transformer_attention_mechanisms.pdf",
        questionsCount: 5,
        targetSkill: "Generative AI & LLM Systems",
        aiProvider: "Google Gemini API"
      }),
      timestamp: new Date(Date.now() - 86400000 * 1)
    }
  ];

  for (const log of initialLogs) {
    await prisma.activityLog.create({ data: log });
  }

  console.log("✅ Skill Setu Normalized Database Seed Completed!");
  console.log("--------------------------------------------------");
  console.log("🔐 Credentials for instant testing:");
  console.log("   Admin Portal:   admin@skillsetu.dev   / Password123!");
  console.log("   Learner Portal: aarav.learner@skillsetu.dev / Password123!");
  console.log("   AI Learner:     diya.learner@skillsetu.dev  / Password123!");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
