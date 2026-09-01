/**
 * Formats a numeric amount or string into Uzbek So'm currency format (e.g., "1 500 000 so'm").
 * @param {number|string} amount 
 * @returns {string}
 */
export const formatMoney = (amount) => {
  if (amount === null || amount === undefined || amount === '') return "0 so'm";
  
  // If input already contains "so'm", return as is
  if (typeof amount === 'string' && amount.includes("so'm")) {
    return amount;
  }

  const num = Number(amount);
  if (isNaN(num)) return `${amount} so'm`;

  return num.toLocaleString('ru-RU').replace(/,/g, ' ') + " so'm";
};
