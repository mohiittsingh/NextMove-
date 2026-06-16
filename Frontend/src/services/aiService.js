export const getAISummary = async (route) =>
  new Promise((resolve) => {
    window.setTimeout(() => {
      const peakCrowdStop = route.insights?.peakCrowdStop;
      const highestDropStop = route.insights?.highestDropStop;
      const peakDelayPoint = route.insights?.peakDelayPoint;

      const issue =
        route.delay < 5
          ? "Operations are stable, with only minor timing variance across checkpoints."
          : route.delay < 10
            ? "The route is showing moderate delay pressure, likely from congestion around transfer nodes."
            : "The route is under heavy strain and needs intervention around dispatch pacing and peak-load stops.";

      const crowdSignal = peakCrowdStop
        ? `${peakCrowdStop.name} is the heaviest boarding point with ${peakCrowdStop.crowd} passengers.`
        : "Crowd distribution is still manageable.";

      const dropSignal = highestDropStop
        ? `${highestDropStop.name} leads drop-off volume with ${highestDropStop.drop} passengers alighting.`
        : "";

      const delaySignal = peakDelayPoint
        ? `The sharpest delay appears around ${peakDelayPoint.time} at ${peakDelayPoint.delay} minutes.`
        : "";

      resolve(
        `${issue} ${crowdSignal} ${dropSignal} ${delaySignal} Prioritize schedule recovery near the most delayed segment and monitor boarding times for the next 30 minutes.`
      );
    }, 1100);
  });
