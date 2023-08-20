const parseBool = (params) => {
  return !(
    params === 'undefined' ||
    params === 'false' ||
    params === '0' ||
    params === '' ||
    params === undefined
  );
};

module.exports = parseBool;
