import { atom, useAtomValue, useSetAtom } from "jotai";

export interface ErrorMessage {
  title?: string;
  message: string;
  debugInfo: object;
  errorInfo?: object;
}

interface IErrorStore {
  errors: ErrorMessage[];
}
export const errorAtom = atom<IErrorStore>({
  errors: []
});

export const showErrorAtom = atom(null, (get, set, error: ErrorMessage) => {
  const errors = [
    ...get(errorAtom).errors,
    error
  ];
  set(errorAtom, {
    errors
  });
});

export const clearErrorAtom = atom(null, (get, set) => {
  set(errorAtom, {
    errors: []
  });
});

export const useErrorStore = () => {
  const errorStore = useAtomValue(errorAtom);
  const setErrorStore = useSetAtom(errorAtom);
  const clear = () => {
    setErrorStore({
      errors: []
    });
  };

  const showError = (error: ErrorMessage) => {
    const errors = [
      ...errorStore.errors,
      error
    ];
    setErrorStore({
      errors
    });
  };
  return {
    errors: errorStore.errors,
    clear,
    showError
  };
};
