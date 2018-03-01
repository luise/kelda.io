# Kelda.io Marketing Website

## Usage

### Local Development
Be sure that you have the latest node, npm and [Hugo](https://gohugo.io/) installed. If you need to install hugo, run:

```bash
brew install hugo
```

Next, clone this repository and run:

```bash
npm install
npm run start-dev
```

Then visit http://localhost:3000/ - BrowserSync will automatically reload CSS or
refresh the page when stylesheets or content changes.

### Production
The `npm start` command will start the website without BrowserSync and watch,
served on port 80. This command should only be used in production.

### Build
To build your static output to the `/dist` folder, use:

```bash
npm run build
```
