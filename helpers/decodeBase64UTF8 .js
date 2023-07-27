const decodeBase64UTF8 = (base64String) => {
  // Decode Base64
  const decodedBase64 = Buffer.from(base64String, "base64");

  // Decode UTF-8
  const decodedUTF8 = new TextDecoder().decode(decodedBase64);

  // Parse the JSON data
  const decData = JSON.parse(decodedUTF8);

  return decData;
};

module.exports = decodeBase64UTF8;
