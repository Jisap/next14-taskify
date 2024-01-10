


export const fetcher = (url: string) => fetch(url).then((res) => res.json()); // Hace una petición y la res la transforma a json