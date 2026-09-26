import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 px-6 py-4 text-center text-xs text-gray-400 dark:text-gray-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-medium">
          <span>Skill Setu</span>
          <span>•</span>
          <span>AI-Enabled Skill Assessment & Course Recommendation Platform</span>
        </div>
        <div>
          <span>Powered by React 19, Express, Supabase PostgreSQL, Prisma & Google Gemini Flash</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
