function makeAttendanceArray() {
    return [
        {
            id: 1,
            firstName: 'May',
            lastName: 'Valentine',
            grade: 7
        },
        {
            id: 2,
            firstName: 'Zato',
            lastName: 'One',
            grade: 6
        },
        {
            id: 3,
            firstName: 'Sol',
            lastName: 'Badguy',
            grade: 8
        },
        {
            id: 4,
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
        firstName: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        lastName: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
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