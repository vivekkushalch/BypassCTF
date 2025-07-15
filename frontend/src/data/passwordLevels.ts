export interface PasswordLevel {
  level: number;
  description: string;
  validator: (password: string) => boolean;
  extras?: {
    title: string;
    url?: string;
    type: "image" | "text" | "link";
    content?: string;
  }[];
}

export const passwordLevels: PasswordLevel[] = [
  {
    level: 1,
    description: "Your password must be at least 5 characters.",
    validator: (password: string) => password.length >= 5,
  },
  {
    level: 2,
    description: "Your password must include a number.",
    validator: (password: string) => /[0-9]/.test(password),
  },
  {
    level: 3,
    description: "Your password must include an uppercase letter.",
    validator: (password: string) => /[A-Z]/.test(password),
  },
  {
    level: 4,
    description: "Your password must include a special character.",
    validator: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
  {
    level: 5,
    description: "The digits in your password must add up to 25.",
    validator: (password: string) => {
      const digits = password.match(/\d/g);
      const sum = digits
        ? digits.reduce((acc, digit) => acc + parseInt(digit), 0)
        : 0;
      return sum === 25;
    },
    extras: [
      {
        title: "Current sum",
        type: "text",
        content: "Check your digit sum below",
      },
    ],
  },
  {
    level: 6,
    description: "Your password must include a month of the year.",
    validator: (password: string) => {
      const months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december",
      ];
      return months.some((month) => password.toLowerCase().includes(month));
    },
    extras: [
      {
        title: "Valid months",
        type: "text",
        content:
          "january, february, march, april, may, june, july, august, september, october, november, december",
      },
    ],
  },
  {
    level: 7,
    description: "Your password must include a roman numeral.",
    validator: (password: string) => {
      const romanNumerals = [
        "I",
        "V",
        "X",
        "L",
        "C",
        "D",
        "M",
        "i",
        "v",
        "x",
        "l",
        "c",
        "d",
        "m",
      ];
      return romanNumerals.some((numeral) => password.includes(numeral));
    },
    extras: [
      {
        title: "Roman numerals",
        type: "text",
        content: "I, V, X, L, C, D, M (case insensitive)",
      },
    ],
  },
  {
    level: 8,
    description:
      "Your password must include one of our sponsors: Pepsi, Starbucks, Shell",
    validator: (password: string) => {
      const sponsors = ["pepsi", "starbucks", "shell"];
      return sponsors.some((sponsor) =>
        password.toLowerCase().includes(sponsor)
      );
    },
    extras: [
      {
        title: "Sponsors",
        type: "text",
        content: "Pepsi, Starbucks, Shell (case insensitive)",
      },
    ],
  },
  {
    level: 9,
    description: "The roman numerals in your password should multiply to 35.",
    validator: (password: string) => {
      const romanMap: { [key: string]: number } = {
        I: 1,
        i: 1,
        V: 5,
        v: 5,
        X: 10,
        x: 10,
        L: 50,
        l: 50,
        C: 100,
        c: 100,
        D: 500,
        d: 500,
        M: 1000,
        m: 1000,
      };

      let product = 1;
      let hasRoman = false;

      for (const char of password) {
        if (romanMap[char]) {
          product *= romanMap[char];
          hasRoman = true;
        }
      }

      return hasRoman && product === 35;
    },
    extras: [
      {
        title: "Roman numeral values",
        type: "text",
        content:
          "I=1, V=5, X=7, L=50, C=100, D=500, M=1000. Multiply to get 35!",
      },
    ],
  },
  {
    level: 10,
    description: "Your password must include today's Wordle answer.",
    validator: (password: string) => {
      // For demo purposes, using a fixed word. In real implementation, this would fetch the actual Wordle answer
      const wordleAnswer = "BLAME"; // This would be dynamic in real implementation
      return password.toLowerCase().includes(wordleAnswer.toLowerCase());
    },
    extras: [
      {
        title: "Today's Wordle",
        type: "text",
        content: "BLAME (this is just a demo word)",
      },
    ],
  },
  {
    level: 11,
    description:
      "Your password must include a two letter symbol from the periodic table.",
    validator: (password: string) => {
      const elements = [
        "He",
        "Li",
        "Be",
        "Ne",
        "Na",
        "Mg",
        "Al",
        "Si",
        "Cl",
        "Ar",
        "Ca",
        "Sc",
        "Ti",
        "Cr",
        "Mn",
        "Fe",
        "Co",
        "Ni",
        "Cu",
        "Zn",
        "Ga",
        "Ge",
        "As",
        "Se",
        "Br",
        "Kr",
        "Rb",
        "Sr",
        "Zr",
        "Nb",
        "Mo",
        "Tc",
        "Ru",
        "Rh",
        "Pd",
        "Ag",
        "Cd",
        "In",
        "Sn",
        "Sb",
        "Te",
        "Xe",
        "Cs",
        "Ba",
        "La",
        "Ce",
        "Pr",
        "Nd",
        "Pm",
        "Sm",
        "Eu",
        "Gd",
        "Tb",
        "Dy",
        "Ho",
        "Er",
        "Tm",
        "Yb",
        "Lu",
        "Hf",
        "Ta",
        "Re",
        "Os",
        "Ir",
        "Pt",
        "Au",
        "Hg",
        "Tl",
        "Pb",
        "Bi",
        "Po",
        "At",
        "Rn",
        "Fr",
        "Ra",
        "Ac",
        "Th",
        "Pa",
        "Np",
        "Pu",
        "Am",
        "Cm",
        "Bk",
        "Cf",
        "Es",
        "Fm",
        "Md",
        "No",
        "Lr",
        "Rf",
        "Db",
        "Sg",
        "Bh",
        "Hs",
        "Mt",
        "Ds",
        "Rg",
        "Cn",
        "Nh",
        "Fl",
        "Mc",
        "Lv",
        "Ts",
        "Og",
      ];
      return elements.some((element) => password.includes(element));
    },
    extras: [
      {
        title: "Examples",
        type: "text",
        content: "He, Li, Be, Ne, Na, Mg, Al, Si, Cl, Ar, Ca, etc.",
      },
    ],
  },
  {
    level: 12,
    description: "Your password must include the length of your password.",
    validator: (password: string) => {
      return password.includes(password.length.toString());
    },
    extras: [
      {
        title: "Hint",
        type: "text",
        content: "If your password is 20 characters long, it must contain '20'",
      },
    ],
  },
  {
    level: 13,
    description:
      "Your password must include the year that BIT was founded (1988).",
    validator: (password: string) => password.includes("1988"),
    extras: [
      {
        title: "BIT History",
        type: "text",
        content: "Birla Institute of Technology was founded in 1988",
      },
    ],
  },
  {
    level: 14,
    description: "Your password must include a leap year.",
    validator: (password: string) => {
      const leapYears = [
        "1996",
        "2000",
        "2004",
        "2008",
        "2012",
        "2016",
        "2020",
        "2024",
        "2028",
        "2032",
      ];
      return leapYears.some((year) => password.includes(year));
    },
    extras: [
      {
        title: "Recent leap years",
        type: "text",
        content: "1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024, 2028, 2032",
      },
    ],
  },
  {
    level: 15,
    description:
      "Your password must include the best programming language (hint: it's JavaScript).",
    validator: (password: string) =>
      password.toLowerCase().includes("javascript"),
    extras: [
      {
        title: "The best language",
        type: "text",
        content: "JavaScript (case insensitive)",
      },
    ],
  },
];

export interface GameState {
  currentLevel: number;
  passedLevels: number[];
  failedLevels: number[];
  isComplete: boolean;
}

export const initialGameState: GameState = {
  currentLevel: 1,
  passedLevels: [],
  failedLevels: [],
  isComplete: false,
};
