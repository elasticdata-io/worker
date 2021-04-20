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
http://localhost:3000/worker
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
			"key": "my-screenshot"
		},
		{
			"cmd": "gettext",
			"selector": "body",
			"key": "page-text-content"
		}
	]
}
```


## Docker

### Build 

```
docker build -f install/Dockerfile -t elasticdataio/worker:0.1 .
```

### Push 

```
docker login elasticdataio
docker push elasticdataio/worker:0.1
```