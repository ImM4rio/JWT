import { useSearchParams  } from 'react-router-dom';

const useSearchParamsHandler = () => {
  const [ searchParams, setSearchParams] = useSearchParams();

  const updateSearchParams = (params: Record<string, string>, replace: boolean = false) => {

    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);


      Object.entries(params).forEach( ([key, value]) => {
        if(value === null || value === '') newParams.delete(key);
        else newParams.set(key, value);
      });

      return newParams;
    }, {replace})
  }

  const getSearchParam = (key: string) => {
    return searchParams.get(key);
  };

  return {
    searchParams,
    updateSearchParams,
    getSearchParam
  };
};

export default useSearchParamsHandler;