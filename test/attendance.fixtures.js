function makeAttendanceArray() {
    return [
        {
            firstName: 'May',
            lastName: 'Valentine',
            grade: 7
        },
        {
            firstName: 'Zato',
            lastName: 'One',
            grade: 6
        },
        {
            firstName: 'Sol',
            lastName: 'Badguy',
            grade: 8
        },
        {
            firstName: 'Kokonoe',
            lastName: 'Mercury',
            grade: 8
        },
    ];
  }
  
function makeMaliciousAttendance() {
    const maliciousAttendance = {
        firstName: 'Rocket',
        lastName: 'League',
        grade: 7
    }
    const expectedAttendance = {
        ...maliciousAttendance,
        title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
        maliciousAttendance,
        expectedAttendance,
    }
}
  
module.exports = {
makeAttendanceArray,
makeMaliciousAttendance,
}