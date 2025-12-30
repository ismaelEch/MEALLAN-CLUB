import { APIURL } from "../config/Url";

/* ============================================================================= 
 Helper
============================================================================= */
const call = async (baseUrl, body) => {
  const checkStatus = async api_response => {
    const response = await api_response.json()
      return response;
  
  };



  const config = {
    method: 'POST',
    body: JSON.stringify(body)
  };

  let response;
  try {
    response = await fetch(`${APIURL + baseUrl}`, config);
    response = await checkStatus(response)
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

/* ============================================================================= 
   concat array
============================================================================= */
const _concatArray = (param, ...arrs) =>
  []
    .concat(...arrs)
    .reduce(
      (a, b) => (!a.filter(c => b[param] === c[param]).length ? [...a, b] : a),
      [],
    );

/* ============================================================================= 
   update object
============================================================================= */
const _updateObject = (param, obj, arr) =>
  arr.map(v => {
    if (v[param] === obj[param]) {
      return obj;
    }
    return v;
  });

/* ============================================================================= 
   delete object
============================================================================= */
const _deleteObject = (param, val, arr) => arr.filter(v => v[param] !== val);

/* Exports
============================================================================= */
export { call, _concatArray, _updateObject, _deleteObject };