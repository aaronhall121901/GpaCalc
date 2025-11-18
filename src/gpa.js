export const GRADE_POINTS = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0,
};

export const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

export function normalizeCourse(course = {}) {
  const grade = (course.grade || "A").toUpperCase();
  const rawCredits = Number(course.credits);
  const credits = Number.isFinite(rawCredits) ? Math.max(rawCredits, 0) : 0;
  const points = GRADE_POINTS[grade] ?? 0;

  return {
    id: course.id,
    name: course.name?.trim() ?? "",
    grade,
    credits,
    points,
  };
}

export function calculateGPA(courses = []) {
  if (!Array.isArray(courses) || courses.length === 0) {
    return {
      credits: 0,
      qualityPoints: 0,
      gpa: 0,
      normalizedCourses: [],
    };
  }

  const normalizedCourses = courses.map(normalizeCourse).filter((course) => course.credits > 0);

  if (normalizedCourses.length === 0) {
    return {
      credits: 0,
      qualityPoints: 0,
      gpa: 0,
      normalizedCourses,
    };
  }

  const totals = normalizedCourses.reduce(
    (acc, course) => {
      return {
        credits: acc.credits + course.credits,
        qualityPoints: acc.qualityPoints + course.credits * course.points,
      };
    },
    { credits: 0, qualityPoints: 0 }
  );

  return {
    credits: Number(totals.credits.toFixed(2)),
    qualityPoints: Number(totals.qualityPoints.toFixed(3)),
    gpa: Number((totals.qualityPoints / totals.credits).toFixed(3)),
    normalizedCourses,
  };
}
