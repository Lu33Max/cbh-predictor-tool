import { useState, useEffect } from "react";

// Calculates the number of pages
const calculateRange = (data, rowsPerPage) => {
    const range = [];
    const num = Math.ceil(data.length / rowsPerPage);
    for (let i = 1; i <= num; i++) {
        range.push(i);
    }
    return range;
};

// Divides the data between all pages
const sliceData = (data, page, rowsPerPage) => {
    return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
};

// Returns all Values and the spliced data
const useTable = (data, page, rowsPerPage) => {
    const [tableRange, setTableRange] = useState([]);
    const [slice, setSlice] = useState([]);
  
    useEffect(() => {
      const range = calculateRange(data, rowsPerPage);
      setTableRange([...range]);
  
      const slice = sliceData(data, page, rowsPerPage);
      setSlice([...slice]);
    }, [data, setTableRange, page, setSlice]);
  
    return { slice, range: tableRange };
};
  
export default useTable;