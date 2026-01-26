// src/data/contextBuilder.js

export function buildAirQualityContext({
  currentAQI,
  forecast,
  dominantSource,
  sourceConfidence,
  policySimulation
}) {
  return {
    city: "Delhi",
    date: new Date().toISOString().split("T")[0],
    current_aqi: currentAQI.value,
    aqi_category: currentAQI.category,
    forecast,
    dominant_source: dominantSource,
    source_confidence: sourceConfidence,
    policy_simulation: policySimulation,
    high_risk_groups: ["children", "elderly", "asthma patients"]
  };
}