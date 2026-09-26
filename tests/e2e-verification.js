import fs from "fs";
import path from "path";

const API_BASE = "http://localhost:5000/api";

async function runE2ETests() {
  console.log("=========================================================");
  console.log("🚀 STARTING SKILL SETU FULL-STACK E2E VERIFICATION SUITE");
  console.log("=========================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = "") {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName} ${detail ? `(${detail})` : ""}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  try {
    // 1. Healthcheck & Database Connection
    const healthRes = await fetch(`${API_BASE}/health`);
    const health = await healthRes.json();
    assert(health.status === "healthy", "Backend Healthcheck & DB Connection", health.service);

    // 2. Learner Login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "aarav.learner@skillsetu.dev", password: "Password123!" })
    });
    const loginData = await loginRes.json();
    assert(loginRes.ok && Boolean(loginData.token), "Auth: Learner Login", `User: ${loginData.user?.name} (Role: ${loginData.user?.role})`);
    const learnerToken = loginData.token;
    const learnerHeaders = { "Authorization": `Bearer ${learnerToken}`, "Content-Type": "application/json" };

    // 3. RBAC Enforcement: Learner hitting /api/admin/* MUST return 403 Forbidden!
    const rbacRes = await fetch(`${API_BASE}/admin/analytics`, { headers: learnerHeaders });
    assert(rbacRes.status === 403, "RBAC Security: Learner hitting /api/admin/analytics blocked with 403 Forbidden", `Status: ${rbacRes.status}`);

    // 4. Tracks & Requirements
    const tracksRes = await fetch(`${API_BASE}/tracks`);
    const tracksData = await tracksRes.json();
    assert(Array.isArray(tracksData) && tracksData.length >= 3, "Tracks API", `${tracksData.length} tracks loaded`);

    // 5. Skill Gap Analysis (Weighted Prerequisite Ranking)
    const gapRes = await fetch(`${API_BASE}/gap-analysis/my-gaps`, { headers: learnerHeaders });
    const gapData = await gapRes.json();
    assert(gapRes.ok && gapData.gaps.length > 0, "Skill Gap Analysis API", `Readiness: ${gapData.readinessPercentage}%, Total Gaps: ${gapData.gaps.length}`);
    assert(typeof gapData.gaps[0].priorityWeight === "number", "Gaps have Prerequisite Priority Weighting", `Top Weight: ${gapData.gaps[0]?.priorityWeight}`);

    // 6. Recommendation Engine & Prerequisite Chain Ordering
    const pathRes = await fetch(`${API_BASE}/recommendations/my-path`, { headers: learnerHeaders });
    const pathData = await pathRes.json();
    assert(pathRes.ok && Array.isArray(pathData.path) && pathData.path.length > 0, "Recommendation Engine Path Generated", `${pathData.totalSteps} steps, ${pathData.estimatedHours} hrs`);
    assert(pathData.path[0].difficultyLevel === "FOUNDATIONAL" || pathData.path[0].difficultyLevel === "foundational", "Path Ordered Foundational-First", `Step 1: ${pathData.path[0].title}`);

    // 7. Course Catalogue with Prerequisite Information
    const coursesRes = await fetch(`${API_BASE}/courses`);
    const coursesData = await coursesRes.json();
    assert(Array.isArray(coursesData) && coursesData.length >= 10, "Courses Catalogue", `${coursesData.length} courses`);
    const courseWithPrereq = coursesData.find((c) => Boolean(c.prerequisiteCourse));
    assert(Boolean(courseWithPrereq), "Course Prerequisite Relation Verified", `${courseWithPrereq?.title} requires ${courseWithPrereq?.prerequisiteCourse?.title}`);

    // 8. Self-Rating Calibration & Dynamic Path Recalculation
    const targetSkill = gapData.gaps[0];
    const newRatingLevel = Math.min(5, targetSkill.currentLevel + 1);
    const selfRateRes = await fetch(`${API_BASE}/assessments/self-rate`, {
      method: "POST",
      headers: learnerHeaders,
      body: JSON.stringify({
        ratings: [{ skillId: targetSkill.skillId, level: newRatingLevel }]
      })
    });
    const selfRateData = await selfRateRes.json();
    assert(selfRateRes.ok, "Assessment: Self-Rating Update & Dynamic Recalculation", `Calibrated ${targetSkill.skillName} to L${newRatingLevel}`);

    // 9. AI Quiz Generation from Uploaded Document
    const sampleFilePath = path.resolve("test_syllabus_chapter.txt");
    fs.writeFileSync(
      sampleFilePath,
      `CHAPTER 4: React Component Architecture and Virtual DOM Mechanics
      React utilizes a declarative paradigm where UI is a pure function of component state.
      The Virtual DOM is a lightweight JavaScript representation of the real browser DOM.
      When state mutates, React renders a new virtual DOM tree and performs a diffing reconciliation algorithm.
      By batching updates and only touching the real DOM nodes that actually changed, React avoids expensive browser layout recalibrations and repaints.
      Hooks like useEffect encapsulate lifecycle side-effects, while useMemo memoizes computationally intensive calculation results across renders.`
    );

    const formData = new FormData();
    const fileBlob = new Blob([fs.readFileSync(sampleFilePath)], { type: "text/plain" });
    formData.append("document", fileBlob, "react_chapter4_notes.txt");
    formData.append("skillId", targetSkill.skillId);
    formData.append("numQuestions", "4");

    const quizGenRes = await fetch(`${API_BASE}/quizzes/generate-from-file`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${learnerToken}` },
      body: formData
    });
    const quizGenData = await quizGenRes.json();
    assert(quizGenRes.ok && Boolean(quizGenData.quiz), "AI Quiz Generation from Upload", quizGenData.quiz?.title);
    const createdQuiz = quizGenData.quiz;
    assert(createdQuiz.questions?.length >= 3, "MCQ Array Generated & Persisted", `${createdQuiz.questions?.length} MCQs`);

    // 10. Quiz Attempt Instant Scoring & Score Update
    const answersPayload = {};
    for (const q of createdQuiz.questions) {
      answersPayload[q.id] = q.correctAnswer ?? q.correct_option ?? 0;
    }

    const attemptRes = await fetch(`${API_BASE}/quizzes/${createdQuiz.id}/attempt`, {
      method: "POST",
      headers: learnerHeaders,
      body: JSON.stringify({ answers: answersPayload })
    });
    const attemptData = await attemptRes.json();
    assert(attemptRes.ok, "Quiz Attempt Instant Scoring", `Score: ${attemptData.score}/${attemptData.totalQuestions} (${attemptData.percentage}%)`);
    assert(attemptData.passed === true, "Quiz Attempt Passed Status Verified");
    assert(Boolean(attemptData.updatedSkillLevel), "Progress Update: LearnerSkillLevel Promoted");

    // 11. Admin Login & Authorization
    const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@skillsetu.dev", password: "Password123!" })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.ok && adminLoginData.user?.role === "ADMIN", "Auth: Admin Login Verified", `Role: ${adminLoginData.user?.role}`);
    const adminHeaders = { "Authorization": `Bearer ${adminLoginData.token}`, "Content-Type": "application/json" };

    // 12. Admin Analytics (Allowed for ADMIN)
    const adminAnalyticsRes = await fetch(`${API_BASE}/admin/analytics`, { headers: adminHeaders });
    const adminData = await adminAnalyticsRes.json();
    assert(adminAnalyticsRes.ok, "Admin Analytics API Accessible to ADMIN", `Learners: ${adminData.metrics?.totalLearners}, Quizzes: ${adminData.metrics?.totalQuizzes}`);
    assert(Array.isArray(adminData.commonGaps) && adminData.commonGaps.length > 0, "Admin Common Gaps Telemetry for Recharts", `${adminData.commonGaps.length} gaps`);

    // 13. Admin Learner Directory & Drilldown
    const learnersRes = await fetch(`${API_BASE}/admin/learners`, { headers: adminHeaders });
    const learnersList = await learnersRes.json();
    assert(Array.isArray(learnersList) && learnersList.length > 0, "Admin Learner Directory API", `${learnersList.length} learners`);

    const drilldownRes = await fetch(`${API_BASE}/admin/learners/${loginData.user.id}`, { headers: adminHeaders });
    const drilldownData = await drilldownRes.json();
    assert(drilldownRes.ok && drilldownData.id === loginData.user.id, "Admin Per-Learner Deep Drilldown API", `Drilldown for: ${drilldownData.name}`);

    // 14. Admin Activity Logs with Multi-Filtering
    const logsRes = await fetch(`${API_BASE}/admin/logs?limit=50`, { headers: adminHeaders });
    const logsData = await logsRes.json();
    assert(logsRes.ok && Array.isArray(logsData.logs) && logsData.logs.length > 0, "Admin System Activity Logs API", `${logsData.total} logged events`);

    const filteredLogsRes = await fetch(`${API_BASE}/admin/logs?actionType=QUIZ_ATTEMPTED`, { headers: adminHeaders });
    const filteredLogs = await filteredLogsRes.json();
    assert(filteredLogs.ok !== false && Array.isArray(filteredLogs.logs), "Admin Activity Logs Filtered by Action Type (QUIZ_ATTEMPTED)", `${filteredLogs.logs?.length} matching events`);

    // Cleanup sample file
    if (fs.existsSync(sampleFilePath)) fs.unlinkSync(sampleFilePath);

    console.log("=========================================================");
    console.log(`🎉 ALL TESTS PASSED: ${passed} PASSED, ${failed} FAILED`);
    console.log("=========================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("❌ E2E test execution error:", err);
    process.exit(1);
  }
}

runE2ETests();
