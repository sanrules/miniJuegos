import { useCallback, useEffect, useState } from 'react';
import type { Country } from '../types/country';

const STORAGE_KEY = 'flags-adaptive-weights';
const INITIAL_WEIGHT = 10;
const WEIGHT_SUCCESS_DELTA = -3;
const WEIGHT_FAILURE_DELTA = 5;
const MIN_WEIGHT = 1;

interface WeightsRecord {
  [countryCode: string]: number;
}

function getInitialWeights(countries: Country[]): WeightsRecord {
  const weights: WeightsRecord = {};
  countries.forEach(country => {
    weights[country.code] = INITIAL_WEIGHT;
  });
  return weights;
}

function loadWeights(countries: Country[]): WeightsRecord {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as WeightsRecord;
      // Ensure all current countries have weights (new countries get initial weight)
      const merged = { ...getInitialWeights(countries), ...parsed };
      return merged;
    }
  } catch {
    // Ignore parse errors, return defaults
  }
  return getInitialWeights(countries);
}

function saveWeights(weights: WeightsRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weights));
  } catch {
    // Ignore quota errors
  }
}

export function useAdaptiveLearning(allCountries: Country[]) {
  const [weights, setWeights] = useState<WeightsRecord>(() => loadWeights(allCountries));

  useEffect(() => {
    setWeights(loadWeights(allCountries));
  }, [allCountries]);

  const adjustWeight = useCallback((countryCode: string, success: boolean) => {
    setWeights(prev => {
      const currentWeight = prev[countryCode] ?? INITIAL_WEIGHT;
      const delta = success ? WEIGHT_SUCCESS_DELTA : WEIGHT_FAILURE_DELTA;
      const newWeight = Math.max(MIN_WEIGHT, currentWeight + delta);
      const updated = { ...prev, [countryCode]: newWeight };
      saveWeights(updated);
      return updated;
    });
  }, []);

  const getRandomCountry = useCallback((filteredCountries: Country[]): Country | null => {
    if (filteredCountries.length === 0) return null;
    if (filteredCountries.length === 1) return filteredCountries[0];

    const validCountries = filteredCountries.filter(c => weights[c.code] !== undefined);
    if (validCountries.length === 0) return filteredCountries[0];

    const totalWeight = validCountries.reduce((sum, c) => sum + (weights[c.code] ?? INITIAL_WEIGHT), 0);
    let random = Math.random() * totalWeight;

    for (const country of validCountries) {
      const weight = weights[country.code] ?? INITIAL_WEIGHT;
      random -= weight;
      if (random <= 0) {
        return country;
      }
    }

    return validCountries[validCountries.length - 1];
  }, [weights]);

  const getWeight = useCallback((countryCode: string): number => {
    return weights[countryCode] ?? INITIAL_WEIGHT;
  }, [weights]);

  const resetWeights = useCallback(() => {
    const initial = getInitialWeights(allCountries);
    setWeights(initial);
    saveWeights(initial);
  }, [allCountries]);

  return {
    adjustWeight,
    getRandomCountry,
    getWeight,
    resetWeights,
    weights,
  };
}