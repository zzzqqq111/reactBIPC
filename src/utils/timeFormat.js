export function formatTime(time) {
  if (time === '合计') {
    return '合计';
  }
  if (!time) {
    return '-';
  }
  const d = new Date(time);
  let hours = d.getHours();
  let minute = d.getMinutes();
  let second = d.getSeconds();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }
  if (second < 10) {
    second = `0${second}`;
  }
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}  ${hours}:${minute}:${second}`;
}

export function getNowTime(dataIndex) {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  let rightDate1 = '';
  let leftDate1 = '';
  let leftDate2 = '';
  let rightDate2 = '';
  if (day < 31 && day > 25) {
    rightDate1 = `${year}-${month}-${day}`;
    leftDate1 = `${year}-${month}-${26}`;
    leftDate2 = `${year}-${month - 1}-${26}`;
    rightDate2 = `${year}-${month}-${25}`;
  } else {
    rightDate1 = `${year}-${month}-${day}`;
    leftDate1 = `${year}-${month - 1}-${26}`;
    leftDate2 = `${year}-${month - 2}-${26}`;
    rightDate2 = `${year}-${month - 1}-${25}`;
  }
  const date1 = `${leftDate1}~${rightDate1}`;
  const date2 = `${leftDate2}~${rightDate2}`;
  return { datetime1: { [dataIndex]: date2 }, datetime2: { [dataIndex]: date1 } };
}
