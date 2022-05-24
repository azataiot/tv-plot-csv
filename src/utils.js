import log from "/src/utils/console.js";

/**
 * Make Request
 * @param target:string without the / at the end. example: https://min-api.cryptocompare.com
 * @param path
 * @returns {Promise<any>}
 */
export async function makeRequest(target, path = "") {
  try {
    const uri = path === "" ? `${target}` : `${target}/${path}`;
    const response = await fetch(uri);
    return response.json();
  } catch (err) {
    throw new Error(`can not establish safe connection: ${err.status}`);
  }
}
