import { useAppStore } from '../store/useAppStore';
import { translations } from './translations';

/**
 * useTranslation hook — returns a `t` function that looks up a nested key
 * from the active language in the global store.
 *
 * Usage:
 *   const { t } = useTranslation();
 *   t('dashboard.brand')        => 'Courtside'
 *   t('dashboard.greeting')('Jan')  => 'Hallo, Jan.'  (for function values)
 *
 * For exercise translations use getExerciseTrans(exId, 'name') etc.
 */
export function useTranslation() {
  const language = useAppStore((state) => state.language) || 'nl';
  const lang = translations[language] || translations['nl'];

  /**
   * Get a translation value by dot-notation key.
   * Returns the value, which may be a string or a function (for dynamic strings).
   */
  const t = (key) => {
    const parts = key.split('.');
    let val = lang;
    for (const part of parts) {
      if (val == null) return key;
      val = val[part];
    }
    return val ?? key;
  };

  /**
   * Get translated exercise fields, falling back to exercises.js source values.
   * @param {object} exercise - the exercise object from exercises.js
   * @param {'name'|'purpose'|'execution'} field
   */
  const getExerciseTrans = (exercise, field) => {
    const exTrans = lang.exercises?.[exercise.id];
    if (exTrans && exTrans[field]) return exTrans[field];
    // Fallback to raw exercise data
    return exercise[field] ?? '';
  };

  return { t, getExerciseTrans, language };
}
