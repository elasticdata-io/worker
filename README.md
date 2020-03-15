# Heart of a data scraper

## Development

### Local

#### Run project 

```
npm run start:debug
```

or 

```
npm run start
```

## Invoke dsl 

```
POST 
http://localhost:3000
BODY:
{
	"commands": [
		{
			"cmd": "openurl",
			"link": "https://stackoverflow.com/questions/50675573/how-to-execute-a-js-function-on-the-page-while-automating-in-puppeteer"
		},
		{
			"cmd": "gettext",
			"selector": ".answercell.post-layout--right"
		},
		{
			"cmd": "geturl"
		}
	]
}
```
