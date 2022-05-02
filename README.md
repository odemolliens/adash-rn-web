The project is based on the EXPO framework (https://docs.expo.dev)

# Getting Started

## Installation

`yarn`

# Run the project

`yarn web`

# Configuration

Rename the file config.example.json to config.json and apply the configuration

Rename the file `config.example.json` to `config.json` and adjust the configuration as needed.

Example of configuration can be found at config.example.json

```json
"versionsBar": {
  // activate/deactivate auto-rotation between versions
  "rotationEnabled": true,

  // hide the versions bar
  "hidden": false
}
```

```json
"teamsBar": {
  // hide the teams bar
  "hidden": false
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

List of available panels

```json
"availablePanels": [
  "StatusOperationalChartPanel",
  "GitlabJobsChartPanel",
  "GitlabMergeRequestsChartPanel",
  "GitlabMergeRequestsClosedLast24hPanel",
  "GitlabMergeRequestsListPanel",
  "GitlabPipelinesChartPanel",
  "GitlabPipelineSchedulesPanel",
  "GitlabPipelinesListPanel"
],
```

```json
"tabs": {
  // name of the tab
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

  // name of the tab
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

# Add a new panel

- Place the new panel file into the src/panels directory.
- Make the panel available by adding the name of the file into the configuration availablePanels options.
