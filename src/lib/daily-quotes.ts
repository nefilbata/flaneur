export const FOOD_QUOTES = [
  {
    text: "\u4eba\u95f4\u70df\u706b\u6c14\uff0c\u6700\u629a\u51e1\u4eba\u5fc3\u3002",
    source: "\u300a\u8001\u6b8b\u6e38\u8bb0\u300b",
  },
  {
    text: "\u98df\u7269\u662f\u6700\u539f\u59cb\u7684\u4e61\u6101\u3002",
    source: "\u6797\u6587\u6708",
  },
  {
    text: "\u65e5\u5556\u8354\u679d\u4e09\u767e\u9897\uff0c\u4e0d\u8f9e\u957f\u4f5c\u5cad\u5357\u4eba\u3002",
    source: "\u82cf\u8f7c",
  },
  {
    text: "\u552f\u6709\u7f8e\u98df\u4e0e\u7231\u4e0d\u53ef\u8f9c\u8d1f\u3002",
    source: "",
  },
  {
    text: "\u4e94\u5473\u6742\u9648\uff0c\u65b9\u77e5\u4eba\u95f4\u503c\u5f97\u3002",
    source: "",
  },
  {
    text: "\u7eff\u8681\u65b0\u9185\u9152\uff0c\u7ea2\u6ce5\u5c0f\u706b\u7089\u3002",
    source: "\u767d\u5c45\u6613",
  },
  {
    text: "\u5473\u9053\u662f\u6700\u597d\u7684\u65f6\u5149\u673a\u3002",
    source: "",
  },
  {
    text: "\u5bf9\u4e8e\u5403\u8d27\u6765\u8bf4\uff0c\u6bcf\u4e00\u4e2a\u57ce\u5e02\u90fd\u662f\u4e00\u5f20\u85cf\u5b9d\u56fe\u3002",
    source: "",
  },
  {
    text: "\u677e\u82b1\u917f\u9152\uff0c\u6625\u6c34\u714e\u8336\u3002",
    source: "\u5f20\u53ef\u4e45",
  },
  {
    text: "\u897f\u585e\u5c71\u524d\u767d\u9e6d\u98de\uff0c\u6843\u82b1\u6d41\u6c34\u9cdc\u9c7c\u80a5\u3002",
    source: "\u5f20\u5fd7\u548c",
  },
];

export function getDailyQuote(): (typeof FOOD_QUOTES)[number] {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return FOOD_QUOTES[seed % FOOD_QUOTES.length];
}
