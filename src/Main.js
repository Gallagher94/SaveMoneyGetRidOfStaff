import React from 'react';
import developers from './developers';

const Main = () => {
  const rota = new Map();

  const getRandomDeveloper = (developers) => {
    return developers[Math.floor(Math.random() * developers.length)];
  };

  const haveNotDoneItDuringCurrentRunAlready = (
    developer,
    week,
    numberOfPairs
  ) => {
    if ((developer.lastWeekOnSupport == null) & (week < numberOfPairs)) {
      return true;
    }

    if (numberOfPairs + developer.lastWeekOnSupport - 1 < week) {
      return true;
    } else {
      return false;
    }
  };

  const getDevelopersAvailableThisWeek = (developers, week) => {
    const result = developers.filter(
      (developer) => !developer.unavailableWeeks.includes(week)
    );
    if (result.length > 0) {
      return result;
    } else {
      const returnValue = getRandomDeveloper(developers);
      return [returnValue];
    }
  };

  const getDevelopersWhoHaveNotDoneSupportThisCycle = (
    developers,
    numberOfPairs,
    week
  ) => {
    const result = developers.filter((developer) =>
      haveNotDoneItDuringCurrentRunAlready(developer, week, numberOfPairs)
    );

    if (result.length > 0) {
      return result;
    } else {
      const returnValue = getRandomDeveloper(developers);
      return [returnValue];
    }
  };

  const getNonActiveDevelopers = (developers) => {
    const result = developers.filter((developer) => !developer.isActive);

    if (result.length > 0) {
      return result;
    } else {
      const returnValue = getRandomDeveloper(developers);
      return [returnValue];
    }
  };

  const getPreferedSkilledDevelopers = (developers, skill) => {
    const result = developers.filter(
      (developer) => developer.primarySkill === skill
    );

    if (result.length > 0) {
      return result;
    } else {
      const returnValue = getRandomDeveloper(developers);
      return [returnValue];
    }
  };

  const getDeveloperForThisWeek = (type, week) => {
    const availableDevelopers = getDevelopersAvailableThisWeek(
      developers,
      week
    );
    if (availableDevelopers.length === 0) {
      throw Error('WHERE IS EVERYONE!!');
    }

    const nonActiveDevelopers = getNonActiveDevelopers(availableDevelopers);

    const developersNotHadTurnInCurrentRun = getDevelopersWhoHaveNotDoneSupportThisCycle(
      nonActiveDevelopers,
      Math.ceil(developers.length / 2),
      week
    );

    const typeDevelopers = getPreferedSkilledDevelopers(
      developersNotHadTurnInCurrentRun,
      type
    );

    return typeDevelopers[0];
  };

  const generateRota = () => {
    var weeks = 52;
    var count = 0;

    for (let week = 0; week < weeks; week++) {
      const developerOne = getDeveloperForThisWeek('Javascript', week);

      developerOne.isActive = true;
      developerOne.lastWeekOnSupport = week;
      developerOne.totalNumberOfTimesOnSupport++;

      const developerTwo = getDeveloperForThisWeek('Java', week);

      developerTwo.isActive = true;
      developerTwo.lastWeekOnSupport = week;
      developerTwo.totalNumberOfTimesOnSupport++;

      if (developerOne.firstName === developerTwo.firstName) {
        console.log(
          'bug in getNonActiveDevelopers, it is not always correctly setting the isActive property to false '
        );
      }

      rota.set(week, [developerOne, developerTwo]);

      /**
       * When we have went through all developers, we reset
       * Keep doing this until we have filled in all weeks needed.
       * 10 developer equals 5 pairs
       * every 5 weeks we reset
       */
      if (count >= developers.length / 2 - 1) {
        developers.map((developer) => (developer.isActive = false));
        count = 0;
      }
      count++;
    }
    console.log(rota);
  };

  return (
    <div>
      <span>Main section</span>
      <button onClick={generateRota}>Generate</button>
    </div>
  );
};

export default Main;
