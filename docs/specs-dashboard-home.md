# Route: /dashboard/home

## 1. Overview

The main dashboard home provides a high-level overview of lead generation and contact engagement metrics. It is designed for administrative or marketing users to track performance over various time periods.

## 2. API Usage

- **Current Status**: Backend not implemented. The UI is currently populated with mock data.
- **Proposed Backend Service**: `Dashboard Service` or a similar analytics-focused service.

---

## 3. Data Models

### 3.1. `HomeDashboardSummary`
This is the single object returned by the API. It contains all the necessary data to populate the entire home dashboard.

| Field                  | Type                         | Description                                            |
|------------------------|------------------------------|--------------------------------------------------------|
| `leadGenerationTimeSeries` | `List<LeadDataPoint>`      | Time-series data for the main "Lead generation" chart. |
| `mostVisitedContacts`  | `List<ContactVisit>`         | A list of the most frequently visited contacts.        |
| `leastVisitedContacts` | `List<ContactVisit>`         | A list of the least frequently visited contacts.       |

### 3.2. `LeadDataPoint`
A single data point for the lead generation time-series chart.

| Field       | Type     | Description                                             |
|-------------|----------|---------------------------------------------------------|
| `date`      | `string` | The date for the data point (ISO 8601 format).          |
| `desktop`   | `number` | The number of leads generated from desktop sources.     |
| `mobile`    | `number` | The number of leads generated from mobile sources.      |

### 3.3. `ContactVisit`
Represents a contact and their visit count.

| Field    | Type     | Description                                 |
|----------|----------|---------------------------------------------|
| `name`   | `string` | The name of the contact or company.         |
| `icon`   | `string` | An emoji or icon identifier for the contact. |
| `visits` | `number` | The total number of visits for this contact. |

---

## 4. Endpoints

### GET `/api/v1/dashboard/home-summary`

- **Description**: Retrieves all the necessary data to populate the home dashboard in a single call. The data returned should correspond to the specified date range.
- **Query Parameters**:
  - `range` (optional, string): A predefined time range. Recommended values: `'1d'`, `'3d'`, `'7d'`, `'30d'`.
  - `startDate` (optional, string): A custom start date (ISO 8601), to be used if `range` is set to `'Custom'`.
  - `endDate` (optional, string): A custom end date (ISO 8601), to be used if `range` is set to `'Custom'`.
- **Response Body**: `HomeDashboardSummary`

#### Example Response:
```json
{
  "leadGenerationTimeSeries": [
    { "date": "2024-04-01", "desktop": 222, "mobile": 150 },
    { "date": "2024-04-02", "desktop": 97, "mobile": 180 },
    { "date": "2024-04-03", "desktop": 167, "mobile": 120 },
    { "date": "2024-04-04", "desktop": 242, "mobile": 260 },
    { "date": "2024-04-05", "desktop": 373, "mobile": 290 },
    { "date": "2024-04-06", "desktop": 301, "mobile": 340 },
    { "date": "2024-04-07", "desktop": 245, "mobile": 180 }
  ],
  "mostVisitedContacts": [
    { "name": "Google", "icon": "🔍", "visits": 1543 },
    { "name": "Microsoft", "icon": "💻", "visits": 1289 },
    { "name": "Nvidia", "icon": "🎮", "visits": 976 },
    { "name": "Airbnb", "icon": "🌐", "visits": 854 },
    { "name": "Tesla", "icon": "🚗", "visits": 765 },
    { "name": "Adobe", "icon": "🎨", "visits": 680 }
  ],
  "leastVisitedContacts": [
    { "name": "Disney", "icon": "🎥", "visits": 54 },
    { "name": "Apple", "icon": "🍎", "visits": 68 },
    { "name": "Kathleen Graves", "icon": "👤", "visits": 99 },
    { "name": "Figma", "icon": "✒️", "visits": 112 },
    { "name": "Netflix", "icon": "🎬", "visits": 134 },
    { "name": "Amazon", "icon": "📦", "visits": 155 }
  ]
}
```