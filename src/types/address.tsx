export interface Address {
  _id: string;
  region: string;
  city: string;
  branchNumber: string;
  address: string;
  phone: string;
  workingHours: { monWed: string; satSun: string };
}
