import type { YearInfo, Dataset, SuspenseResource } from '../utils/types';

function suspensify<T>(promise: Promise<T>): SuspenseResource<T> {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  const suspender = promise.then(
    (res) => {
      status = 'success';
      result = res;
    },
    (err) => {
      status = 'error';
      result = err;
    }
  );
  return {
    read() {
      switch (status) {
        case 'pending':
          throw suspender;
        case 'error':
          throw result;
        default:
          return result as T;
      }
    },
  };
}

let _resource: SuspenseResource<Dataset> | null = null;

async function fetchFileData(): Promise<Dataset> {
  const url = `${import.meta.env.BASE_URL}owid-co2-data.json`;
  const res = await fetch(url, { cache: 'force-cache' });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch CO2 data: ${res.status} ${res.statusText}`
    );
  }
  const json = (await res.json()) as Dataset;

  for (const key of Object.keys(json)) {
    const entry = json[key];
    if (!entry || !Array.isArray(entry.data)) {
      json[key] = {
        ...(entry || {}),
        data: [] as YearInfo[],
      };
    }
  }
  return json;
}

export function useDataResource(): SuspenseResource<Dataset> {
  if (!_resource) {
    _resource = suspensify(fetchFileData());
  }
  return _resource;
}
