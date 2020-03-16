# Heart of a data scraper

## Development

### Local

#### Run project 

```
npm install
```

```
npm run start:debug
```

or 

```
npm run start
```

## Invoke DSL 

```
POST 
http://localhost:3000
BODY:
{
	"version": "2.0",
    "settings": {
        "window": {
            "width": 1800,
            "height": 800,
            "language": "de"
        }
    },
	"commands": [
		{
			"cmd": "openurl",
			"link": "https://www.google.com/"
		},
		{
			"cmd": "getscreenshot",
			"key": "screenshot"
		},
		{
			"cmd": "gettext",
			"selector": "body",
			"key": "key1"
		}
	]
}
```
