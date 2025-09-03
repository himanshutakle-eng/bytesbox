import moment from "moment";

function toDate(createdAt: { seconds: number; nanoseconds: number }) {
  if (!createdAt) return new Date();
  return new Date(createdAt?.seconds * 1000 + createdAt?.nanoseconds / 1e6);
}

export function addDateSeparators(messages: any[]) {
  const sorted = [...messages].sort(
    (a, b) =>
      a?.createdAt?.seconds - b?.createdAt?.seconds ||
      a?.createdAt?.nanoseconds - b?.createdAt?.nanoseconds
  );

  const result: any[] = [];
  let lastDate = "";

  sorted.forEach((msg) => {
    const msgDate = moment(toDate(msg.createdAt)).format("YYYY-MM-DD");

    if (msgDate !== lastDate) {
      result.push({
        type: "date",
        id: `date-${msgDate}`,
        date: moment(toDate(msg.createdAt)).calendar(null, {
          sameDay: "[Today]",
          lastDay: "[Yesterday]",
          lastWeek: "dddd",
          sameElse: "MMM D, YYYY",
        }),
      });
      lastDate = msgDate;
    }

    result.push(msg);
  });

  return result;
}

export function capitalizeFirstChar(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
