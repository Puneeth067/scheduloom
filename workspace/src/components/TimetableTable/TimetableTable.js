const TimetableTable = ({ schedule, classes, periods }) => {
  const generateTable = (schedule) => {
    let teachers = [];
    schedule.forEach((classSchedule) => {
      classSchedule.forEach((daySchedule) => {
        daySchedule.forEach((teacher) => {
          if (teacher !== 0 && !teachers.includes(teacher)) {
            teachers.push(teacher);
          }
        });
      });
    });

    let html = '<table><thead><tr><th>Teacher</th>';
    for (let day = 1; day <= periods.d; day++) {
      html += `<th>Day ${day}</th>`;
    }
    html += '</tr></thead><tbody>';

    teachers.forEach((teacher) => {
      html += `<tr><td>${teacher}</td>`;
      for (let day = 0; day < periods.d; day++) {
        html += `<td><table class="inner-table">`;
        for (let periodIndex = 0; periodIndex < periods.p; periodIndex++) {
          let found = false;
          schedule.forEach((classSchedule, classIndex) => {
            if (classSchedule[day][periodIndex] === teacher) {
              html += `<tr><td>Class ${classIndex + 1} Period ${periodIndex + 1}</td></tr>`;
              found = true;
            }
          });
          if (!found) {
            html += `<tr><td>Free</td></tr>`;
          }
        }
        html += `</table></td>`;
      }
      html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
  };

  return <div dangerouslySetInnerHTML={{ __html: generateTable(schedule) }} />;
};

export default TimetableTable;
