
package edu.ku.bookapi;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/v1/courses")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class CourseController {

    private final List<Course> courses = new ArrayList<>();
    private final AtomicInteger nextId = new AtomicInteger(104);

    public CourseController() {
        courses.add(new Course(101, "EWA301",
                "Enterprise Web Application", 3));
        courses.add(new Course(102, "DB201",
                "Database Systems", 4));
        courses.add(new Course(103, "SE202",
                "Software Engineering", 3));
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(
            @PathVariable int id) {

        return courses.stream()
                .filter(course -> course.getId() == id)
                .findFirst()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Course> addCourse(
            @RequestBody Course course) {

        course.setId(nextId.getAndIncrement());
        courses.add(course);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(course);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable int id,
            @RequestBody Course updatedCourse) {

        if (updatedCourse == null
                || updatedCourse.getCode() == null
                || updatedCourse.getCode().isBlank()
                || updatedCourse.getTitle() == null
                || updatedCourse.getTitle().isBlank()
                || updatedCourse.getCredits() == null
                || updatedCourse.getCredits() < 1) {

            return ResponseEntity.badRequest()
                    .body("Course code, title, and valid credits are required.");
        }

        for (Course course : courses) {
            if (course.getId() == id) {
                course.setCode(updatedCourse.getCode().trim());
                course.setTitle(updatedCourse.getTitle().trim());
                course.setCredits(updatedCourse.getCredits());

                return ResponseEntity.ok(course);
            }
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Course with ID " + id + " was not found.");
    }

    @PostMapping("/test-update")
    public ResponseEntity<String> testUpdate(
            @RequestBody String body) {

        System.out.println("Received raw request body: " + body);

        return ResponseEntity.ok(
                "Request body received: " + body);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(
            @PathVariable int id) {

        boolean removed = courses.removeIf(
                course -> course.getId() == id);

        if (removed) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Course with ID " + id + " was not found.");
    }

  
    public static class Course {

        private Integer id;
        private String code;
        private String title;
        private Integer credits;

        public Course() {
        }

        public Course(Integer id, String code,
                      String title, Integer credits) {
            this.id = id;
            this.code = code;
            this.title = title;
            this.credits = credits;
        }

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public Integer getCredits() {
            return credits;
        }

        public void setCredits(Integer credits) {
            this.credits = credits;
        }
    }

}
