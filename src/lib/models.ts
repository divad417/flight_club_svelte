export interface session {
  id?: string;
  number: number;
  date: string;
  location: string;
  winner?: string;
  beer?: string;
  brewery?: string;
  avg_abv?: number;
  count?: number;
  photos?: string[];
  recap?: string;
}

export interface beer {
  id?: string;
  session: number;
  name: string;
  brewery: string;
  abv: number;
  style: string;
  type: string;
  order: string;
  score: number;
  win: boolean;
  user: string;
}

export interface user {
  id: string;
  name?: string;
  full_name: string;
  email: string;
  photoURL: string;
  count?: number;
  avg_score?: number;
  avg_abv?: number;
  wins?: number;
  win_rate?: number;
  notes?: object[];
}

export const sessionView = [
  { key: 'number', text: 'Session', width: 100, show: (session: session) => session.number },
  { key: 'date', text: 'Date', width: 100, show: (session: session) => session.date },
  { key: 'winner', text: 'Winner', width: 120, show: (session: session) => session.winner ?? '' },
  { key: 'location', text: 'Location', width: 120, show: (session: session) => session.location ?? ''},
  { key: 'beer', text: 'Winning Beer', width: 180, show: (session: session) => session.beer ?? '' },
  { key: 'brewery', text: 'Brewery', width: 180, show: (session: session) => session.brewery ?? '' },
  { key: 'count', text: 'Entries', width: 100, show: (session: session) => session.count ?? '' },
  { key: 'avg_abv', text: 'Avg ABV', width: 120, show: (session: session) => (session.avg_abv ? session.avg_abv.toFixed(1) : '') }
];

export const beerView = [
  { key: 'session', text: 'Session', width: 100, show: (beer: beer) => beer.session },
  { key: 'name', text: 'Name', width: 180, show: (beer: beer) => beer.name ?? '' },
  { key: 'brewery', text: 'Brewery', width: 180, show: (beer: beer) => beer.brewery ?? '' },
  { key: 'type', text: 'Style', width: 180, show: (beer: beer) => beer.type ?? '' },
  { key: 'abv', text: 'ABV', width: 100, show: (beer: beer) => (beer.abv ? beer.abv : '') },
  { key: 'score', text: 'Votes', width: 100, show: (beer: beer) => beer.score },
  { key: 'win', text: 'Result', width: 100, show: (beer: beer) => (beer.win ? 'Win' : '') },
  { key: 'user', text: 'Member', width: 120, show: (beer: beer) => beer.user ?? '' }
];

export const userView = [
  { key: 'name', text: 'Member', width: 120, show: (user: user) => user.name ?? '' },
  { key: 'wins', text: 'Wins', width: 100, show: (user: user) => user.wins ?? '' },
  { key: 'count', text: 'Beers', width: 100, show: (user: user) => user.count ?? '' },
  { key: 'avg_abv', text: 'Avg ABV', width: 120, show: (user: user) => (user.avg_abv ? user.avg_abv.toFixed(1) : '') },
  { key: 'avg_score', text: 'Avg Score', width: 120, show: (user: user) => (user.avg_score ? user.avg_score.toFixed(1) : '') },
  { key: 'win_rate', text: 'Win Rate', width: 120, show: (user: user) => (user.win_rate ? user.win_rate.toFixed(3) : '') },
  { key: 'full_name', text: 'Google Name', width: 180, show: (user: user) => user.full_name },
  { key: 'email', text: 'Email', width: 180, show: (user: user) => user.email }
];
