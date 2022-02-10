import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from 'react';
// 제네릭 -> 함수의 매개변수의 타입이 정해지면 함수의 리턴값의 타입도 자동으로 정해지게.
type ReturnTypes<T = any> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];
const useInput = <T = any>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue((e.target.value as unknown) as T);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
