import { http, HttpResponse } from 'msw'
import { setupWorker} from 'msw/browser';

export const worker = setupWorker(
  http.get('http://localhost:5173/get-regions', ({ request, params, cookies }) => {
    return HttpResponse.json(
      { 
        regions: ['Kanto', 'Johto', 'Hoen', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'] 
      },
      {
        status: 202,
        statusText: 'Mocked status',
      },
    )
  }),
  http.post('http://localhost:5173/get-user', ({ request, params, cookies }) => {
    return HttpResponse.json(
      {
        authToken: "XXXXXXXXXX" 
      },
      {
        status: 202,
        statusText: 'Mocked status',
      },
    )
  }),
)