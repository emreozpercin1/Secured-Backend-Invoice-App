function encodeId(id) {
  const obfuscated = ((id * 3) ^ 91034852) - 17;
  let base36 = obfuscated.toString(36);
  base36 = base36.split('').reverse().join('');
  return base36.padStart(6, '0');
}

function decodeId(code) {
  const reversed = code.split('').reverse().join('');
  const number = parseInt(reversed, 36);
  const deobfuscated = (number + 17) ^ 91034852;
  return deobfuscated / 3;
}

module.exports = {
  encodeId,
  decodeId
};