document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const level = document.getElementById('level').value;
  const course = document.getElementById('course').value;
  const matricNumber = document.getElementById('matricNumber').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level, course, matricNumber }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    displayCourses(data.courses);
  } catch (error) {
    console.error('Error:', error);
    alert('Login failed. Please try again.');
  }
});

function displayCourses(courses) {
  const coursesList = document.getElementById('courses');
  coursesList.innerHTML = '';
  
  courses.forEach(course => {
    const li = document.createElement('li');
    li.textContent = `${course.name} - Time: ${course.time}, Venue: ${course.venue}, Lecturer: ${course.lecturer}`;
    coursesList.appendChild(li);
  });

  document.getElementById('coursesList').classList.remove('hidden');
}
