import { calculateGPA, GRADE_OPTIONS, GRADE_POINTS } from "./gpa.js";

const courseRowsEl = document.querySelector("#courseRows");
const addCourseButtons = [
	document.querySelector("#addCourse"),
	document.querySelector("#addCourseTop"),
	document.querySelector("#addCourseBottom"),
].filter(Boolean);
const clearCoursesBtn = document.querySelector("#clearCourses");
const loadSampleBtn = document.querySelector("#loadSample");

const summaryEls = {
	gpa: document.querySelector("#gpaValue"),
	credits: document.querySelector("#totalCredits"),
	points: document.querySelector("#qualityPoints"),
	message: document.querySelector("#summaryMessage"),
};

let idCounter = 0;
const state = {
	courses: [],
};

const EMPTY_STATE_HTML = `
	<tr class="empty-state">
		<td colspan="5">Add your first course to start calculating.</td>
	</tr>
`;

const sampleCourses = [
	{ name: "Calculus", credits: 5, grade: "A-" },
	{ name: "Biology", credits: 4, grade: "B+" },
	{ name: "US History", credits: 3, grade: "A" },
	{ name: "Spanish III", credits: 3, grade: "B" },
];

function createCourse(overrides = {}) {
	const grade = overrides.grade ?? "A";
	return {
		id: `course-${idCounter++}`,
		name: overrides.name ?? "",
		credits: overrides.credits ?? 3,
		grade,
		points: GRADE_POINTS[grade],
	};
}

function addCourse(overrides = {}) {
	state.courses = [...state.courses, createCourse(overrides)];
	renderCourses();
}

function removeCourse(id) {
	state.courses = state.courses.filter((course) => course.id !== id);
	renderCourses();
}

function updateCourse(id, patch) {
	state.courses = state.courses.map((course) => {
		if (course.id !== id) {
			return course;
		}

		const nextGrade = patch.grade ?? course.grade;
		return {
			...course,
			...patch,
			grade: nextGrade,
			points: GRADE_POINTS[nextGrade],
		};
	});
	updateSummary();
}

function loadSampleData() {
	state.courses = sampleCourses.map((course) => createCourse(course));
	renderCourses();
}

function formatNumber(value, digits = 3) {
	return Number(value || 0).toFixed(digits);
}

function getSummaryMessage(result) {
	if (result.credits === 0) {
		return "Add a course to get started.";
	}

	if (result.gpa >= 3.8) {
		return "Excellent work! You're on track for dean's list performance.";
	}

	if (result.gpa >= 3.0) {
		return "Solid trajectory. Small improvements can have a big impact.";
	}

	return "Keep experimenting with credits and grades to map out your plan.";
}

function updateSummary() {
	const result = calculateGPA(state.courses);
	summaryEls.gpa.textContent = formatNumber(result.gpa);
	summaryEls.credits.textContent = formatNumber(result.credits, 2);
	summaryEls.points.textContent = formatNumber(result.qualityPoints);
	summaryEls.message.textContent = getSummaryMessage(result);
}

function renderCourses() {
	if (state.courses.length === 0) {
		courseRowsEl.innerHTML = EMPTY_STATE_HTML;
		updateSummary();
		return;
	}

	courseRowsEl.innerHTML = "";
	state.courses.forEach((course, index) => {
		courseRowsEl.appendChild(renderCourseRow(course, index));
	});
	updateSummary();
}

function renderCourseRow(course, index) {
	const tr = document.createElement("tr");
	tr.dataset.id = course.id;
	tr.innerHTML = `
		<td data-label="Course">
			<label class="sr-only" for="course-${course.id}-name">Course name</label>
			<input id="course-${course.id}-name" type="text" placeholder="Course ${index + 1}" />
		</td>
		<td data-label="Credits">
			<label class="sr-only" for="course-${course.id}-credits">Credits</label>
			<input id="course-${course.id}-credits" type="number" min="0" max="30" step="0.5" />
		</td>
		<td data-label="Grade">
			<label class="sr-only" for="course-${course.id}-grade">Letter grade</label>
			<select id="course-${course.id}-grade"></select>
		</td>
		<td data-label="Pts">
			<span class="sr-only" id="course-${course.id}-points-label">Grade points</span>
			<span class="points-display" aria-labelledby="course-${course.id}-points-label" aria-live="polite"></span>
		</td>
		<td class="actions-col" data-label="Actions">
			<div class="row-actions">
				<button type="button" aria-label="Remove course">Remove</button>
			</div>
		</td>
	`;

	const nameInput = tr.querySelector(`#course-${course.id}-name`);
	const creditsInput = tr.querySelector(`#course-${course.id}-credits`);
	const gradeSelect = tr.querySelector(`#course-${course.id}-grade`);
	const pointsDisplay = tr.querySelector(".points-display");
	const removeBtn = tr.querySelector(".row-actions button");

	nameInput.value = course.name;
	creditsInput.value = Number.isFinite(course.credits) ? course.credits : "";
	pointsDisplay.textContent = formatNumber(course.points, 2);

	GRADE_OPTIONS.forEach((grade) => {
		const option = document.createElement("option");
		option.value = grade;
		option.textContent = grade;
		option.selected = grade === course.grade;
		gradeSelect.appendChild(option);
	});

	nameInput.addEventListener("input", (event) =>
		updateCourse(course.id, { name: event.target.value })
	);

	creditsInput.addEventListener("input", (event) => {
		const value = event.target.value;
		updateCourse(course.id, { credits: value === "" ? "" : Number(value) });
	});

	gradeSelect.addEventListener("change", (event) => {
		const newGrade = event.target.value;
		pointsDisplay.textContent = formatNumber(GRADE_POINTS[newGrade], 2);
		updateCourse(course.id, { grade: newGrade });
	});

	removeBtn.addEventListener("click", () => removeCourse(course.id));

	return tr;
}

addCourseButtons.forEach((btn) =>
	btn?.addEventListener("click", () => addCourse())
);

clearCoursesBtn?.addEventListener("click", () => {
	state.courses = [];
	renderCourses();
});

loadSampleBtn?.addEventListener("click", () => loadSampleData());

const currentYearEl = document.querySelector("#currentYear");
if (currentYearEl) {
	currentYearEl.textContent = new Date().getFullYear();
}
