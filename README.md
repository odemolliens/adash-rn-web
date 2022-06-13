The project is based on the EXPO framework (https://docs.expo.dev)

# Getting Started

## Try it first!

You can run the sample project located in the example folder.
A Gitlab API token is required in order to download the metrics.
By default the Project ID is configured to gitlab.org repository project Id.

Run the script `start.sh` and insert your Gitlab Project ID\Token when requested and then open the dashboard at the http://localhost:19002

Run the `update.sh` script to collect new metrics (then refresh the page or wait 1 min for the dashboard to detect the changes)

## Installation

`yarn`

# Run the project

`yarn dev`

# Build and deploy

Run `yarn build` to generate a static and optimized version of the dashboard, then deploy the content of the `web-build` folder to your favourite hosting provider.

# Configuration

Rename the file config.example.json to config.json and apply the configuration

Rename the file `config.example.json` to `config.json` and adjust the configuration as needed.

Example of configuration can be found at config.example.json

```json
// activate/deactivate auto-rotation between versions
"versionsBar_rotationEnabled": true/false

// hide the versions bar
"versionsBar_hidden": true/false

```

```json
  // hide the teams bar
"teamsBar_hidden": true/false
```

Metrics endpoint URL

```json
"metricsEndpoint": "http://localhost:3000"
```

Parameters used by the Issues Panel and in the Scheduled Pipeline Panel

```json
// panel specific configurations
"IssueListPanel_projectId": "PROJECTID",
"IssueListPanel_token": "TOKEN"
```

List of project teams

```json
"teamsBar_teams": ["TEAM1", "TEAM2", "TEAM3", "TEAM4"]
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
// list of tabs to display
"tabs": ["monitoring", "quality"],

// list of panels for the monitoring tab
"tabs_monitoring_panels": [
  "StatusOperationalChartPanel",
  "BitriseBuildsChartPanel",
  ...other panels
],

// column per row
"tabs_monitoring_gridSize": 3

// list of panels for the monitoring tab
"tabs_quality_panels": ["AllureReportPanel", "SonarPanel"],

// column per row
"tabs_quality_gridSize": 3
```

Customize the light and dark themes

```json
"themes": ["light", "dark"]
"themes_light_backgroundColor": "#16113a",
"themes_light_accentBackgroundColor": "#272A53",
"themes_light_accentBackgroundColor2": "#fff",
"themes_light_textColor": "#fff",
"themes_light_textColor2": "#000"
"themes_dark_backgroundColor": "#E9EDC4",
"themes_dark_accentBackgroundColor": "#D9D4AB",
"themes_dark_accentBackgroundColor2": "#000000",
"themes_dark_textColor": "#000",
"themes_dark_textColor2": "#fff"
```

# Add a new panel

- Place the new panel file into the src/panels directory.
- Make the panel available by adding the name of the file into the configuration availablePanels options.
