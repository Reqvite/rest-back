const dishCategories = [
  'Appetizers',
  'Salads',
  'Soups',
  'Pasta and Ravioli',
  'Main Courses',
  'Fish and Seafood',
  'Pizza',
  'Side Dishes',
  'Desserts',
  'Bread',
  'Bakery',
  'Add-ons',
  'Beverages',
  'Alcoholic Beverages',
  'Beer',
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

const CHECK_PASSWORD_SCHEMA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/;

module.exports = {
  dishCategories,
  CHECK_PASSWORD_SCHEMA,
  monthNames,
};
