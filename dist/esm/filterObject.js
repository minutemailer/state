export default function filterObject(data, keys) {
  return Object.fromEntries(Object.entries(data).filter(([key]) => keys.includes(key)));
}