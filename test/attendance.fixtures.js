function makeAttendanceArray() {
    return [
        {
            id: 1,
            first_name: 'May',
            last_name: 'Valentine',
            grade: 7
        },
        {
            id: 2,
            first_name: 'Zato',
            last_name: 'One',
            grade: 6
        },
        {
            id: 3,
            first_name: 'Sol',
            last_name: 'Badguy',
            grade: 8
        },
        {
            id: 4,
            first_name: 'Kokonoe',
            last_name: 'Mercury',
            grade: 8
        },
    ];
  }
  
function makeMaliciousAttendance() {
    const maliciousAttendance = {
        first_name: 'Rocket',
        last_name: 'League',
        grade: 7
    }
    const expectedAttendance = {
        ...maliciousAttendance,
        first_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        last_name: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
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