import React, { JSX } from "react";
import { AsyncResult } from "../types";

interface AsyncValueWrapperProps<T> {
  state: AsyncResult<T>;
  skeleton?: JSX.Element;
  children: (_data: T) => React.ReactElement;
}

const AsyncValueWrapper = <T,>({
  state,
  skeleton,
  children,
}: AsyncValueWrapperProps<T>) => {
  return state.isLoading ? (
    skeleton ?? <p>loading...</p>
  ) : state.error ? (
    <>error</>
  ) : state.data === undefined ? (
    <>data is undefined</>
  ) : (
    children(state.data as T)
  );
};

export default AsyncValueWrapper;
