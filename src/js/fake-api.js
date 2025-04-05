const locationIds = [
    { name: 'Airport', id: 'airport' },
    { name: 'T1', id: 'airport/t1' },
    { name: 'Taxi Zone', id: 'airport/taxi_zone' },
    { name: 'Carpark', id: 'airport/carpark' },
    { name: 'T1 Lobby', id: 'airport/t1/lobby' },
    { name: 'T2', id: 'airport/t2' },
    { name: 'T2 Lobby', id: 'airport/t2/lobby' },
];

const incidents = [
    {
        name: 'Liquid Spill',
        id: 1,
        priority: 3,
        datetime: '2018-01-21T22:54:12.000Z',
        locationId: 'airport/t1/lobby',
    },
    {
        name: 'Lost Property',
        id: 2,
        priority: 3,
        datetime: '2018-01-23T18:25:43.511Z',
        locationId: 'airport/t1/lobby',
    },
    {
        name: 'Unattended Baggage',
        id: 3,
        priority: 1,
        datetime: '2018-01-22T07:13:00.000Z',
        locationId: 'airport/t1',
    },
    {
        name: 'Theft',
        id: 4,
        priority: 2,
        datetime: '2018-01-22T01:04:24.000Z',
        locationId: 'airport/t2',
    },
    {
        name: 'Fire',
        id: 5,
        datetime: '2018-01-22T11:25:18.000Z',
        priority: 1,
        locationId: 'airport/t2',
    },
];

const incidentsLookup = {
    airport: incidents,
    'airport/t1': [incidents[0], incidents[1], incidents[2]],
    'airport/t1/lobby': [incidents[0], incidents[1]],
    'airport/t2': [incidents[3]],
};

const fakeResponse = (fakeData) =>
    new Promise((resolve, reject) => setTimeout((_) => resolve(fakeData), 100));

export default {
    getLocations: () => fakeResponse(locationIds),
    getIncidentsByLocationId: (locationId) =>
        fakeResponse(incidentsLookup[locationId] || []),
};
