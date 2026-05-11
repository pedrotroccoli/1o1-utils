import numeral from "numeral";
import "numeral/locales/pt-br.js";
import parseDecimalNumber from "parse-decimal-number";
import { Bench } from "tinybench";
import { toNumber } from "./index.js";

const simple = { value: "12.5" };
const alphanumeric = { value: "123abc456" };
const usCurrency = { value: "$ 1,234.56" };
const brCurrency = { value: "R$ 1.500,00", locale: "pt-BR" };

const brOpts = { thousands: ".", decimal: "," };

const bench = new Bench({ name: "toNumber", time: 1000 });

numeral.locale("en");

bench
  .add("1o1-utils (simple)", () => {
    toNumber(simple);
  })
  .add("numeral (simple)", () => {
    numeral(simple.value).value();
  })
  .add("parse-decimal-number (simple)", () => {
    parseDecimalNumber(simple.value);
  });

bench
  .add("1o1-utils (alphanumeric)", () => {
    toNumber(alphanumeric);
  })
  .add("numeral (alphanumeric)", () => {
    numeral(alphanumeric.value).value();
  })
  .add("parse-decimal-number (alphanumeric)", () => {
    parseDecimalNumber(alphanumeric.value);
  });

bench
  .add("1o1-utils (us-currency)", () => {
    toNumber(usCurrency);
  })
  .add("numeral (us-currency)", () => {
    numeral(usCurrency.value).value();
  })
  .add("parse-decimal-number (us-currency)", () => {
    parseDecimalNumber(usCurrency.value);
  });

bench
  .add("1o1-utils (br-currency)", () => {
    toNumber(brCurrency);
  })
  .add("numeral (br-currency)", () => {
    numeral.locale("pt-br");
    const v = numeral(brCurrency.value).value();
    numeral.locale("en");
    return v;
  })
  .add("parse-decimal-number (br-currency)", () => {
    parseDecimalNumber(brCurrency.value, brOpts);
  });

export { bench };
