const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (unformattedDate) => {
  const date = new Date(unformattedDate);

  const formattedDate = date.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formattedDate;
};

module.exports = {
  capitalize,
  formatDate,
};
