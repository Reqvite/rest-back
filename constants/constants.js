const dishCategories = [
  'Salads',
  'Soups',
  'Pasta and Ravioli',
  'Fish and Seafood',
  'Pizza',
  'Desserts',
  'N|A Bar',
  'Drinks',
];

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const dayOfWeekNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const CHECK_PASSWORD_SCHEMA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/;

module.exports = {
  dishCategories,
  CHECK_PASSWORD_SCHEMA,
  monthNames,
  dayOfWeekNames,
};
