// Verifica contem números, letras acento
const hasNumber = new RegExp(/\d/g);
const hasLetter = new RegExp(/[a-zA-Z\u00C0-\u00FF]+/i);
const hasAccent = new RegExp(/[\u00C0-\u00FF]+/i);
const hasLetterPhone = new RegExp(
  /[a-zA-Z_!@#$%¨&*{}|<>/|\\°£¢¬¹²³\[\].,:;?\u00C0-\u00FF]/
);

// Verifica se há somente números e letras
const onlyNumbers = new RegExp("^[0-9]+$");
const onlyLetters = new RegExp("^[a-zA-Z\u00C0-\u00FF]+$");

// Verifica se há letras maiúsculas e minúsculas
const hasLetterUpperCase = new RegExp(/[A-Z]/);
const hasLetterLowerCase = new RegExp(/[a_z]/);

// Verifica se contem caracteres especiais
const hasCharSpecials = new RegExp(/[!@#$%^&*()\-,.?"~`'¨:;_{}|<>/|\\°£¢¬¹²³]/g);
const hasCharSpecialsRG = new RegExp(/[!@#$%^&*(),?"~`'¨:;_{}|<>|\\°£¢¬¹²³]/g);
const hasCharSpecialsEmail = new RegExp(
  /[!#$%^&*(),?"~`'¨:;{}|<>/|\\°£¢¬¹²³]/g
);

// Verifica se é um email válido
const isEmail = new RegExp(/(.*?)\w{2}@(.*?)\w{2}[.]\w{2}/);

module.exports = {
  onlyLetters,
  onlyNumbers,
  isEmail,
  hasCharSpecialsEmail,
  hasNumber,
  hasAccent,
  hasCharSpecials,
  hasLetterPhone,
  hasLetter,
  hasLetterLowerCase,
  hasLetterUpperCase,
  hasCharSpecialsRG,
};
