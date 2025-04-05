import React, { useEffect, useState } from 'react';
import fakeApi from './js/fake-api';

import './App.css';

const PRIORITY_MAP = {
    1: 'High',
    2: 'Medium',
    3: 'Low',
};

// Simple helper to load icons from the /src/img/ folder
// (Assuming the icons are named alarm-low.png, alarm-medium.png, alarm-high.png)
function getPriorityIcon(priority) {
    return `/img/alarm-${PRIORITY_MAP[priority]}.svg`.toLowerCase();
}

function App() {
    const [incidents, setIncidents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { getLocations, getIncidentsByLocationId } = fakeApi;

    // Fetch data on mount
    useEffect(() => {
        fetchAllIncidents();
    }, []);

    const fetchAllIncidents = async () => {
        try {
            const locations = await getLocations();
            // e.g., returns an array of { id, name }

            // For each location, fetch incidents
            const allIncidents = [];
            for (const loc of locations) {
                const incs = await getIncidentsByLocationId(loc.id);
                // e.g., returns an array of { id, name, datetime, priority, locationId, ... }
                allIncidents.push(...incs);
            }

            // Remove duplicates (by id)
            const uniqueIncidentsById = {};
            allIncidents.forEach((incident) => {
                uniqueIncidentsById[incident.id] = incident;
            });
            const uniqueIncidents = Object.values(uniqueIncidentsById);

            // Sort: priority ascending, then datetime descending
            // priority ascending => 1 < 2 < 3
            // dateTime descending => newer first
            uniqueIncidents.sort((a, b) => {
                const priorityCompare = a.priority - b.priority;
                if (priorityCompare !== 0) return priorityCompare;

                // Convert dateTime to date object for comparison
                const dateA = new Date(a.datetime);
                const dateB = new Date(b.datetime);
                return dateB - dateA; // descending
            });

            setIncidents(uniqueIncidents);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Render either a table or a list, depending on screen width.
    // We'll rely on a CSS media query for the 600px break.
    return (
        <div className='App'>
            <h1>Incidents</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className='responsive-container'>
                    <table className='incidents-table'>
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Incident Name</th>
                                <th>Date Time</th>
                                <th>Priority</th>
                                <th>Location Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidents.map((incident) => {
                                const iconSrc = getPriorityIcon(
                                    incident.priority
                                );
                                const priorityLabel =
                                    PRIORITY_MAP[incident.priority] ||
                                    'Unknown';

                                // Format dateTime in local string
                                const date = new Date(incident.datetime);
                                const dateTimeLocal = date.toLocaleString();

                                return (
                                    <tr
                                        key={incident.id}
                                        className='incident-row'
                                    >
                                        <td>
                                            {iconSrc ? (
                                                <img
                                                    src={iconSrc}
                                                    alt={priorityLabel}
                                                    width='24'
                                                    height='24'
                                                />
                                            ) : (
                                                <span>{priorityLabel}</span>
                                            )}
                                        </td>
                                        <td>{incident.name}</td>
                                        <td>{dateTimeLocal}</td>
                                        <td>{priorityLabel}</td>
                                        <td>
                                            {
                                                incident.locationId /* replaced with name below */
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
