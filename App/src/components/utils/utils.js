export function formatCurrency(num, to = 2, currency = "INR") {
  let newNum = Number.parseFloat(num).toFixed(to);
  switch (currency) {
    case "INR":
      return `₹${newNum}`;
    default:
      return `${newNum}VND`;
  }
}

export function formatSingleNumber(n) {
  return n > 9 ? "" + n : "0" + n;
}

export function convertToSlug(title, id) {
  const renderId = id ? "-" + id : "";
  return title ? title.replace(/ /g, "-").toLowerCase() + renderId : "";
}

export function renderContainer(type) {
  switch (type) {
    case "wide":
      return "container-full-half";
    case "full":
      return "container-full";
    default:
      return "container";
  }
}
