# Configuration

Example of configuration can be found at config.example.json

```json
"versionsBar": {
  // activate/deactivate auto-rotation between versions
  "rotationEnabled": true
}
```

Used in the Issues Panel and in the Scheduled Pipeline Panel

```json
"GitLab": {
  "projectId": "PROJECTID",
  "token": "TOKEN"
},
```

List of project teams

```json
"teams": ["TEAM1", "TEAM2", "TEAM3", "TEAM4"]
```

Tabs & Panel

```json
"tabs": {
  "monitoring": {
    // list of panels for the monitoring tab
    "panels": [
      "StatusOperationalChartPanel",
      "BitriseBuildsChartPanel",
      ...other panels
    ],

    // column per row
    "gridSize": 3
  },
  "quality": {
    // list of panels for the monitoring tab
    "panels": ["AllureReportPanel", "SonarPanel"],

    // column per row
    "gridSize": 3
  }
}
```

Customize the light and dark themes

```json
"themes": {
  "light": {
    "backgroundColor": "#16113a",
    "accentBackgroundColor": "#272A53",
    "accentBackgroundColor2": "#fff",
    "textColor": "#fff",
    "textColor2": "#000"
  },
  "dark": {
    "backgroundColor": "#E9EDC4",
    "accentBackgroundColor": "#D9D4AB",
    "accentBackgroundColor2": "#000000",
    "textColor": "#000",
    "textColor2": "#fff"
  }
}
```
