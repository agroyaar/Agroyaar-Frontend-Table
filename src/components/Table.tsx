import React from "react";
import AsyncValueWrapper from "./AsyncValueWrapper";
import { ListServerResponse, TableProps } from "../types";
import { ServerTable } from "./ServerTable";
import { ClientTable } from "./ClientTable";

export const Table = <T,>(props: TableProps<T>) => {
  const { columns, rowsPerPage, queryResult, direction = "rtl" } = props;

  return (
    <div className="main-container">
      {props.mode === "client" ? (
        <AsyncValueWrapper<ListServerResponse<T> | undefined>
          state={queryResult!}
        >
          {(data) => (
            <ClientTable
              rowsPerPage={rowsPerPage}
              columns={columns}
              data={data![props.dataKey] as T[]}
              direction={direction}
            />
          )}
        </AsyncValueWrapper>
      ) : (
        <ServerTable
          columns={columns}
          queryResult={queryResult}
          rowsPerPage={rowsPerPage}
          direction={direction}
          onFilterChange={props.onFilterChange!}
          onSortChange={props.onSortChange!}
          onPageChange={props.onPageChange!}
        />
      )}
    </div>
  );
};
