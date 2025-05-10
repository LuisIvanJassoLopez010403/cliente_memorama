import { http, HttpResponse } from 'msw'
import { setupWorker} from 'msw/browser';

export const worker = setupWorker(
  http.get('http://localhost:5173/get-regions', ({ request, params, cookies }) => {
    return HttpResponse.json(
      { regions: ['Kanto', 'Johto', 'Hoen', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Hisui', 'Paldea'] },
      {
        status: 202,
        statusText: 'Mocked status',
      },
    )
  }),
)