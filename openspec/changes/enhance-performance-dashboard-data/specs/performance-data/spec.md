# Spec: Performance Data Enhancements

## ADDED Requirements

#### Scenario: Retrieve Performance Summary with Cohort Info
Given a student exists
And the student is part of a cohort of 120 students
When I request the performance summary
Then the response should include `currentRank.totalStudents` equal to 120
And the response should include `totalAchievements` count

#### Scenario: Retrieve Semester History with Attendance
Given a student has completed a semester
And the student attended 95% of classes
When I request the semester performance history
Then the semester record should include `attendance` equal to 95.0
And the semester record should include `totalStudents` in that semester cohort
And the semester record should include `achievements` earned in that semester
