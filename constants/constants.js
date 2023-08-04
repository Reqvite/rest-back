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

const CHECK_PASSWORD_SCHEMA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/;

module.exports = {
  dishCategories,
  CHECK_PASSWORD_SCHEMA
};