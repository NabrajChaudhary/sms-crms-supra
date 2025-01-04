export function transformId(obj: { _id: any; [key: string]: any }) {
  const { _id, ...rest } = obj;
  return { ...rest, id: _id.toString() };
}

interface DateObject {
  date: Date | string | null;
}

export function formatDate(date: DateObject["date"]): string {
  if (!date) {
    return "Present";
  }
  return new Date(date).toISOString().split("T")[0];
}
