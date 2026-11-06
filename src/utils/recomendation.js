function getRecommendations(answers, coffees) {
  const results = coffees.map((coffee) => {
    let score = 0;

    // ===============================
    // 1. Coffee Strength - 30 Points
    // ===============================

    if (answers[1]) {
      if (answers[1] === coffee.strength) {
        score += 30;
      }
    }

    // ===============================
    // 2. Taste - 25 Points
    // ===============================

    if (answers[2]) {
      if (answers[2] === coffee.taste) {
        score += 25;
      }
    }

    // ===============================
    // 3. Milk Preference - 15 Points
    // ===============================

    if (answers[3]) {
      if (
        answers[3] === coffee.milk ||
        answers[3] === 'Any' ||
        coffee.milk === 'Any'
      ) {
        score += 15;
      }
    }

    // ===============================
    // 4. Temperature - 15 Points
    // ===============================

    if (answers[4]) {
      if (
        answers[4] === coffee.temperature ||
        answers[4] === 'Both' ||
        coffee.temperature === 'Both'
      ) {
        score += 15;
      }
    }

    // ===============================
    // 5. Sweetness - 15 Points
    // ===============================

    if (answers[5]) {
      if (answers[5] === coffee.sweetness) {
        score += 15;
      }
    }

    // ===============================
    // Match Percentage
    // ===============================

    const matchPercentage = score;

    // ===============================
    // Find Matched Preferences
    // ===============================

    const matchedPreferences = [];

    if (
      answers[1] &&
      answers[1] === coffee.strength
    ) {
      matchedPreferences.push(
        `${coffee.strength.toLowerCase()} strength`
      );
    }

    if (
      answers[2] &&
      answers[2] === coffee.taste
    ) {
      matchedPreferences.push(
        `${coffee.taste.toLowerCase()} taste`
      );
    }

    if (
      answers[3] &&
      (
        answers[3] === coffee.milk ||
        answers[3] === 'Any' ||
        coffee.milk === 'Any'
      )
    ) {
      matchedPreferences.push(
        `${coffee.milk.toLowerCase()}`
      );
    }

    if (
      answers[4] &&
      (
        answers[4] === coffee.temperature ||
        answers[4] === 'Both' ||
        coffee.temperature === 'Both'
      )
    ) {
      matchedPreferences.push(
        `${coffee.temperature.toLowerCase()} temperature`
      );
    }

    if (
      answers[5] &&
      answers[5] === coffee.sweetness
    ) {
      matchedPreferences.push(
        `${coffee.sweetness.toLowerCase()} sweetness`
      );
    }

    // ===============================
    // Personalized Reason
    // ===============================

    let recommendationReason;

    if (matchedPreferences.length === 0) {
      recommendationReason =
        'This coffee is a different option that you can try.';
    } else if (matchedPreferences.length === 1) {
      recommendationReason =
        `This coffee matches your preference for ${matchedPreferences[0]}.`;
    } else if (matchedPreferences.length === 2) {
      recommendationReason =
        `This coffee matches your preferences for ${matchedPreferences[0]} and ${matchedPreferences[1]}.`;
    } else {
      const lastPreference =
        matchedPreferences[matchedPreferences.length - 1];

      const otherPreferences =
        matchedPreferences
          .slice(0, -1)
          .join(', ');

      recommendationReason =
        `This coffee matches your preferences for ${otherPreferences}, and ${lastPreference}.`;
    }

    // ===============================
    // Return Coffee Result
    // ===============================

    return {
      ...coffee,
      matchPercentage,
      recommendationReason
    };
  });

  // ===============================
  // Sort Highest Match First
  // ===============================

  results.sort(
    (a, b) =>
      b.matchPercentage - a.matchPercentage
  );

  // ===============================
  // Return Top 3
  // ===============================

  return results.slice(0, 3);
}

export default getRecommendations;