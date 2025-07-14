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
    description: "Your password must be at least 8 characters long.",
    validator: (password: string) => password.length >= 8,
  },
  {
    level: 2,
    description:
      "Your password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    validator: (password: string) =>
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    extras: [
      {
        title: "Security Tip",
        type: "text",
        content: "Strong passwords protect your account from hackers!",
      },
    ],
  },
  {
    level: 3,
    description:
      "Your password must include today's date in MM/DD format (e.g., 07/15).",
    validator: (password: string) => {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateFormat = `${month}/${day}`;
      return password.includes(dateFormat);
    },
    extras: [
      {
        title: "Today's Date",
        type: "text",
        content: (() => {
          const today = new Date();
          const month = String(today.getMonth() + 1).padStart(2, "0");
          const day = String(today.getDate()).padStart(2, "0");
          return `${month}/${day}`;
        })(),
      },
    ],
  },
  //   {
  //     level: 4,
  //     description:
  //       "Your password must contain the name of a month and the sum of all digits in your password must equal 25.",
  //     validator: (password: string) => {
  //       const months = [
  //         "january",
  //         "february",
  //         "march",
  //         "april",
  //         "may",
  //         "june",
  //         "july",
  //         "august",
  //         "september",
  //         "october",
  //         "november",
  //         "december",
  //       ];

  //       const hasMonth = months.some((month) =>
  //         password.toLowerCase().includes(month)
  //       );

  //       const digits = password.match(/\d/g);
  //       const digitSum = digits
  //         ? digits.reduce((sum, digit) => sum + parseInt(digit), 0)
  //         : 0;

  //       return hasMonth && digitSum === 25;
  //     },
  //     extras: [
  //       {
  //         title: "Hint",
  //         type: "text",
  //         content:
  //           "The digits in your password should add up to 25, and include a month name!",
  //       },
  //       {
  //         title: "Calculator",
  //         type: "text",
  //         content: "Use numbers like: 9+8+8 = 25 or 7+6+6+6 = 25",
  //       },
  //     ],
  //   },
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
