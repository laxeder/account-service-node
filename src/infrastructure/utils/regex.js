const hasNumber = new RegExp(/\d/g);
const onlyNumbers = new RegExp("^[0-9]+$");
const hasLetterUpperCase = new RegExp(/[A-Z]/);
const hasLetterLowerCase = new RegExp(/[a_z]/);
const hasAccent = new RegExp(/[\u00C0-\u00FF]+/i);
const hasLetter = new RegExp(/[a-zA-Z\u00C0-\u00FF]+/i);
const onlyLetters = new RegExp("^[a-zA-Z\u00C0-\u00FF]+$");
const isEmail = new RegExp(/(.*?)\w{2}@(.*?)\w{2}[.]\w{2}/);
const hasCharSpecials = new RegExp(/[!@#$%^&*()\-,.?"~`'¨:;_{}|<>/|\\°£¢¬¹²³]/g);
const hasCharSpecialsRG = new RegExp(/[!@#$%^&*(),?"~`'¨:;_{}|<>|\\°£¢¬¹²³]/g);

const hasCharSpecialsEmail = new RegExp(
  /[!#$%^&*(),?"~`'¨:;{}|<>/|\\°£¢¬¹²³]/g
);
const hasLetterPhone = new RegExp(
  /[a-zA-Z_!@#$%¨&*{}|<>/|\\°£¢¬¹²³\[\].,:;?\u00C0-\u00FF]/
);

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
