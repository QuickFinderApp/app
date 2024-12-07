import { randomUUID } from "crypto";

/**
 * Offers a method to generate a random string.
 */
export interface RandomStringProvider {
  /**
   * Generates a random string which is cryptographically secure.
   */
  getRandomUUID(): string;
}

function getRandomUUID(): string {
  return randomUUID();
}

const random: RandomStringProvider = { getRandomUUID };
export default random;
