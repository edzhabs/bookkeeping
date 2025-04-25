export const fetchStudents = async (signal: AbortSignal) => {
  const res = await fetch("http://localhost:8080/api/students", { signal });
  if (!res.ok) throw new Error("response was not ok");
  return await res.json();
};
