interface User {
  id: string;
  name: string;
  age: number;
  role: string;
  department: string;
  email: string;
}

const ROLES = ["admin", "user", "moderator"];
const DEPARTMENTS = [
  "engineering",
  "marketing",
  "sales",
  "support",
  "design",
  "product",
  "finance",
  "hr",
  "legal",
  "operations",
];
const FIRST_NAMES = [
  "Ana",
  "Bob",
  "Carlos",
  "Diana",
  "Eva",
  "Frank",
  "Grace",
  "Hugo",
  "Iris",
  "Jack",
];

function generateUsers(count: number): User[] {
  const users: User[] = new Array(count);

  for (let i = 0; i < count; i++) {
    const nameIdx = i % FIRST_NAMES.length;
    users[i] = {
      id: `usr_${String(i).padStart(8, "0")}`,
      name: FIRST_NAMES[nameIdx],
      age: 20 + (i % 50),
      role: ROLES[i % ROLES.length],
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      email: `${FIRST_NAMES[nameIdx].toLowerCase()}_${i}@example.com`,
    };
  }

  return users;
}

function lazy(count: number): () => User[] {
  let cache: User[] | null = null;
  return () => {
    if (cache === null) {
      cache = generateUsers(count);
    }
    return cache;
  };
}

type DatasetEntry = { name: string; data: () => User[] };

const DATASETS: DatasetEntry[] = [
  { name: "n=100", data: lazy(100) },
  { name: "n=10k", data: lazy(10_000) },
  { name: "n=100k", data: lazy(100_000) },
  { name: "n=1M", data: lazy(1_000_000) },
  { name: "n=10M", data: lazy(10_000_000) },
];

const DATASETS_CAPPED: DatasetEntry[] = DATASETS.slice(0, 4);

/**
 * Returns DATASETS_CAPPED when BENCH_CI env var is set, otherwise full DATASETS.
 */
function getDatasets(): DatasetEntry[] {
  return process.env.BENCH_CI ? DATASETS_CAPPED : DATASETS;
}

/**
 * Always capped at 1M — for utilities where 10M is too heavy (e.g. arrayToHash).
 */
function getDatasetsCapped(): DatasetEntry[] {
  return DATASETS_CAPPED;
}

export type { DatasetEntry, User };
export {
  DATASETS,
  DATASETS_CAPPED,
  generateUsers,
  getDatasets,
  getDatasetsCapped,
};
