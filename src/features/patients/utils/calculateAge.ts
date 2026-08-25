export function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) {
    return 0;
  }

  const today = new Date();

  let age =
    today.getFullYear() - birth.getFullYear();

  const month =
    today.getMonth() - birth.getMonth();

  if (
    month < 0 ||
    (month === 0 &&
      today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}