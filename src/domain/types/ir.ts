export type PiName = {
  /**
   * Matches any part of the PI's name.
   * Supports partial (substring) matching.
   *
   * Example:
   *  - "mit" → matches "Mitchell"
   */
  anyName?: string;

  /**
   * First name of the PI.
   * Supports partial (prefix/substring) matching.
   *
   * Example:
   *  - "Jo" → matches "John", "Joseph"
   */
  firstName?: string;

  /**
   * Last name of the PI.
   * Supports partial (prefix/substring) matching.
   *
   * Example:
   *  - "Smi" → matches "Smith"
   */
  lastName?: string;

  /**
   * Middle name of the PI.
   * Typically requires exact match (API-dependent).
   */
  middleName?: string;
};